import Backend from 'chessvibe/src/GameBackend';
import * as Const from 'chessvibe/src/Const';

export default class TouchHandler {
	constructor(game) {
		this.game = game;
	}

	// Handle chess event with (x, y) click coordinate
	async handleChessEvent(x, y) {
		let game = this.game;
		let {ChessMover, ChessUnmover, ChessValidator} = game;

		if (game.team != game.turn || game.ended) {
			return;
		}

		// Initalize important variables
		let newGrid = game.chessboard[x][y];
		let isLegal = ChessValidator.isLegalMove(newGrid);
		isLegal = isLegal && ChessValidator.isKingSafe(game.team, game.oldGrid, newGrid);

		first_move = false;

		// Action0 - Castle
		if (ChessValidator.canCastle(game.oldGrid, newGrid)) {
			Backend.updateChessboard(game.oldGrid, newGrid, game.turn, game.black_timer, game.white_timer).catch(() => {
				game.clearMoves();
				game.fillGrid(game.oldGrid, Const.COLOR_ORIGINAL);
				ChessUnmover.unmoveChess();
				game.oldGrid = null;
			});

			ChessMover.moveChess(game.oldGrid, newGrid);
			game.oldGrid = null;
			return;
		}

		// Action1 - Deselect Piece by clicking on illegal grid
		if (game.oldGrid != null && !isLegal) {
			game.clearMoves();
			game.fillGrid(game.oldGrid, Const.COLOR_ORIGINAL);
			game.oldGrid = null;
		}

		// Action2 - Select Piece by clicking on grid with active team.
		if (game.get_piece(newGrid) != null && game.get_piece(newGrid).team == game.turn) {
			game.updateMoves(newGrid);
			game.oldGrid = newGrid;
		}

		// Action3 - Move Piece by clicking on empty grid or eat enemy by clicking on legal grid. Switch turn.
		else if (game.oldGrid != null && game.get_piece(game.oldGrid) != null && isLegal) {
			Backend.updateChessboard(game.oldGrid, newGrid, game.turn, game.black_timer, game.white_timer).catch(() => {
				game.clearMoves();
				game.fillGrid(game.oldGrid, Const.COLOR_ORIGINAL);
				ChessUnmover.unmoveChess();
				game.oldGrid = null;
			});

			ChessMover.moveChess(game.oldGrid, newGrid);
			if (game.team == Const.TEAM.B)
				game.black_timer += 1;
			else
				game.white_timer += 1;
			game.oldGrid = null;
		}
	}
}
