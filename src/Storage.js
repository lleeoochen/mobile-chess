import AsyncStorage from '@react-native-community/async-storage';


export default class Storage {
	static async set(key, val) {
		try {
			await AsyncStorage.setItem(key, val);
		}
		catch (error) {
			console.log('Problem setting storage');
		}
	}

	static async get(key) {
		try {
			return await AsyncStorage.getItem(key);
		}
		catch (error) {
			return null;
		}
	}

	static clear() {
		AsyncStorage.clear();
	}
}