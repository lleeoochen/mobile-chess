import Util from '../Util';
import Const from '../Const';

export default class Backend {
	getMatch(id) {
		return Util.request('GET', '/chess/get_match?id=' + id);
	}

	getMatches(user, ids) {
		return Util.request('GET', '/chess/get_matches?ids=' + JSON.stringify(ids) + '&user=' + user);
	}

	getProfile() {
		return Util.request('GET', '/chess/get_profile');
	}

	getUser(id) {
		return Util.request('GET', '/chess/get_user?id=' + id);
	}

	listenMatch(id, resolve) {
		this.socket.emit('listen_match', id);
		this.socket.on('listen_match_' + id, data => {
			resolve(data);
		});
	}

	listenUser(id, resolve) {
		this.socket.emit('listen_user', id);
		this.socket.on('listen_match_' + id, data => {
			resolve(data);
		});
	}

	createMatch(theme, time) {
		return Util.request('POST', '/chess/create_match', {
			theme: Util.packTheme(theme),
			time: time || MAX_TIME
		});
	}
}
