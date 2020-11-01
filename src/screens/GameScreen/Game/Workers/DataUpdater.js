import Store, { GameStore } from 'chessvibe/src/redux/Store';
import Backend from 'chessvibe/src/GameBackend';
import Cache from 'chessvibe/src/Cache';
import * as Const from 'chessvibe/src/Const';

export default class DataUpdater {
	constructor(game) {
		this.game = game;
	}

	async updateMatchMoves() {
		let game = this.game;
		let {ChessMover, ChessUnmover} = game;

		while (game.moves_applied > game.match.moves.length) {
			ChessUnmover.unmoveChess();
		}

		while (game.moves_applied < game.match.moves.length) {
			await game.delay(10);

			let move = game.unpackNextMove();
			let success = ChessMover.moveChess(game.chessboard[move.old_x][move.old_y], game.chessboard[move.new_x][move.new_y]);

			if (!success) break;
		}

		// console.log(game.isCheckmate(game.team));
		// console.log(game.isCheckmate(game.enemy));
		switch(game.isCheckmate(game.team)) {
			case Const.STATUS_CHECKMATE:
				Backend.checkmate(game.team == Const.TEAM.W ? Const.TEAM.B : Const.TEAM.W);
				game.ends();
				break;
			case Const.STATUS_STALEMATE:
				Backend.stalemate();
				game.ends();
				break;
		}

		switch(game.isCheckmate(game.enemy)) {
			case Const.STATUS_CHECKMATE:
				Backend.checkmate(game.enemy == Const.TEAM.W ? Const.TEAM.B : Const.TEAM.W);
				game.ends();
				break;
			case Const.STATUS_STALEMATE:
				Backend.stalemate();
				game.ends();
				break;
		}
	}

	updateMatchTimer() {
		let game = this.game;

		let turn = Util.unpack(game.match.moves[game.match.moves.length - 1]).turn == Const.TEAM.B ? Const.TEAM.W : Const.TEAM.B;
		let t1 = new Date(game.match.updated);
		let t2 = new Date();
		let time_since_last_move = Math.floor((t2.getTime() - t1.getTime()) / 1000);

		if (turn == Const.TEAM.B) {
			game.white_timer = game.match.white_timer;
			game.black_timer = game.match.black_timer - time_since_last_move;
		}
		else {
			game.black_timer = game.match.black_timer;
			game.white_timer = game.match.white_timer - time_since_last_move;
		}

		// Many magic numbers.. please fix in the future.
		let network_delay = 1000 - new Date().getMilliseconds();
		if (network_delay > 270) {
			if (turn == Const.TEAM.B) {
				game.black_timer --;
			}
			else {
				game.white_timer --;
			}
		}

		let self = game;
		setTimeout(() => {
			clearInterval(self.interval);
			self.countDown();

			self.interval = setInterval(function() {
				self.countDown();
			}, 1000);
		}, network_delay);
	}

	async updatePlayerData() {
		let game = this.game;

		let { blackPlayer, whitePlayer } = Store.getState().game;

		if (blackPlayer && whitePlayer) {
			return;
		}

		if (!blackPlayer && game.match.black) {
			blackPlayer = (await Backend.getUser(game.match.black)).data;
		}
		if (!whitePlayer && game.match.white) {
			whitePlayer = (await Backend.getUser(game.match.white)).data;
		}

		Cache.users[game.match.black] = blackPlayer;
		Cache.users[game.match.white] = whitePlayer;

		if (game.isMountedRef.current)
			GameStore.updatePlayer({ blackPlayer, whitePlayer });
	}
}
