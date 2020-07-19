import Store        from 'chessvibe/src/redux/Store';
import * as Reducer from 'chessvibe/src/redux/Reducer';
import * as Const   from 'chessvibe/src/Const';
import Util         from 'chessvibe/src/Util';
import PieceFactory from './piecefactory';
import Grid         from './grid';
import Backend      from 'chessvibe/src/GameBackend';
import Cache        from 'chessvibe/src/Cache';
import Game         from './Game';

export default class GameAI extends Game {

	constructor(team, match_id, match, isMountedRef) {
		super(team, match_id, match, isMountedRef);
	}


	async updateMatchMoves(match) {
		await super.updateMatchMoves(match);

		if (this.turn == Const.TEAM.W) {
			this.calculateMoveAI();
		}
	}

	calculateMoveAI() {
		for (let i in this.chessboard) {
			for (let j in this.chessboard[i]) {

				let oldGrid = this.chessboard[i][j];
				let piece = this.get_piece(oldGrid);
				if (!piece || piece.team != this.turn) continue;

				let moves = piece.getPossibleMoves(this, this.chessboard, oldGrid, !this.downward);

				for (let m in moves) {
					let newGrid = this.chessboard[moves[m].x][moves[m].y];
					let success = this.moveAI(oldGrid, newGrid);
					if (success) return;
				}
			}
		}
	}

	moveAI(oldGrid, newGrid) {
		let isLegal = this.isKingSafe(this.turn, oldGrid, newGrid);
		if (!isLegal) return false;

		let grid1 = this.chessboard[Util.flipCoord(oldGrid.x)][Util.flipCoord(oldGrid.y)];
		let grid2 = this.chessboard[Util.flipCoord(newGrid.x)][Util.flipCoord(newGrid.y)];

		Backend.updateChessboard(grid1, grid2, this.turn, this.black_timer, this.white_timer);
		this.moveChess(oldGrid, newGrid);
		return true;
	}
}
