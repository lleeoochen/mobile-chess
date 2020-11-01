export default class ChessReviewer {
	constructor(game) {
		this.game = game;
		this.stopPlayBack = false;
	}

	async reviewMove(moves_target, timeout=0) {
		let game = this.game;
		let {ChessMover, ChessUnmover} = game;

		clearTimeout(game.delayTimeout);
		this.stopPlayBack = false;

		// Unmove chess until it reaches target move
		while (game.moves_applied > 0 && game.moves_applied > moves_target) {
			await game.delay(timeout);

			if (this.stopPlayBack) {
				break;
			}

			ChessUnmover.unmoveChess();
		}

		// Move chess until it reaches target move
		while (game.moves_applied < game.match.moves.length - 1 && game.moves_applied < moves_target) {
			await game.delay(timeout);
			if (this.stopPlayBack) break;

			let move = game.unpackNextMove();
			this.stopPlayBack = !ChessMover.moveChess(game.chessboard[move.old_x][move.old_y], game.chessboard[move.new_x][move.new_y]);
		}

		this.stopPlayBack = true;
	}

	async pausePlayback() {
		let game = this.game;

		clearTimeout(game.delayTimeout);
		this.stopPlayBack = true;
	}
}
