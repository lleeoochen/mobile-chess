import ChessMover from './ChessMover';
import ChessUnmover from './ChessUnmover';

export default class ChessReviewer {
	static init(game) {
		this.game = game;
	}

	static async reviewMove(moves_target, timeout=0) {
		let game = this.game;

		clearTimeout(game.playTimeout);
		game.stopPlayBack = false;

		// Unmove chess until it reaches target move
		while (game.moves_applied > 0 && game.moves_applied > moves_target) {
			await game.delay(timeout);

			if (game.stopPlayBack) {
				break;
			}

			ChessUnmover.unmoveChess();
		}

		// Move chess until it reaches target move
		while (game.moves_applied < game.match.moves.length - 1 && game.moves_applied < moves_target) {
			await game.delay(timeout);
			if (game.stopPlayBack) break;

			let move = game.unpackNextMove();
			game.stopPlayBack = !ChessMover.moveChess(game.chessboard[move.old_x][move.old_y], game.chessboard[move.new_x][move.new_y]);
		}

		game.stopPlayBack = true;
	}

	static async pausePlayback() {
		let game = this.game;

		clearTimeout(game.playTimeout);
		game.stopPlayBack = true;
	}
}
