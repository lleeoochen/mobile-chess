import { THEME_CLASSIC, TEAM } from 'chessvibe/src/Const';
import Game from 'chessvibe/src/screens/GameScreen/Game';

// Action types
export const INIT_GAME = 'initGame';
export const THEME = 'theme';
export const FILL_GRIDS = 'fillGrids';

const initState = {
	game: new Game(TEAM.B),
	theme: THEME_CLASSIC,
};


// Actions
export const initGame = createAction(INIT_GAME);
function reduceInitGame(state, action) {
	let oldGame = state.game;
	let changes = action.data;
	return { ...state, game: { ...oldGame, ...changes } };
}

export const updateTheme = createAction(THEME);
function reduceTheme(state, action) {
	let data = action.data;
	return {...state, ...{ theme: data }};
}


// Reducer
export default function Reducer(state = initState, action) {
	// console.log('Action Reducer', !action.data || action.data.baseboard);
	switch (action.type) {
		case INIT_GAME:    return reduceInitGame(state, action);
		case THEME:        return reduceTheme(state, action);
		default: return state;
	}
}


// Action generator
function createAction(type) {
	return function (...args) {
		const action = { type };
		action.data = args[0];
		return action;
	}
}

