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

		const game = this.game;

		if (game.ended || game.turn === Const.TEAM.B) {
			return;
		}

		// Get next best moves
		const chosens = this.getBestMove(game.cloneAIOpponent(), MAX_FUTURE_LOOK);
		chosens.sort((a, b) => kingDistanceSort(a, b, this.game));

		// Find the chosen move
		const chosenIndex = getWeightedRandomIndex(chosens.length);
		const chosen = chosens[chosenIndex];

		// Useful debug line
		console.log(getValueGroupStr(chosen));

		// Move AI to chosen move
		this.moveAI(game.chessboard[chosen.oldGrid.x][chosen.oldGrid.y], game.chessboard[chosen.newGrid.x][chosen.newGrid.y]);
	}

	// Move AI from old grid to new grid
	moveAI(oldGrid, newGrid) {
		let game = this.game;

		let grid1 = game.chessboard[Util.flipCoord(oldGrid.x)][Util.flipCoord(oldGrid.y)];
		let grid2 = game.chessboard[Util.flipCoord(newGrid.x)][Util.flipCoord(newGrid.y)];

		Backend.updateChessboard(grid1, grid2, game.turn, game.black_timer, game.white_timer);
		game.ChessMover.moveChess(oldGrid, newGrid);
		return true;
	}

	getBestMove(game, depth) {
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
					const {valueGroup, gameEnds, nextBestMoves} = this.simulateMove(game, depth, oldGrid, newGrid);

					// Save the best-value group 
					this.updateValueGroup(game, gameEnds, chosenGroups, valueGroup);

					// Very good debug line
					debug_getBestMove(game, i, j, move, depth, oldPiece, valueGroup, nextBestMoves);
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

	simulateMove(game, depth, oldGrid, newGrid) {
		// Value calculation init
		let oldValue = game.stats[game.team] - game.stats[game.enemy];
		let value = game.turn === game.team ? 1 : -1;

		// Simulation starts
		game.downward = !game.downward;
		game.ChessMover.moveChess(oldGrid, newGrid, true);

		// Value calculation
		let newValue = game.stats[game.team] - game.stats[game.enemy];
		value *= Math.abs(newValue - oldValue);

		// Find next best move of opponent
		let nextBestMoves = this.getBestMove(game, depth - 1);
		if (nextBestMoves.length > 0) {
			// Future value are weighted less (in case killing our king is weighted
			// the same as killing opponent's king)
			value += nextBestMoves[0].value * Math.pow(0.8, MAX_FUTURE_LOOK + 1 - depth);
		}

		// Simulation ends
		game.ChessUnmover.unmoveChess(true);
		game.downward = !game.downward;

		const valueGroup = {oldGrid, newGrid, value};
		const gameEnds = nextBestMoves.length === 0 && depth != 1;
		return {valueGroup, gameEnds, nextBestMoves};		
	}

	updateValueGroup(game, gameEnds, chosenGroups, valueGroup) {
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

		// Update chosen group
		if (chosenGroups[group].length == 0) {
			chosenGroups[group] = [valueGroup];
		}
		else if (value === chosenGroups[group][0].value) {
			chosenGroups[group].push(valueGroup);
		}
		else {
			// Overwrite chosen group if value is larger/smaller
			const isMaximizer = game.turn === game.team;
			const isValueLarger = value > chosenGroups[group][0].value;

			if (isMaximizer === isValueLarger) {
				chosenGroups[group] = [valueGroup];
			}
		}
	}
}


// Get random index that's front weighted
function getWeightedRandomIndex(max) {
	let totalWeight = (max + 1) * max / 2;
	let rand = Math.floor(Math.random() * totalWeight);
	let index = 0;

	// Choose index based on where rand falls
	for (index = 0; index < max; index++) {
		let weight = max - index;
		if (rand < weight) {
			return index;
		}
		rand -= weight;
	}
	return index;
}

// Pretty string of value group
function getValueGroupStr(valueGroup) {
	if (valueGroup) {
		return `<(${valueGroup.oldGrid.x}, ${valueGroup.oldGrid.y}) => ` + 
				`(${valueGroup.newGrid.x}, ${valueGroup.newGrid.y}), ` + 
				`value: ${valueGroup.value}>`;
	}
	else {
		return 'null';
	}
}

// Debugging for best move algorithm
// eslint-disable-next-line
function debug_getBestMove(game, i, j, move, depth, oldPiece, valueGroup, nextBestMoves) {
	console.log(
		' '.repeat(4 * (MAX_FUTURE_LOOK - depth)), `depth ${depth} `, oldPiece.team, oldPiece.type + '\t',
		`(${i}, ${j}) => (${move.x}, ${move.y})` + '\t', 'value: ' + valueGroup.value + ', ' + '\t',
		'downward: ' + game.downward + ', ' + '\t', getValueGroupStr(nextBestMoves[0]),
	);
}

// Special sort that considers distance closest to king
function kingDistanceSort(a, b, game) {
	let otherTeam = game.turn == Const.TEAM.B ? Const.TEAM.W : Const.TEAM.B;
	let {kingX, kingY} = game.king_grid[otherTeam];

	let aDist = Math.sqrt(Math.pow(a.newGrid.kingX - kingX, 2) + Math.pow(a.newGrid.kingY - kingY, 2));
	let bDist = Math.sqrt(Math.pow(b.newGrid.kingX - kingX, 2) + Math.pow(b.newGrid.kingY - kingY, 2));
	return aDist - bDist;
}
