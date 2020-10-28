import * as React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { ActionBar } from 'chessvibe/src/widgets';
import messaging from '@react-native-firebase/messaging';
import { useSelector } from 'react-redux';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import Game from '../screens/GameScreen';
import NotificationMenu from '../screens/HomeScreen/NotificationMenu';
import PlayTab from '../screens/HomeScreen/PlayTab';
import HistoryTab from '../screens/HomeScreen/HistoryTab';
import FriendsTab from '../screens/HomeScreen/FriendsTab';
import SettingsTab from '../screens/HomeScreen/SettingsTab';

import ProfilePopup from '../screens/Popups/ProfilePopup';
import { APP_THEME, TEAM } from '../Const';

import Util from 'chessvibe/src/Util';
import Stats from 'chessvibe/src/Stats';
import Backend from 'chessvibe/src/Backend';
import { HomeStore } from '../redux/Store';
import Cache from '../Cache';

const NAV_TITLE = {
	PlayTab: 'ChessVibe',
	HistoryTab: 'History',
	FriendsTab: 'Friends',
	SettingsTab: 'Settings',
};

export default function MainNavigator({setNavStack}) {
	const appThemeId = useSelector(state => state.home.appThemeId);

	const user = React.useRef({});
	const navigator = React.useRef(null);
	const screenTab = React.useRef('PlayTab');

	// Mount
	React.useEffect(() => {
		HomeStore.setOpponents(Cache.home.opponents);
		HomeStore.setMatches(Cache.home.matches);

		// Call when switching nav stack
		// navigator.current._navigation.addListener('didFocus', () => {
			Backend.init();

			Backend.listenProfile(async res => {
				user.current = res.data;
				Cache.user = user.current;

				HomeStore.updateUser(user.current);
				fetchMatches(user);
			});
		// });
	}, []);

	React.useEffect(() => {
		navigator.current._navigation.setParams({
			// tab: tab,
			appThemeId: appThemeId,
			openNotification: () => {
				HomeStore.toggleAlertMenu();
			},
		});
	}, [appThemeId]);

	// Upload APNS Token for push notification
	React.useEffect(() => {
		// Get the device token
		messaging().getToken().then(token => Backend.uploadAPNSToken(token));

		// If using other push notification providers (ie Amazon SNS, etc)
		// you may need to get the APNs token instead for iOS:
		// if(Platform.OS == 'ios') { messaging().getAPNSToken().then(token => { return Backend.uploadAPNSToken(token); }); }

		// Listen to whether the token changes
		return messaging().onTokenRefresh(token => Backend.uploadAPNSToken(token));
	}, []);

	function navigateGame(match) {
		if (!match) return;

		navigator.current._navigation.navigate('Game', {
			match,
			refresh: () => fetchMatches(user),
		});
	}

	const MainContainer = getMainContainer(appThemeId, screenTab.current, HomeStore.toggleAlertMenu);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
			<StatusBar hidden={ true }/>
			<MainContainer
				ref={navigator}
				onNavigationStateChange={(prevState, currentState) => {
					screenTab.current = getActiveRouteName(currentState);
				}}
				screenProps={{
					setNavStack,
					navigateGame,
					refresh: () => fetchMatches(user),
				}}/>
			<ProfilePopup/>
			<HomeNotificationMenu
				user={user}
				appThemeId={appThemeId}
				navigateGame={navigateGame}/>
		</SafeAreaView>
	);
}

// Main Navigation
function getMainContainer(appThemeId, tab, openNotification) {
	const appTheme = APP_THEME[appThemeId];

	const HomeNavigator = createMaterialBottomTabNavigator(
		{
			PlayTab:     { screen: PlayTab },
			HistoryTab:  { screen: HistoryTab },
			FriendsTab:  { screen: FriendsTab },
			SettingsTab: { screen: SettingsTab },
		},
		{
			initialRouteName: tab,
			backBehavior: 'none',

			// Material tab bar config
			activeColor: appTheme.COLOR,
			inactiveColor: 'grey',
			barStyle: {
				backgroundColor: appTheme.MENU_BACKGROUND,

				shadowColor: '#000',
				shadowOffset: {
					width: 0,
					height: 0,
				},
				shadowOpacity: 1,
				shadowRadius: 2,

				elevation: 10,
			},
		}
	);
	const MainNavigator = createStackNavigator(
		{
			Home: { screen: HomeNavigator },
			Game: { screen: Game },
		},
		{
			initialRouteName: 'Home',
			defaultNavigationOptions: () => {
				return ActionBar(NAV_TITLE[tab], undefined, undefined, 'BELL', openNotification, appThemeId);
			},
		}
	);
	return createAppContainer(MainNavigator);
}


// Notification menu
function HomeNotificationMenu({user, appThemeId, navigateGame}) {
	const alertMenuShown = useSelector(state => state.home.alertMenuShown);

	return (
		<NotificationMenu
			matches={ user.current.matches }
			navigateGame={ navigateGame }
			notificationIDs={ (user.current.notifications || []).reverse() }
			friends={ user.current.friends }
			appThemeId={ appThemeId }
			visible={ alertMenuShown }
			setVisible={ HomeStore.toggleAlertMenu }/>
	);
}

// Fetch user matches
function fetchMatches(user) {
	let matches_dict = {};
	let matches_promises = [];


	user.current.matches.forEach(match => {
		let [match_id, enemy_id] = match.split('-');
		enemy_id = enemy_id || 'none';
		matches_dict[enemy_id] = matches_dict[enemy_id] || [];
		matches_dict[enemy_id].push(match_id);
	});

	for (let enemy_id in matches_dict) {
		matches_promises.push(
			Backend.getMatches(enemy_id, matches_dict[enemy_id])
		);
	}

	Promise.all(matches_promises).then(async results => {
		let newMatches = [];
		let oldMatches = [];

		// Sort matches by dates for each opponent
		for (let i in results) {
			results[i].matches.sort((a, b) => {
				let a_time = a[1].updated || 0;
				if (typeof a_time == 'object') a_time = 0;
				if (Util.gameFinished(a[1])) a_time -= new Date().getTime();

				let b_time = b[1].updated || 0;
				if (typeof b_time == 'object') b_time = 0;
				if (Util.gameFinished(b[1])) b_time -= new Date().getTime();

				return b_time - a_time;
			});
		}

		for (let i in results) {
			let j = 0;

			for (; j < results[i].matches.length; j++) {
				if (Util.gameFinished(results[i].matches[j][1])) {
					break;
				}
			}

			if (j != 0 && results[i].enemy.name) {
				let newItems = results[i].matches.splice(0, j);
				newMatches.push({
					enemy: results[i].enemy,
					matches: newItems
				});
			}
		}

		// Sort opponent by latest date
		results.sort((r1, r2) => {
			if (!r1.matches[0]) return -1;
			if (!r2.matches[0]) return 1;

			let r1_time = r1.matches[0][1].updated || 0;
			if (typeof r1_time == 'object') r1_time = 0;

			let r2_time = r2.matches[0][1].updated || 0;
			if (typeof r2_time == 'object') r2_time = 0;

			return r2_time - r1_time;
		});

		for (let i in results) {
			if (results[i].enemy.name) oldMatches.push(results[i]);
			else                       newMatches.push(results[i]);
		}

		let resultMatches = {
			new: newMatches,
			old: oldMatches,
		};

		// Calculate opponent stats
		let opponentsSet = new Set();
		results.forEach(result => {
			let { enemy, matches } = result;
			let stats = new Stats();

			matches.forEach((match) => {
				let match_data = match[1];

				let team = (match_data.black == Cache.userID) ? TEAM.B : TEAM.W;
				let lastMove = match_data.moves[match_data.moves.length - 1];
				stats.aggregate(lastMove, team);
			});

			if (enemy.name && enemy.name != 'Computer') {
				opponentsSet.add([enemy, stats]);
			}
		});

		let resultOpponents = [...opponentsSet].sort((a, b) => {
			if (a[0].name < b[0].name)
				return -1;
			if (a[0].name > b[0].name)
				return 1;
			return 0;
		});

		HomeStore.setOpponents(resultOpponents);
		HomeStore.setMatches(resultMatches);

		Cache.home.opponents = resultOpponents;
		Cache.home.matches = resultMatches;
	});
}

// Get the current screen from navigation state
function getActiveRouteName(navigationState) {
	if (!navigationState) {
		return null;
	}

	const route = navigationState.routes[navigationState.index];
	// dive into nested navigators
	if (route.routes) {
		return getActiveRouteName(route);
	}
	return route.routeName;
}
