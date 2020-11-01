import * as Const from 'chessvibe/src/Const';

export default class ChessValidator {
	constructor(game) {
		this.game = game;
	}

	// // Check if old grid => new grid is valid
	// isValidMove(oldGrid, newGrid) {
	// 	let game = this.game;

	// 	if (!game.get_piece(oldGrid))
	// 		return;

	// 	game.updateMoves(oldGrid);

	// 	let team = game.get_piece(oldGrid).team;
	// 	let isLegal = this.isLegalMove(newGrid);
	// 	isLegal = isLegal && this.isKingSafe(team, oldGrid, newGrid);

	// 	if (this.canCastle(oldGrid, newGrid))
	// 		return true;

	// 	if (isLegal)
	// 		return true;

	// 	return false;
	// }

	// Check if grid is part of legal moves
	isLegalMove(grid) {
		let game = this.game;

		let legalMove = false;
		for (let i = 0; i < game.moves.length && !legalMove; i++)
			if (grid.x == game.moves[i].x && grid.y == game.moves[i].y)
				legalMove = true;
		return legalMove;
	}

	// Check if king is safe
	isKingSafe(team, oldGrid, newGrid) {
		let game = this.game;

		let board = game.copyBoard(game.chessboard);

		let target_grid = game.king_grid[team];

		if (oldGrid && newGrid) {
			board[newGrid.x][newGrid.y].piece = board[oldGrid.x][oldGrid.y].piece;
			board[oldGrid.x][oldGrid.y].piece = -1;

			if (oldGrid == game.king_grid[team])
				target_grid = newGrid;
		}

		let validPieces = game.getReachablePieces(board, target_grid, team);
		let enemies = validPieces.enemies;

		return enemies.length == 0;
	}

	// Check if can castle
	canCastle(oldGrid, newGrid) {
		let game = this.game;

		if (!game.get_piece(oldGrid)) return;
		let team = game.get_piece(oldGrid).team;

		// Check piece type
		if (game.get_piece(oldGrid) == null) return false;
		if (game.get_piece(oldGrid).type != Const.CHESS.King) return false;

		// Check piece location
		if (newGrid.y != 0 && newGrid.y != Const.BOARD_SIZE - 1) return false;
		if (Math.abs(newGrid.x - oldGrid.x) != 2) return false;

		// Check if king moved
		if (team == Const.TEAM.W && game.white_king_moved) return false;
		if (team == Const.TEAM.B && game.black_king_moved) return false;

		// Check if king is targeted/safe
		if (!this.isKingSafe(team)) return false;


		// Validate left/right castle
		let leftSide = newGrid.x - oldGrid.x < 0;
		if (leftSide) {
			for (let x = 1; x < oldGrid.x; x++)
				if (game.get_piece(game.chessboard[x][game.king_grid[team].y]))
					return false;
			return this.isKingSafe(team, game.king_grid[team], game.chessboard[game.king_grid[team].x - 1][game.king_grid[team].y])
				&& this.isKingSafe(team, game.king_grid[team], game.chessboard[game.king_grid[team].x - 2][game.king_grid[team].y]);
		}
		else {
			for (let x = oldGrid.x + 1; x < Const.BOARD_SIZE - 1; x++)
				if (game.get_piece(game.chessboard[x][game.king_grid[team].y]))
					return false;
			return this.isKingSafe(team, game.king_grid[team], game.chessboard[game.king_grid[team].x + 1][game.king_grid[team].y])
				&& this.isKingSafe(team, game.king_grid[team], game.chessboard[game.king_grid[team].x + 2][game.king_grid[team].y]);
		}
	}

	isCheckmate(team) {
		let game = this.game;

		for (let i = 0; i < game.chessboard.length; i++) {
			for (let j = 0; j < game.chessboard.length; j++) {
				let grid = game.chessboard[i][j];
				if (game.get_piece(grid) != null && game.get_piece(grid).team == team) {
					let validMoves = game.get_piece(grid).getPossibleMoves(game, game.chessboard, grid);

					for (let k = 0; k < validMoves.length; k++) {
						if (this.isKingSafe(team, grid, game.chessboard[validMoves[k].x][validMoves[k].y])) {
							return Const.STATUS_NONE;
						}
					}
				}
			}
		}

		if (this.isKingSafe(team)) {
			return Const.STATUS_STALEMATE;
		}
		return Const.STATUS_CHECKMATE;
	}
}
