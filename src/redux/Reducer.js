import { THEME, TEAM } from 'chessvibe/src/Const';
import Game from 'chessvibe/src/screens/GameScreen/Game';

// Action types
export const ACTION_INIT_GAME = 'initGame';
export const ACTION_THEME = 'theme';

const initState = {
	game: new Game(TEAM.B),
	theme: THEME.CLASSIC,
};


// Actions
export const initGame = createAction(ACTION_INIT_GAME);
function reduceInitGame(state, action) {
	let oldGame = state.game;
	let changes = action.data;
	return { ...state, game: { ...oldGame, ...changes } };
}

export const updateTheme = createAction(ACTION_THEME);
function reduceTheme(state, action) {
	let data = action.data;
	return {...state, ...{ theme: data }};
}


// Reducer
export default function Reducer(state = initState, action) {
	// console.log('Action Reducer', !action.data || action.data.baseboard);
	switch (action.type) {
		case ACTION_INIT_GAME:    return reduceInitGame(state, action);
		case ACTION_THEME:        return reduceTheme(state, action);
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

