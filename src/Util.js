import { Dimensions } from 'react-native';
import Cache from './Cache';

export default class Util {

	static request(method, url, body) {
		return new Promise(async (resolve, reject) => {
			let time_start = new Date().getTime();

			const response = await fetch(url, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					'Authorization': Cache.sessionToken
				},
				body: JSON.stringify(body)
			});

			let result = await response.json();
			resolve(result);
		});
	}
}

export function vw(size=1) {
	return size * Dimensions.get('window').width / 100.0;
}

export function vh(size=1) {
	return size * Dimensions.get('window').height / 100.0;
}



// https://stackoverflow.com/a/8888498
export function formatDate(date, format='%M/%D %h:%m %z') {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	hours = hours < 10 ? '0' + hours : hours;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	var strTime = format.replace('%M', (date.getMonth() + 1) || '')
						.replace('%D', date.getDate() || '')
						.replace('%h', hours || '')
						.replace('%m', minutes || '')
						.replace('%z', ampm || '');
	return strTime;
}