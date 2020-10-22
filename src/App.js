import * as React from 'react';
import { AppState, LogBox, SafeAreaView, Platform } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import Entry from './screens/EntryScreen';
import Home from './screens/HomeScreen';
import Game from './screens/GameScreen';
import ProfilePopup from './screens/Popups/ProfilePopup';
import { vw } from './Util';
import { STORAGE_APP_CACHE } from './Const';

import store from './redux/Store';
import Storage from './Storage';
import Cache, { CACHE_DEFAULT } from './Cache';

LogBox.ignoreLogs(['Task orphaned']);


// Login Navigation
const LoginNavigator = createStackNavigator(
	{
		Entry: { screen: Entry },
	},
	{
		initialRouteName: 'Entry',
		defaultNavigationOptions: {
			headerStyle: {
				backgroundColor: 'black',
				shadowColor: 'black',
				shadowRadius: vw(0.5),
				elevation: 2,
				height: vw(15),
			},
			headerTintColor: 'white',
			headerTitleStyle: {
				fontWeight: 'bold',
			},
			gestureEnabled: false,
		},
	}
);

// export default createAppContainer(Navigator);
const LoginContainer = createAppContainer(LoginNavigator);



// Content Navigation
const MainNavigator = createStackNavigator(
	{
		Home: { screen: Home },
		Game: { screen: Game },
	},
	{
		initialRouteName: 'Home',
		defaultNavigationOptions: {
			headerStyle: {
				backgroundColor: 'black',
				shadowColor: 'black',
				shadowRadius: vw(0.5),
				elevation: 2,
				height: vw(15),
			},
			headerTintColor: 'white',
			headerTitleStyle: {
				fontWeight: 'bold',
			},
			gestureEnabled: false,
		},
	}
);

// export default createAppContainer(Navigator);
const MainContainer = createAppContainer(MainNavigator);



async function requestUserPermission() {
	const authStatus = await messaging().requestPermission();
	const enabled =
		authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
		authStatus === messaging.AuthorizationStatus.PROVISIONAL;

	if (enabled) {
		console.log('Authorization status:', authStatus);
	}
}

function AppContent() {
	const [navStack, setNavStack] = React.useState('login');
	const appState = React.useRef(AppState.currentState);

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

		// console.log(Cache);
		appState.current = state;
	}

	// Listener for app state
	React.useEffect(() => {
		SplashScreen.hide();

		AppState.addEventListener('change', state => onAppStateChanged(state));

		return () => {
			AppState.removeEventListener('change', state => onAppStateChanged(state));
		};
	}, []);

	React.useEffect(() => {
		requestUserPermission();

		if (Platform.OS === 'ios') {
			PushNotificationIOS.setApplicationIconBadgeNumber(0);
		}
	});


	const NavContainer = navStack === 'login' ? LoginContainer : MainContainer;

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
			<NavContainer screenProps={{setNavStack}}/>
			<ProfilePopup/>
		</SafeAreaView>
	);
}

export default function App() {
	return (
		<Provider store={ store }>
			<AppContent/>
		</Provider>
	);
}
