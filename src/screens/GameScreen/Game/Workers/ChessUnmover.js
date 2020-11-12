import * as Const from 'chessvibe/src/Const';

export default class ChessUnmover {

	constructor(game) {
		this.game = game;
	}

	// Unmove chess piece from newGrid to oldGrid
	unmoveChess(dryRun=false) {
		let game = this.game;

		if (game.moves_stack.length == 0) return;

		//===================== Unpack passant pawn ========================

		game.passant_stack.pop();
		game.passant_pawn = game.passant_stack[game.passant_stack.length - 1];

		if (game.passant_pawn) {
			game.passant_pawn = game.passant_pawn.clone();
		}

		//===================== Unpack previous moves ========================

		let prev_move = this.unstackEatenPiece();

		let newGrid = game.chessboard[prev_move.new_x][prev_move.new_y];
		let oldGrid = game.chessboard[prev_move.old_x][prev_move.old_y];
		let eatenGrid = game.chessboard[prev_move.eaten_x][prev_move.eaten_y];
		let eaten_piece = prev_move.eaten_piece;
		let flag = prev_move.flag;

		//===================== Special Moves ========================

		//Castle Move
		if (flag == Const.FLAG_KING_CASTLE) {
			this.unmoveCastleKing(newGrid, oldGrid);
		}

		//====================== Redraw Pieces =======================

		//Copy newGrid piece for oldGrid.
		oldGrid.piece = newGrid.piece;

		//====================== Update Miscs =======================

		//Pawn to Queen Move
		if (flag == Const.FLAG_PAWN_TO_QUEEN) {
			this.unmovePawnToQueen(newGrid, oldGrid);
		}

		//Update king position
		game.king_grid[game.get_piece(newGrid).team] = newGrid.sameGrid(game.king_grid[game.get_piece(newGrid).team])
			? oldGrid
			: game.king_grid[game.get_piece(newGrid).team];

		//Clear new grid piece
		newGrid.piece = -1;

		//Restore piece if being eaten
		this.unmoveEatPiece(eatenGrid, eaten_piece);

		//Update move counter and switch turn
		game.moves_applied -= 1;

		//Switch turn
		game.switchTurn();

		//Color old and new grids
		if (!dryRun) {
			game.colorLatestMove(newGrid, oldGrid);
		}
	}

	unmoveEatPiece(eatenGrid, eaten_piece) {
		let game = this.game;

		if (eaten_piece != -1) {
			game.stats[game.pieces[eaten_piece].team] += Const.VALUE[game.pieces[eaten_piece].type];

			eatenGrid.piece = eaten_piece;

			let other_team = game.pieces[eaten_piece].team == Const.TEAM.W ? Const.TEAM.B : Const.TEAM.W;
			const index = game.eaten[other_team].indexOf(game.pieces[eaten_piece].image);
			if (index > -1) {
				game.eaten[other_team].splice(index, 1);
			}
		}
	}

	unmoveCastleKing(newGrid, oldGrid) {
		let game = this.game;

		// Perform right castle
		if (oldGrid.x - newGrid.x == -2) {
			game.chessboard[Const.BOARD_SIZE - 1][newGrid.y].piece = game.chessboard[newGrid.x - 1][newGrid.y].piece;
			game.chessboard[newGrid.x - 1][newGrid.y].piece = -1;
		}

		// Perform left castle
		if (oldGrid.x - newGrid.x == 2) {
			game.chessboard[0][newGrid.y].piece = game.chessboard[newGrid.x + 1][newGrid.y].piece;
			game.chessboard[newGrid.x + 1][newGrid.y].piece = -1;
		}


		if (game.get_piece(newGrid).team == Const.TEAM.W && game.get_piece(newGrid).type == Const.CHESS.King) {
			game.white_king_moved = false;
		}

		if (game.get_piece(newGrid).team == Const.TEAM.B && game.get_piece(newGrid).type == Const.CHESS.King) {
			game.black_king_moved = false;
		}
	}

	unmovePawnToQueen(newGrid, oldGrid) {
		let game = this.game;

		oldGrid.piece = newGrid.piece;
		game.initEachPiece(game.id++, oldGrid.x, oldGrid.y, game.get_piece(oldGrid).team, Const.CHESS.Pawn);

		game.stats[game.get_piece(oldGrid).team] += Const.VALUE[Const.CHESS.Pawn] - Const.VALUE[Const.CHESS.Queen];
	}

	unstackEatenPiece() {
		let game = this.game;

		return game.moves_stack.pop();
	}
}
