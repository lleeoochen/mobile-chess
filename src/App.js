import * as React from 'react';
import { AppState, LogBox, Platform } from 'react-native';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import LoginNavigator from './navigators/LoginNavigator';
import MainNavigator from './navigators/MainNavigator';

import { STORAGE_APP_CACHE } from './Const';

import store from './redux/Store';
import Storage from './Storage';
import Cache, { CACHE_DEFAULT } from './Cache';

LogBox.ignoreLogs(['Task orphaned']);



export default function App() {
	const [navStack, setNavStack] = React.useState('login');
	const appState = React.useRef(AppState.currentState);

	// Listener for app state
	React.useEffect(() => {
		SplashScreen.hide();

		AppState.addEventListener('change', state => onAppStateChanged(state));

		return () => {
			AppState.removeEventListener('change', state => onAppStateChanged(state));
		};
	}, []);

	// Notification request and reset
	React.useEffect(() => {
		requestUserPermission();

		if (Platform.OS === 'ios') {
			PushNotificationIOS.setApplicationIconBadgeNumber(0);
		}
	});

	// Clean up when app closes
	async function onAppStateChanged(state) {
		if (appState.current === 'active' && state.match(/inactive|background/)) {
			// Save cache to local storage
			await Storage.set(STORAGE_APP_CACHE, JSON.stringify(Cache));
		}
		else if (state === 'active' && !appState.current.match(/inactive|background/)) {
			// Save cache to local storage
			let raw_cache = await Storage.get(STORAGE_APP_CACHE);

			if (raw_cache)
				Object.assign(Cache, JSON.parse(raw_cache));
			else
				Object.assign(Cache, JSON.parse(JSON.stringify(CACHE_DEFAULT)));
		}

		appState.current = state;
	}


	// Render
	const Navigator = navStack === 'login' ? LoginNavigator : MainNavigator;
	return (
		<Provider store={ store }>
			<Navigator setNavStack={setNavStack}/>
		</Provider>
	);
}


// Request notification permission from user
async function requestUserPermission() {
	const authStatus = await messaging().requestPermission();
	const enabled =
		authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
		authStatus === messaging.AuthorizationStatus.PROVISIONAL;

	if (enabled) {
		console.log('Authorization status:', authStatus);
	}
}
