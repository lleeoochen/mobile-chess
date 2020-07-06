import * as Const from 'chessvibe/src/Const';
import Util from 'chessvibe/src/Util';
import Piece from './piece';


export default class None extends Piece {

	constructor(team, image) {
		super(team, Const.CHESS.None, Const.VALUE.None, image);
	}

	getPossibleMoves(game, chessboard, grid) {
		return [];
	}
}
