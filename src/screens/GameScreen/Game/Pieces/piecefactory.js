import * as Const from 'chessvibe/src/Const';
import Bishop from './bishop';
import King   from './king';
import Knight from './knight';
import None   from './none';
import Pawn   from './pawn';
import Queen  from './queen';
import Rook   from './rook';

export default class PieceFactory {
	static createPiece(team, type, image) {
		switch (type) {
			case Const.CHESS.King:
				return new King(team, image);
			case Const.CHESS.Queen:
				return new Queen(team, image);
			case Const.CHESS.Rook:
				return new Rook(team, image);
			case Const.CHESS.Bishop:
				return new Bishop(team, image);
			case Const.CHESS.Knight:
				return new Knight(team, image);
			case Const.CHESS.Pawn:
				return new Pawn(team, image);
			default:
				return new None(team, image);
		}
	}
}
