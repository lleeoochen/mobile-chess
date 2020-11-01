import * as Const from 'chessvibe/src/Const';
import Util from 'chessvibe/src/Util';
import Piece from './piece';


export default class Rook extends Piece {

	constructor(team, image) {
		super(team, Const.CHESS.Rook, Const.VALUE.Rook, image);
	}

	getPossibleMoves(game, chessboard, grid) {
		let moves = [];
		let possibleWays = [];

		if (game.get_piece(grid) == null)
			return moves;

		possibleWays.push({x:grid.x, y:grid.y});
		possibleWays.push({x:grid.x, y:grid.y});
		possibleWays.push({x:grid.x, y:grid.y});
		possibleWays.push({x:grid.x, y:grid.y});

		for (let i = 1; i < Const.BOARD_SIZE; i++) {

			for (let j = 0; j < possibleWays.length; j++) {

				if (possibleWays[j] != null) {
					switch(j) {
						case 0:
							possibleWays[j].x++;
							possibleWays[j].y;
							break;
						case 1:
							possibleWays[j].x--;
							possibleWays[j].y;
							break;
						case 2:
							possibleWays[j].x;
							possibleWays[j].y++;
							break;
						case 3:
							possibleWays[j].x;
							possibleWays[j].y--;
							break;
					}
				}

				let move = Util.checkPosition(possibleWays[j]);
				if (move != null) {

					let target = chessboard[move.x][move.y];
					if (game.get_piece(target) == null)
						moves.push(Object.assign({}, move));

					else {
						if (game.get_piece(target).team != game.get_piece(grid).team)
							moves.push(Object.assign({}, move));
						possibleWays[j] = null;
					}
				}
			}
		}

		return moves;
	}
}
