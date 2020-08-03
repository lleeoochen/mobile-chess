var Cache = {
	sessionToken: '',
	userID: '',
	user: {},

	theme: {},
	users: {},

	home: {
		opponents: [],
		matches: { new: [], old: [] },
	},
};

export const CACHE_DEFAULT = Object.freeze({
	sessionToken: '',
	userID: '',
	user: {},

	theme: {},
	users: {},

	home: {
		opponents: [],
		matches: { new: [], old: [] },
	},
});
export default Cache;
