import Util from './Util';
import Cache from './Cache';
import { URL } from './Const';
import io from 'socket.io-client';

export default class Backend {

	static socket = null;

	static init() {
		if (this.socket)
			this.socket.close();

		this.socket = io(URL.BACKEND, {
			query: {
				token: Cache.sessionToken
			}
		});

		this.socket.on('error', (error) => {
			console.log("SOCKET ERROR: ", error);
		});
	}

	static getMatch(id) {
		return Util.request('GET', URL.BACKEND + '/chess/get_match?id=' + id);
	}

	static getMatches(user, ids) {
		return Util.request('GET', URL.BACKEND + '/chess/get_matches?ids=' + JSON.stringify(ids) + '&user=' + user);
	}

	static getProfile() {
		return Util.request('GET', URL.BACKEND + '/chess/get_profile');
	}

	static getUser(id) {
		return Util.request('GET', URL.BACKEND + '/chess/get_user?id=' + id);
	}

	static listenMatch(id, resolve) {
		this.socket.emit('listen_match', id);
		this.socket.on('listen_match_' + id, data => {
			resolve(data);
		});
	}

	static listenUser(id, resolve) {
		this.socket.emit('listen_user', id);
		this.socket.on('listen_user_' + id, data => {
			resolve(data);
		});
	}

	static listenProfile(resolve) {
		this.socket.emit('listen_profile');
		this.socket.on('listen_profile', data => {
			resolve(data);
		});
	}

	static createMatch(theme, time, AI=false) {
		return Util.request('POST', URL.BACKEND + '/chess/create_match', {
			theme: theme,
			time: time || MAX_TIME,
			AI: AI,
		});
	}

	static deleteMatch(match_id, resolve) {
		return Util.request('POST', URL.BACKEND + '/chess/delete_match', {
			match_id: match_id,
		});
	}

	static requestFriend(friend_id) {
		return Util.request('POST', URL.BACKEND + '/chess/request_friend', {
			user_id: friend_id,
		});
	}

	static acceptFriend(friend_id) {
		return Util.request('POST', URL.BACKEND + '/chess/accept_friend', {
			user_id: friend_id,
		});
	}

	static getNotificationList(ids) {
		return Util.request('GET', URL.BACKEND + '/chess/get_notification_list?ids=' + JSON.stringify(ids));
	}

	static sendInbox(email, message) {
		return Util.request('POST', URL.BACKEND + '/chess/send_inbox', {
			email,
			message,
		});
	}
}
