import * as Const   from 'chessvibe/src/Const';
import Util         from 'chessvibe/src/Util';
import Backend      from 'chessvibe/src/GameBackend';
import Game         from './Game';
import ChessMover   from './Workers/ChessMover';

export default class GameAI extends Game {

	constructor(team, match_id, match, isMountedRef) {
		super(team, match_id, match, isMountedRef, true);
	}


	async updateMatchMoves() {
		await super.updateMatchMoves();

		if (this.turn == Const.TEAM.W && !this.ended) {
			let chosens = this.getBestMove(this.chessboard, this.turn, 3);

			let otherTeam = this.turn == Const.TEAM.B ? Const.TEAM.W : Const.TEAM.B;
			let kingDistanceSort = (a, b) => {
				let { x, y } = this.king_grid[otherTeam];
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

			this.moveAI(this.chessboard[chosen.oldGrid.x][chosen.oldGrid.y], this.chessboard[chosen.newGrid.x][chosen.newGrid.y]);
		}
	}

	getBestMove(board, team, depth) {
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
				let oldPiece = this.get_piece(oldGrid);

				// Find best move for each valid grid
				if (oldPiece && oldPiece.team == team) {
					let downward = team == this.turn ? !this.downward : this.downward;
					let moves = oldPiece.getPossibleMoves(this, board, oldGrid, downward);

					// Simulate move
					for (let move of moves) {
						let tempBoard = this.copyBoard(board);
						let newGrid = tempBoard[move.x][move.y];
						let newPiece = this.get_piece(newGrid);
						let value = newPiece ? newPiece.value : 0;

						// Set opponent value to negative
						if (team != this.turn) {
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
							if (this.getReachablePieces(board, this.king_grid[otherTeam], otherTeam).enemies.length != 0) {
								chosen = 'check';
							}
							else {
								chosen = 'stale';
							}
						}

						// Overwrite chosen if value is larger/smaller
						if (team == this.turn) {
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
						// 	console.log("    ".repeat(3 - depth) + oldPiece.team + oldPiece.type + " (" + oldGrid.x + ", " + oldGrid.y + ") => (" + newGrid.x + ", " + newGrid.y + "):", value, team != this.turn);
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
		// let isLegal = this.isKingSafe(this.turn, oldGrid, newGrid);
		// if (!isLegal) return false;

		let grid1 = this.chessboard[Util.flipCoord(oldGrid.x)][Util.flipCoord(oldGrid.y)];
		let grid2 = this.chessboard[Util.flipCoord(newGrid.x)][Util.flipCoord(newGrid.y)];

		Backend.updateChessboard(grid1, grid2, this.turn, this.black_timer, this.white_timer);
		ChessMover.moveChess(oldGrid, newGrid);
		return true;
	}
}
