import {
	DB_CHECKMATE_WHITE,
	DB_CHECKMATE_BLACK,
	DB_STALEMATE,
	DB_TIMESUP_WHITE,
	DB_TIMESUP_BLACK,
	DB_RESIGN_WHITE,
	DB_RESIGN_BLACK,
	DB_DRAW,
	TEAM,
} from './Const';

export default class Stats {

	constructor(stats) {
		if (stats) {
			this.stats = JSON.parse(JSON.stringify(stats)).stats;
		}
		else {
			this.stats = {
				draw: 0,
				stalemate: 0,
				win: 0,
				lose: 0,
				ongoing: 0,
				resign: 0,
			};
		}
	}

	aggregate(lastMove, team) {
		let addWin = null;

		switch (lastMove) {
			case DB_DRAW:
				this.stats.draw += 1;
				break;

			case DB_STALEMATE:
				this.stats.stalemate += 1;
				break;

			case DB_CHECKMATE_BLACK:
				addWin = team == TEAM.B;
				break;

			case DB_CHECKMATE_WHITE:
				addWin = team == TEAM.W;
				break;

			case DB_TIMESUP_BLACK:
				addWin = team == TEAM.B;
				break;

			case DB_TIMESUP_WHITE:
				addWin = team == TEAM.W;
				break;

			case DB_RESIGN_BLACK:
				addWin = team == TEAM.B;
				break;

			case DB_RESIGN_WHITE:
				addWin = team == TEAM.W;
				break;
		}

		if (addWin != null) {
			if (addWin)
				this.stats.win += 1;
			else
				this.stats.lose += 1;
		}
	}

	analyze() {
		if (this.stats == undefined) return {};

		let stats = this.stats;
		let total = stats.win + stats.lose + stats.draw + stats.stalemate + stats.resign;
		let wins = stats.win + stats.resign + stats.draw / 2.0 + stats.stalemate / 2.0;

		let winRate = (100.0 * wins / total).toFixed(2);
		if (winRate == 'NaN') winRate = null;

		return { winRate, wins, total };
	}
}