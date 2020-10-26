import { THEME } from 'chessvibe/src/Const';

// Initial store state
const initState = Object.freeze({
	home: {
		user: {},
		opponents: new Set(),
		matches: {
			new: [],
			old: [],
		},

		alertMenuShown: false,
		appThemeId: 'DARK',
		toLogout: false,
	},
	game: {
		chessboard: [[], [], [], [], [], [], [], []],
		baseboard: [[], [], [], [], [], [], [], []],
		theme: THEME.METAL,
		blackPlayer: null,
		whitePlayer: null,
	},
	popup: {
		profile: null,
	},
});



// Home Action Reducers
export const HomeReducer = {
	updateUser: createReducer((state, data) => {
		let home = { ...state.home, user: data };
		return { ...state, home };
	}),
	setOpponents: createReducer((state, data) => {
		let home = { ...state.home, opponents: data };
		return { ...state, home };
	}),
	setMatches: createReducer((state, data) => {
		let home = { ...state.home, matches: data };
		return { ...state, home };
	}),
	toggleAlertMenu: createReducer((state) => {
		let home = { ...state.home, alertMenuShown: !state.home.alertMenuShown };
		return { ...state, home };
	}),
	setAppThemeId: createReducer((state, data) => {
		let home = { ...state.home, appThemeId: data };
		return { ...state, home };
	}),
	toLogout: createReducer((state, data) => {
		let home = { ...state.home, toLogout: data };
		return { ...state, home };
	}),
};

// Game Action Reducers
export const GameReducer = {
	initGame: createReducer((state, data) => {
		let game = { ...state.game, ...data };
		return { ...state, ...{ game } };
	}),
	reset: createReducer((state) => {
		state.game = initState.game;
		return { ...state };
	}),
	updateTheme: createReducer((state, data) => {
		let game = { ...state.game, ...{ theme: data } };
		return { ...state, ...{ game } };
	}),
	updatePlayer: createReducer((state, data) => {
		let game = { ...state.game, ...data };
		return { ...state, ...{ game } };
	}),
};

// Game Popup Reducers
export const PopupReducer = {
	openProfile: createReducer((state, data) => {
		let popup = { ...state.popup, ...{ profile: data } };
		return { ...state, ...{ popup } };
	}),
	closeProfile: createReducer((state) => {
		let popup = { ...state.popup, ...{ profile: null } };
		return { ...state, ...{ popup } };
	}),
};

// Root Reducer
export const RootReducer = {
	reset: createReducer(() => {
		return JSON.parse(JSON.stringify(initState));
	}),
};


// App Reducer
export default function Reducer(state = initState, action) {
	if (action.reduce) {
		return action.reduce(state, action.data);
	}
	return state;
}



// Action helper
function createReducer(reduce) {
	return function (data) {
		return { type: '', data, reduce };
	};
}
