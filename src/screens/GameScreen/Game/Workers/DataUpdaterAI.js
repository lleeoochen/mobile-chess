import Backend from 'chessvibe/src/GameBackend';
import Util from 'chessvibe/src/Util';
import * as Const from 'chessvibe/src/Const';
import DataUpdater from './DataUpdater';

export default class DataUpdaterAI extends DataUpdater {

	async updateMatchMoves() {
		await super.updateMatchMoves();

		let game = this.game;

		if (game.turn == Const.TEAM.W && !game.ended) {
			let chosens = this.getBestMove(game.chessboard, game.turn, 3);

			let otherTeam = game.turn == Const.TEAM.B ? Const.TEAM.W : Const.TEAM.B;
			let kingDistanceSort = (a, b) => {
				let { x, y } = game.king_grid[otherTeam];
				let aDist = Math.sqrt(Math.pow(a.oldGrid.x - x, 2) + Math.pow(a.oldGrid.y - y, 2));
				let bDist = Math.sqrt(Math.pow(b.oldGrid.x - x, 2) + Math.pow(b.oldGrid.y - y, 2));
				return aDist - bDist;
			};

			chosens.sort(kingDistanceSort);

			// Weighted random
			let totalWeight = (chosens.length + 1) * chosens.length / 2;
			let rand = Math.floor(Math.random() * totalWeight);
			let chosen = chosens[0];

			// Choose move based on where rand falls
			for (let i in chosens) {
				let weight = chosens.length - i;
				if (rand < weight) {
					chosen = chosens[i];
					break;
				}
				rand -= weight;
			}

			this.moveAI(game.chessboard[chosen.oldGrid.x][chosen.oldGrid.y], game.chessboard[chosen.newGrid.x][chosen.newGrid.y]);
		}
	}

	getBestMove(board, team, depth) {
		let game = this.game;

		let chosenGroups = {
			normal: [],
			check: [],
			stale: [],
		};

		if (depth <= 0) {
			return [];
		}

		for (let i in board) {
			for (let j in board[i]) {

				let oldGrid = board[i][j];
				let oldPiece = game.get_piece(oldGrid);

				// Find best move for each valid grid
				if (oldPiece && oldPiece.team == team) {
					let downward = team == game.turn ? !game.downward : game.downward;
					let moves = oldPiece.getPossibleMoves(game, board, oldGrid, downward);

					// Simulate move
					for (let move of moves) {
						let tempBoard = game.copyBoard(board);
						let newGrid = tempBoard[move.x][move.y];
						let newPiece = game.get_piece(newGrid);
						let value = newPiece ? newPiece.value : 0;

						// Set opponent value to negative
						if (team != game.turn) {
							value *= -1;
						}

						// Simulate eat
						tempBoard[newGrid.x][newGrid.y].piece = tempBoard[oldGrid.x][oldGrid.y].piece;
						tempBoard[oldGrid.x][oldGrid.y].piece = null;

						// Find best move for next round
						let otherTeam = team == Const.TEAM.B ? Const.TEAM.W : Const.TEAM.B;
						let nextBestMoves = this.getBestMove(tempBoard, otherTeam, depth - 1);
						let chosen = 'normal';

						// Add next best move's value
						if (nextBestMoves.length > 0) {
							value += nextBestMoves[0].value * Math.pow(0.9, 4 - depth);
						}
						// Handle checkmate/stalemate cases
						else if (depth != 1) {
							// Checkmate if other team's king is targeted.
							if (game.getReachablePieces(board, game.king_grid[otherTeam], otherTeam).enemies.length != 0) {
								chosen = 'check';
							}
							else {
								chosen = 'stale';
							}
						}

						// Overwrite chosen if value is larger/smaller
						if (team == game.turn) {
							// Maximizer (friend)
							if (chosenGroups[chosen].length == 0 || value > chosenGroups[chosen][0].value) {
								chosenGroups[chosen] = [{ oldGrid, newGrid, value }];
							}
							else if (value == chosenGroups[chosen][0].value) {
								chosenGroups[chosen].push({ oldGrid, newGrid, value });
							}
						}
						else {
							// Minimizer (opponent)
							if (chosenGroups[chosen].length == 0 || value < chosenGroups[chosen][0].value) {
								chosenGroups[chosen] = [{ oldGrid, newGrid, value }];
							}
							else if (value == chosenGroups[chosen][0].value) {
								chosenGroups[chosen].push({ oldGrid, newGrid, value });
							}
						}

						// if (oldPiece.type == 'Queen') {
						// 	if (depth == 3) {
						// 		console.log("==========")
						// 	}
						// 	console.log("    ".repeat(3 - depth) + oldPiece.team + oldPiece.type + " (" + oldGrid.x + ", " + oldGrid.y + ") => (" + newGrid.x + ", " + newGrid.y + "):", value, team != game.turn);
						// }
					}
				}
			}
		}

		if (chosenGroups.check.length > 0)
			return chosenGroups.check;

		if (chosenGroups.normal.length > 0)
			return chosenGroups.normal;

		return chosenGroups.stale;
	}

	moveAI(oldGrid, newGrid) {
		let game = this.game;
		let {ChessMover} = game;
		// let isLegal = game.isKingSafe(game.turn, oldGrid, newGrid);
		// if (!isLegal) return false;

		let grid1 = game.chessboard[Util.flipCoord(oldGrid.x)][Util.flipCoord(oldGrid.y)];
		let grid2 = game.chessboard[Util.flipCoord(newGrid.x)][Util.flipCoord(newGrid.y)];

		Backend.updateChessboard(grid1, grid2, game.turn, game.black_timer, game.white_timer);
		ChessMover.moveChess(oldGrid, newGrid);
		return true;
	}
}
