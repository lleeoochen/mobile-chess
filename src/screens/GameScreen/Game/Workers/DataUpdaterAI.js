import Backend from 'chessvibe/src/GameBackend';
import Util from 'chessvibe/src/Util';
import * as Const from 'chessvibe/src/Const';
import DataUpdater from './DataUpdater';

const MAX_FUTURE_LOOK = 3;
const GROUP_FLAG = {
	NORMAL: 'normal',
	CHECKMATE: 'checkmate',
	STALEMATE: 'stalemate',
};

export default class DataUpdaterAI extends DataUpdater {

	async updateMatchMoves() {
		await super.updateMatchMoves();

		let game = this.game;

		if (game.turn == Const.TEAM.W && !game.ended) {
			let chosens = this.getBestMove(game.cloneGame(), game.turn, MAX_FUTURE_LOOK);

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

			// console.log('===========');
			// console.log(chosens.map(c => this.getValueGroupStr(c)));
			// console.log('Chosen: ');
			// console.log(this.getValueGroupStr(chosen));
			// console.log('===========');

			this.moveAI(game.chessboard[chosen.oldGrid.x][chosen.oldGrid.y], game.chessboard[chosen.newGrid.x][chosen.newGrid.y]);
		}
	}

	getBestMove(game, origTeam, depth) {
		if (depth <= 0) {
			return [];
		}

		let chosenGroups = {
			[GROUP_FLAG.NORMAL]: [],
			[GROUP_FLAG.CHECKMATE]: [],
			[GROUP_FLAG.STALEMATE]: [],
		};

		for (let i in game.chessboard) {
			for (let j in game.chessboard[i]) {
				const oldGrid = game.chessboard[i][j];
				const oldPiece = game.get_piece(oldGrid);

				// Skip irrelevant grid
				if (!oldPiece || oldPiece.team !== game.turn) {
					continue;
				}

				// Update all available moves for old grid
				game.updateMoves(oldGrid, true);

				// Find best move with highest value
				for (let move of game.moves) {
					const newGrid = game.chessboard[move.x][move.y];

					// Simulate move
					const {valueGroup, gameEnds} = this.simulateMove(game, origTeam, depth, oldGrid, newGrid);

					// Save the best-value group 
					this.updateValueGroup(chosenGroups, gameEnds, game, valueGroup, origTeam);

					// Very good debug line
					// this.debug_getBestMove(game, i, j, move, depth, oldPiece, valueGroup, nextBestMoves);
				}
			}
		}

		// Return chosen group based on priority CHECKMATE > STALEMATE > NORMAL
		if (chosenGroups[GROUP_FLAG.CHECKMATE].length > 0) {
			return chosenGroups[GROUP_FLAG.CHECKMATE];
		}
		if (chosenGroups[GROUP_FLAG.NORMAL].length > 0) {
			return chosenGroups[GROUP_FLAG.NORMAL];
		}
		return chosenGroups[GROUP_FLAG.STALEMATE];
	}

	simulateMove(game, origTeam, depth, oldGrid, newGrid) {
		// Value calculation init
		let oldValue = game.stats[game.team] - game.stats[game.enemy];
		let value = game.turn === origTeam ? 1 : -1;

		// Simulation starts
		game.ChessMover.moveChess(oldGrid, newGrid, true);
		game.downward = !game.downward;

		// Value calculation
		let newValue = game.stats[game.team] - game.stats[game.enemy];
		value *= Math.abs(newValue - oldValue);

		// Find next best move of opponent
		let nextBestMoves = this.getBestMove(game, origTeam, depth - 1);
		if (nextBestMoves.length > 0) {
			// Future value are weighted less (in case killing our king is weighted
			// the same as killing opponent's king)
			value += nextBestMoves[0].value * Math.pow(0.9, MAX_FUTURE_LOOK + 1 - depth);
		}

		// Simulation ends
		game.downward = !game.downward;
		game.ChessUnmover.unmoveChess(true);

		const valueGroup = {oldGrid, newGrid, value};
		const gameEnds = nextBestMoves.length === 0 && depth != 1;
		return {valueGroup, gameEnds, nextBestMoves};		
	}

	updateValueGroup(chosenGroups, gameEnds, game, valueGroup, origTeam) {
		let group;
		const {value} = valueGroup;

		// Handle checkmate/stalemate cases
		if (gameEnds) {
			if (game.getReachablePieces(board, game.king_grid[game.enemy], game.enemy).enemies.length != 0) {
				group = GROUP_FLAG.CHECKMATE;
			}
			else {
				group = GROUP_FLAG.STALEMATE;
			}
		}
		else {
			group = GROUP_FLAG.NORMAL;
		}

		// Overwrite chosen group if value is larger/smaller
		if (origTeam == game.turn) {
			// Maximizer (friend)
			if (chosenGroups[group].length == 0 || value > chosenGroups[group][0].value) {
				chosenGroups[group] = [valueGroup];
			}
			else if (value == chosenGroups[group][0].value) {
				chosenGroups[group].push(valueGroup);
			}
		}
		else {
			// Minimizer (opponent)
			if (chosenGroups[group].length == 0 || value < chosenGroups[group][0].value) {
				chosenGroups[group] = [valueGroup];
			}
			else if (value == chosenGroups[group][0].value) {
				chosenGroups[group].push(valueGroup);
			}
		}
	}

	moveAI(oldGrid, newGrid) {
		let game = this.game;
		let {ChessMover} = game;
		// let isLegal = ChessValidator.isKingSafe(game.turn, oldGrid, newGrid);
		// if (!isLegal) return false;

		let grid1 = game.chessboard[Util.flipCoord(oldGrid.x)][Util.flipCoord(oldGrid.y)];
		let grid2 = game.chessboard[Util.flipCoord(newGrid.x)][Util.flipCoord(newGrid.y)];

		Backend.updateChessboard(grid1, grid2, game.turn, game.black_timer, game.white_timer);
		ChessMover.moveChess(oldGrid, newGrid);
		return true;
	}

	getValueGroupStr(valueGroup) {
		if (!valueGroup) return 'null';

		return `<(${valueGroup.oldGrid.x}, ${valueGroup.oldGrid.y}) => ` + 
				`(${valueGroup.newGrid.x}, ${valueGroup.newGrid.y}), ` + 
				`value: ${valueGroup.value}>`;
	}


	debug_getBestMove(game, i, j, move, depth, oldPiece, valueGroup, nextBestMoves) {
		console.log(
			' '.repeat(4 * (MAX_FUTURE_LOOK - depth)), `depth ${depth} `, oldPiece.team, oldPiece.type + '\t',
			`(${i}, ${j}) => (${move.x}, ${move.y})` + '\t', 'value: ' + valueGroup.value + ', ' + '\t',
			'downward: ' + game.downward + ', ' + '\t', this.getValueGroupStr(nextBestMoves[0]),
		);
	}
}
