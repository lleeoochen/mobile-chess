import Backend from './Backend';
import { URL, TEAM } from './Const';
import Util from './Util';

export default class GameBackend extends Backend {

	static listenMatch(user_id, match_id, resolve) {
		this.match_id = match_id;

		super.listenMatch(match_id, (match) => {
			this.match = match.data;

			// Register second user if not exists
			if (!this.match.white && user_id != this.match.black) {
				this.registerOpponent(user_id);
				this.my_team = TEAM.W;
			}
			else if (user_id == this.match.black) {
				this.my_team = TEAM.B;
			}
			else if (user_id == this.match.white) {
				this.my_team = TEAM.W;
			}
			else {
				this.my_team = TEAM.B; // spectate mode
			}

			resolve(this.match, this.my_team);
		});
	}

	static updateChessboard(oldGrid, newGrid, turn, black_timer, white_timer) {
		return Util.request('POST', URL.BACKEND + '/chess/match/update_chessboard', {
			match_id: this.match_id,
			move: Util.pack(oldGrid, newGrid, turn),
			black_timer: black_timer,
			white_timer: white_timer,
		});
	}

	static updateTimer(black_timer, white_timer) {
		Util.request('POST', URL.BACKEND + '/chess/match/update_timer', {
			match_id: this.match_id,
			black_timer: black_timer,
			white_timer: white_timer,
			message: Util.packMessage(`[Added 15 seconds to opponent.]`, this.my_team)
		});
	}

	static checkmate(winning_team) {
		Util.request('POST', URL.BACKEND + '/chess/match/checkmate', {
			match_id: this.match_id,
			winner: winning_team
		});
	}

	static stalemate() {
		Util.request('POST', URL.BACKEND + '/chess/match/stalemate', {
			match_id: this.match_id
		});
	}

	static draw() {
		Util.request('POST', URL.BACKEND + '/chess/match/draw', {
			match_id: this.match_id,
			message: Util.packMessage(`[Accepted a draw.]`, this.my_team)
		});
	}

	static timesup(winning_team) {
		Util.request('POST', URL.BACKEND + '/chess/match/timesup', {
			match_id: this.match_id,
			winner: winning_team,
			message: Util.packMessage(`[Time's up. Match ended.]`, this.my_team)
		});
	}

	static resign(winning_team) {
		Util.request('POST', URL.BACKEND + '/chess/match/resign', {
			match_id: this.match_id,
			winner: winning_team,
			message: Util.packMessage(`[Resigned match.]`, this.my_team)
		});
	}

	static undoMove() {
		Util.request('POST', URL.BACKEND + '/chess/match/undo', {
			match_id: this.match_id,
			undo_team: this.my_team == TEAM.B ? TEAM.W : TEAM.B,
			message: Util.packMessage(`[Gave mercy to opponent's move.]`, this.my_team)
		});
	}

	static cancelUndo() {
		return Util.request('POST', URL.BACKEND + '/chess/match/cancel_undo', {
			match_id: this.match_id,
			undo_team: this.my_team == TEAM.B ? TEAM.W : TEAM.B,
		});
	}

	static cancelDraw() {
		return Util.request('POST', URL.BACKEND + '/chess/match/cancel_draw', {
			match_id: this.match_id,
			draw_team: this.my_team == TEAM.B ? TEAM.W : TEAM.B,
		});
	}

	static registerOpponent(user_id) {
		Util.request('POST', URL.BACKEND + '/chess/match/register_opponent', {
			match_id: this.match_id,
			white: user_id,
		});
	}

	static message(message) {
		Util.request('POST', URL.BACKEND + '/chess/match/message', {
			match_id: this.match_id,
			message: Util.packMessage(message, this.my_team),
		});
	}

	static changeTheme(theme) {
		Util.request('POST', URL.BACKEND + '/chess/match/change_theme', {
			match_id: this.match_id,
			theme: Util.packTheme(theme),
		});
	}

	static askUndo() {
		Util.request('POST', URL.BACKEND + '/chess/match/ask_undo', {
			match_id: this.match_id,
			undo_team: this.my_team,
		});
	}

	static askDraw() {
		Util.request('POST', URL.BACKEND + '/chess/match/ask_draw', {
			match_id: this.match_id,
			draw_team: this.my_team,
		});
	}
}
