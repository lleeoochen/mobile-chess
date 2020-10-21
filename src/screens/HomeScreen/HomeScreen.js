import * as React from 'react';
import { Animated, View, SafeAreaView, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Image, Button, RefreshControl } from 'react-native';
import { ActionBar, WebVibe, TextVibe, ModalVibe, ButtonVibe, DialogVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import SideMenu from 'react-native-side-menu';
import messaging from '@react-native-firebase/messaging';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import { HomeStore } from 'chessvibe/src/redux/Store';
import { useSelector } from 'react-redux';

import { URL, TEAM, IMAGE, STORAGE_IS_DARK_THEME, MATCH_MODE, APP_THEME } from 'chessvibe/src/Const';
import Util, { formatDate, vw, wh, strict_equal } from 'chessvibe/src/Util';
import Cache from 'chessvibe/src/Cache';
import Backend from 'chessvibe/src/Backend';
import Storage from 'chessvibe/src/Storage';
import Stats from 'chessvibe/src/Stats';

import HomeUserMenu from './HomeUserMenu';
import NotificationMenu from './NotificationMenu';
import PlayTab from './PlayTab';
import HistoryTab from './HistoryTab';
import FriendsTab from './FriendsTab';
import SettingsTab from './SettingsTab';


const matchSize = vw((100 - 2 - 6 - 4) / 4);
const borderRadius = vw();

const NAV_TITLE = {
	play: 'ChessVibe',
	history: 'History',
	friends: 'Friends',
	settings: 'Settings',
};

const wait = (timeout) => {
	return new Promise(resolve => {
		setTimeout(resolve, timeout);
	});
}

// Navigation
HomeScreen.navigationOptions = ({navigation}) => {
	const { params = {} } = navigation.state;
	return ActionBar(NAV_TITLE[params.tab], undefined, undefined, 'BELL', params.openNotification, params.isDarkTheme);
};


// Home Screen
export default function HomeScreen(props) {
	const {setNavStack} = props.navigation.getScreenProps();

	const isDarkTheme = useSelector(state => state.home.isDarkTheme);
	const appTheme = isDarkTheme ? APP_THEME.DARK : APP_THEME.LIGHT;

	const [ opponents, setOpponents ] = React.useState(Cache.home.opponents);
	const [ matches, setMatches ] = React.useState(Cache.home.matches);

	const onRefresh = React.useCallback(() => refresh(), []);
	const user = React.useRef({});
	const screenTab = React.useRef('PlayTab');

	const { params = {} } = props.navigation.state;
	const { tab='play' } = params;
	const hidden = { display: 'none' };

	function refresh() {
		fetchMatches();
	}

	// Mount
	React.useEffect(() => {
		// Call when switching nav stack
		props.navigation.addListener('didFocus', () => {
			Backend.init();
			Backend.listenProfile(async res => {
				user.current = res.data;
				Cache.user = user.current;

				HomeStore.updateUser(user.current);
				fetchMatches();
			});
		});
	}, []);

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

	// Render function
	function render() {
		const HomeNavigator = createMaterialBottomTabNavigator(
			{
				PlayTab:     { screen: PlayTab },
				HistoryTab:  { screen: HistoryTab },
				FriendsTab:  { screen: FriendsTab },
				SettingsTab: { screen: SettingsTab },
			},
			{
				initialRouteName: screenTab.current,
				backBehavior: 'none',

				// Material tab bar config
				activeColor: appTheme.COLOR,
				inactiveColor: 'grey',
				barStyle: {
					backgroundColor: appTheme.MENU_BACKGROUND,
				},

				// Regular tab bar config
				tabBarOptions: {
					activeTintColor: appTheme.COLOR,
					activeBackgroundColor: appTheme.MENU_BACKGROUND,
					inactiveTintColor: 'grey',
					inactiveBackgroundColor: appTheme.MENU_BACKGROUND,
					style: {
						borderTopWidth: 0,
						borderTopColor: "transparent",
					},
				}
			}
		);

		const Container = createAppContainer(HomeNavigator);

		return (
			<SafeAreaView style={ styles.view }>
				<StatusBar hidden={ true }/>

				<Container
					onNavigationStateChange={(prevState, currentState, action) => {
						screenTab.current = getActiveRouteName(currentState);
					}}
					screenProps={{
						isDarkTheme,
						newMatches: matches.new,
						oldMatches: matches.old,
						friends: user.current.friends,
						opponents,
						navigateGame,
						refresh,
						setNavStack,
					}}/>

				<HomeNotificationMenu
					user={user}
					isDarkTheme={isDarkTheme}
					navigateGame={navigateGame}
					navigation={props.navigation}
					tab={tab}/>

			</SafeAreaView>
		);
	}

	// ====================== Functions ======================

	function navigateGame(match) {
		props.navigation.navigate('Game', {
			match,
			refresh: () => fetchMatches(),
		});
	}

	// Fetch user matches
	function fetchMatches() {
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

				matches.forEach((match, j) => {
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

			setOpponents(resultOpponents);
			setMatches(resultMatches);

			Cache.home.opponents = resultOpponents;
			Cache.home.matches = resultMatches;
		});
	}

	// gets the current screen from navigation state
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

	// ====================== Functions ======================

	// Render
	return render();
}


function HomeNotificationMenu({user, isDarkTheme, navigation, navigateGame, tab}) {
	const alertMenuShown = useSelector(state => state.home.alertMenuShown);

	React.useEffect(() => {
		navigation.setParams({
			tab: tab,
			isDarkTheme: isDarkTheme,
			openNotification: () => {
				HomeStore.toggleAlertMenu();
			},
		});
	}, [tab, isDarkTheme]);

	return (
		<NotificationMenu
			matches={ user.current.matches }
			navigateGame={ navigateGame }
			notificationIDs={ (user.current.notifications || []).reverse() }
			friends={ user.current.friends }
			isDarkTheme={ isDarkTheme }
			visible={ alertMenuShown }
			setVisible={ HomeStore.toggleAlertMenu }/>
	);
}


const styles = StyleSheet.create({
	view: {
		alignSelf: 'stretch',
		flex: 1,
	},

		playerScroll: {
			alignItems: 'center',
		},
});
