import Game from './Game';
import DataUpdaterAI from './Workers/DataUpdaterAI';
import Grid from './Pieces/grid';

export default class GameAI extends Game {
	constructor(team, match_id, match, isMountedRef) {
		super(team, match_id, match, isMountedRef);
		this.modeAI = true;
		this.DataUpdater = new DataUpdaterAI(this);
	}

	cloneGame() {
		let newGame = new GameAI(this.team, this.match_id, this.match, this.isMountedRef);

		newGame.chessboard = this.copyBoard(this.chessboard);
		newGame.pieces = {...this.pieces};
		newGame.passant_stack = this.passant_stack.map(p => {
			return p ? new Grid(
				p.x,
				p.y,
				p.piece,
				p.color,
			) : null;
		});

		newGame.id = this.id;
		newGame.team = this.team;
		newGame.enemy = this.enemy;
		newGame.turn = this.turn;
		newGame.downward = !this.downward;

		newGame.king_grid = {...this.king_grid};
		newGame.white_king_moved = this.white_king_moved;
		newGame.black_king_moved = this.black_king_moved;

		newGame.oldGrid = this.oldGrid ? new Grid(
			this.oldGrid.x,
			this.oldGrid.y,
			this.oldGrid.piece,
			this.oldGrid.color,
		) : null;
		newGame.newGrid = this.newGrid ? new Grid(
			this.newGrid.x,
			this.newGrid.y,
			this.newGrid.piece,
			this.newGrid.color,
		) : null;
		newGame.passant_pawn = this.passant_pawn ? new Grid(
			this.passant_pawn.x,
			this.passant_pawn.y,
			this.passant_pawn.piece,
			this.passant_pawn.color,
		) : null;
		
		newGame.stats = {...this.stats};
		return newGame;
	}
}
