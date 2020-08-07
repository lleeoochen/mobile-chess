import { THEME, TEAM, STORAGE_IS_DARK_THEME } from 'chessvibe/src/Const';
import Storage from 'chessvibe/src/Storage';
// import Game from 'chessvibe/src/screens/GameScreen/Game';

// Action types
export const ACTION_USER = 'updateUser';
export const ACTION_DRAWER = 'updateDrawer';
export const ACTION_INIT_GAME = 'initGame';
export const ACTION_THEME = 'theme';
export const ACTION_IS_DARK_THEME = 'isDarkTheme';
export const ACTION_RESET = 'reset';
export const ACTION_PLAYER = 'player';

const initState = {
	game: {
		chessboard: [[], [], [], [], [], [], [], []],
		baseboard: [[], [], [], [], [], [], [], []],
	},
	theme: THEME.METAL,
	blackPlayer: null,
	whitePlayer: null,

	user: null,
	isDarkTheme: false,
};


// Actions
export const updateUser = createAction(ACTION_USER);
function reduceUser(state, action) {
	let data = action.data;
	return {...state, ...{ user: data }};
}

export const reset = createAction(ACTION_RESET);
function reduceReset(state, action) {
	state.game = initState.game;
	state.theme = initState.theme;
	state.blackPlayer = initState.blackPlayer;
	state.whitePlayer = initState.whitePlayer;

	return { ...state };
}

export const initGame = createAction(ACTION_INIT_GAME);
function reduceInitGame(state, action) {
	let oldGame = state.game;
	let changes = action.data;

	let game = JSON.parse(JSON.stringify({ ...state.game, ...changes }));
	return { ...state, game: game };
}

export const updateTheme = createAction(ACTION_THEME);
function reduceTheme(state, action) {
	let data = action.data;
	return {...state, ...{ theme: data }};
}

export const setIsDarkTheme = createAction(ACTION_IS_DARK_THEME);
function reduceIsDarkTheme(state, action) {
	let data = action.data;
	return {...state, ...{ isDarkTheme: data }};
}

export const updatePlayer = createAction(ACTION_PLAYER);
function reducePlayer(state, action) {
	let data = action.data;
	return {...state, ...data};
}


// Reducer
export default function Reducer(state = initState, action) {
	// console.log('Action Reducer', action.data);
	switch (action.type) {
		case ACTION_INIT_GAME:     return reduceInitGame(state, action);
		case ACTION_THEME:         return reduceTheme(state, action);
		case ACTION_RESET:         return reduceReset(state, action);
		case ACTION_PLAYER:        return reducePlayer(state, action);
		case ACTION_DRAWER:        return reduceDrawer(state, action);
		case ACTION_USER:          return reduceUser(state, action);
		case ACTION_IS_DARK_THEME: return reduceIsDarkTheme(state, action);
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

