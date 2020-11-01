import Game from './Game';
import DataUpdaterAI from './Workers/DataUpdaterAI';

export default class GameAI extends Game {
	constructor(team, match_id, match, isMountedRef) {
		super(team, match_id, match, isMountedRef);
		this.modeAI = true;
		this.DataUpdater = new DataUpdaterAI(this);
	}
}
