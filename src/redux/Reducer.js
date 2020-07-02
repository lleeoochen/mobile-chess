import { THEME_CLASSIC } from 'chessvibe/src/Const';

// Action types
export const BOARD_COLORS = 'boardColors';
export const BOARD_PIECES = 'boardPieces';
export const THEME = 'theme';

const initState = {
	[BOARD_COLORS]: [[], [], [], [], [], [], [], []],
	[BOARD_PIECES]: [[], [], [], [], [], [], [], []],
	[THEME]: THEME_CLASSIC,
};


// Actions
export const updateBoardColors = createAction(BOARD_COLORS);
function reduceBoardColors(state, action) {
	return reduce(state, action);
}

export const updateBoardPieces = createAction(BOARD_PIECES);
function reduceBoardPieces(state, action) {
	return reduce(state, action);
}

export const updateTheme = createAction(THEME);
function reduceTheme(state, action) {
	return reduce(state, action);
}


// Reducer
export default function Reducer(state = initState, action) {
	switch (action.type) {
		case BOARD_COLORS: return reduceBoardColors(state, action);
		case BOARD_PIECES: return reduceBoardPieces(state, action);
		case THEME:        return reduceTheme(state, action);
		default: return state;
	}
}


// Action generator
function createAction(type, ...argNames) {
	return function (...args) {
		const action = { type };
		// argNames.forEach((arg, index) => {
		// 	action[argNames[index]] = args[index]
		// });
		action[type] = args[0];
		return action;
	}
}

// Reduce helper
function reduce(state, action) {
	let { type, ...params } = action;
	let old_val = state[type];
	let new_val = params[type];

	if (JSON.stringify(old_val) !== JSON.stringify(new_val)) {
		state[type] = new_val;
	}
	return state;
}
