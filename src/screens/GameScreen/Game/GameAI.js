import Store        from 'chessvibe/src/redux/Store';
import * as Reducer from 'chessvibe/src/redux/Reducer';
import * as Const   from 'chessvibe/src/Const';
import Util         from 'chessvibe/src/Util';
import PieceFactory from './piecefactory';
import Grid         from './grid';
import Backend      from 'chessvibe/src/GameBackend';
import Cache        from 'chessvibe/src/Cache';
import Game         from './Game';

export default class GameAI extends Game {

	constructor(team, match_id, match, isMountedRef) {
		super(team, match_id, match, isMountedRef);
	}


	async updatePlayerData(match) {
		let blackPlayer = Store.getState().blackPlayer;
		let whitePlayer = Store.getState().whitePlayer;

		if (blackPlayer && whitePlayer) return;

		if (!blackPlayer && match.black) {
			blackPlayer = (await Backend.getUser(match.black)).data;
		}

		if (!whitePlayer) {
			whitePlayer = {
				name: 'AI',
			};
		}

		Cache.users[match.black] = blackPlayer;

		if (this.isMountedRef.current) {
			Store.dispatch(Reducer.updatePlayer( { blackPlayer, whitePlayer } ));
		}
	}


	async updateMatchMoves(match) {
		await super.updateMatchMoves(match);

		if (this.turn == Const.TEAM.W) {
			this.moveAI();
		}
	}

	moveAI() {
		for (let i in this.chessboard) {
			for (let j in this.chessboard[i]) {

				let grid = this.chessboard[i][j];
				let piece = this.get_piece(grid);
				if (!piece || piece.team != this.turn) continue;

				let moves = piece.getPossibleMoves(this, this.chessboard, grid, !this.downward);
				for (let m in moves) {
					let newGrid = this.chessboard[moves[m].x][moves[m].y];

					let grid1 = this.chessboard[Util.flipCoord(grid.x)][Util.flipCoord(grid.y)];
					let grid2 = this.chessboard[Util.flipCoord(newGrid.x)][Util.flipCoord(newGrid.y)];
					Backend.updateChessboard(grid1, grid2, this.turn, this.black_timer, this.white_timer).catch(err => {
						this.clearMoves();
						this.unmoveChess();
					});
					this.moveChess(grid, newGrid);
					return;
				}
			}
		}
	}


}
