import * as Const from 'chessvibe/src/Const';

export default class ChessMover {

	constructor(game) {
		this.game = game;
	}

	moveChess(oldGrid, newGrid) {
		let game = this.game;

		if (game.get_piece(oldGrid) == null) return false;
		let team = game.get_piece(oldGrid).team;

		this.stackEatenPiece(oldGrid, newGrid, newGrid, newGrid.piece, false, Const.FLAG_NONE);

		//===================== Special Moves ========================

		// Passant Move
		this.movePassantPawn(oldGrid, newGrid);

		// Castle Move
		this.moveCastleKing(oldGrid, newGrid);

		// Remove newGrid piece if being eaten
		if (game.get_piece(newGrid)) {
			game.eaten[game.get_piece(oldGrid).team].push(game.get_piece(newGrid).image);
			game.stats[game.get_piece(newGrid).team] -= Const.VALUE[game.get_piece(newGrid).type];
		}
		newGrid.piece = oldGrid.piece;

		//====================== Update Miscs =======================

		// Pawn to Queen Move
		this.movePawnToQueen(oldGrid, newGrid);

		// Update king position
		if (oldGrid == game.king_grid[team])
			game.king_grid[team] = newGrid;

		// Clear old grid piece
		oldGrid.piece = -1;


		game.switchTurn();

		game.moves_applied ++;

		game.colorLatestMove(oldGrid, newGrid);

		return true;
	}

	movePassantPawn(oldGrid, newGrid) {
		let game = this.game;
		let kill_passant_pawn = false;

		// Check passant pawn can be killed
		if (game.passant_pawn && game.get_piece(oldGrid).type == Const.CHESS.Pawn) {

			if (game.get_piece(oldGrid).team != game.get_piece(game.passant_pawn).team) {
				let downward = game.get_piece(oldGrid).team == game.team ? game.downward : !game.downward;

				if (downward
					&& newGrid.x == game.passant_pawn.x
					&& newGrid.y == game.passant_pawn.y + 1) {
					kill_passant_pawn = true;
				}
				else if (!downward
					&& newGrid.x == game.passant_pawn.x
					&& newGrid.y == game.passant_pawn.y - 1) {
					kill_passant_pawn = true;
				}
			}
		}

		// Kill passant pawn
		if (kill_passant_pawn && game.passant_pawn) {
			game.stats[game.get_piece(game.passant_pawn).team] -= Const.VALUE[game.get_piece(game.passant_pawn).type];
			this.stackEatenPiece(oldGrid, newGrid, game.passant_pawn, game.passant_pawn.piece, true, Const.FLAG_PASSANT_PAWN);
			game.passant_pawn.piece = -1;
		}

		// Update passant pawns on 2 moves
		game.passant_pawn = undefined;
		if (game.get_piece(oldGrid).type == Const.CHESS.Pawn) {
			let downward = game.get_piece(oldGrid).team == game.team ? game.downward : !game.downward;

			if (!downward && oldGrid.y - newGrid.y == 2) {
				game.passant_pawn = newGrid;
			}
			else if (downward && newGrid.y - oldGrid.y == 2) {
				game.passant_pawn = newGrid;
			}
		}
		game.passant_stack.push(game.passant_pawn);
	}

	moveCastleKing(oldGrid, newGrid) {
		let game = this.game;

		// If oldGrid is king
		if (game.get_piece(oldGrid).type == Const.CHESS.King) {

			// If either king hasn't move
			if (game.get_piece(oldGrid).team == Const.TEAM.W && !game.white_king_moved
				|| game.get_piece(oldGrid).team == Const.TEAM.B && !game.black_king_moved) {

				// Perform right castle
				if (newGrid.x - oldGrid.x == 2) {
					game.chessboard[oldGrid.x + 1][oldGrid.y].piece = game.chessboard[Const.BOARD_SIZE - 1][oldGrid.y].piece;
					game.chessboard[Const.BOARD_SIZE - 1][oldGrid.y].piece = -1;
					this.stackEatenPiece(oldGrid, newGrid, newGrid, newGrid.piece, true, Const.FLAG_KING_CASTLE);
				}

				// Perform left castle
				if (newGrid.x - oldGrid.x == -2) {
					game.chessboard[oldGrid.x - 1][oldGrid.y].piece = game.chessboard[0][oldGrid.y].piece;
					game.chessboard[0][oldGrid.y].piece = -1;
					this.stackEatenPiece(oldGrid, newGrid, newGrid, newGrid.piece, true, Const.FLAG_KING_CASTLE);
				}

			}
		}

		//King has moved, cannot castle anymore
		if (game.get_piece(oldGrid).team == Const.TEAM.W && game.get_piece(oldGrid).type == Const.CHESS.King) {
			game.white_king_moved = true;
		}

		//Other King has moved, cannot castle anymore
		if (game.get_piece(oldGrid).team == Const.TEAM.B && game.get_piece(oldGrid).type == Const.CHESS.King) {
			game.black_king_moved = true;
		}
	}

	movePawnToQueen(oldGrid, newGrid) {
		let game = this.game;

		if (game.get_piece(newGrid).type == Const.CHESS.Pawn) {
			let downward = game.get_piece(newGrid).team == game.team ? game.downward : !game.downward;
			let whitePawnArrived = !downward && newGrid.y == 0;
			let blackPawnArrived = downward && newGrid.y == Const.BOARD_SIZE - 1;

			if (whitePawnArrived || blackPawnArrived) {
				let eatenPiece = game.moves_stack.pop().eaten_piece;
				this.stackEatenPiece(oldGrid, newGrid, newGrid, eatenPiece, false, Const.FLAG_PAWN_TO_QUEEN);

				this.initEachPiece(this.id++, newGrid.x, newGrid.y, game.get_piece(newGrid).team, Const.CHESS.Queen);
				game.stats[game.get_piece(newGrid).team] += Const.VALUE[Const.CHESS.Queen] - Const.VALUE[Const.CHESS.Pawn];
			}
		}
	}

	stackEatenPiece(oldGrid, newGrid, eatenGrid, eatenPiece, toPopOne, flag) {
		let game = this.game;

		if (toPopOne) game.moves_stack.pop();
		game.moves_stack.push({
			old_x: oldGrid.x,
			old_y: oldGrid.y,
			new_x: newGrid.x,
			new_y: newGrid.y,
			eaten_x: eatenGrid.x,
			eaten_y: eatenGrid.y,
			eaten_piece: eatenPiece,
			flag: flag
		});
	}
}
