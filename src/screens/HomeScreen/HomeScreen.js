import * as React from 'react';
import { Animated, View, SafeAreaView, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Image, Button, RefreshControl } from 'react-native';
import { ActionBar, WebVibe, TextVibe, ModalVibe, ButtonVibe, DialogVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import SideMenu from 'react-native-side-menu';

import Store from 'chessvibe/src/redux/Store';
import { useSelector } from 'react-redux';
import { showDrawer, updateUser, updateTheme, setIsDarkTheme } from 'chessvibe/src/redux/Reducer';

import { URL, TEAM, IMAGE, STORAGE_IS_DARK_THEME } from 'chessvibe/src/Const';
import Util, { formatDate, vw, wh, winType, strict_equal } from 'chessvibe/src/Util';
import Cache from 'chessvibe/src/Cache';
import Backend from 'chessvibe/src/Backend';
import Storage from 'chessvibe/src/Storage';

import HomeUserMenu from './HomeUserMenu';
import HomeCreateMenu from './HomeCreateMenu';
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
	return ActionBar(NAV_TITLE[params.tab], 'MENU', params.openMenu, 'HALFMOON', params.openCreate, params.isDarkTheme);
};


// Home Screen
export default function HomeScreen(props) {
	const isDarkTheme = useSelector(state => state.isDarkTheme);

	const [ opponents, setOpponents ] = React.useState([]);
	const [ matches, setMatches ] = React.useState({ new: [], old: [] });
	const [ createMenuVisible, showCreateMenu ] = React.useState({ show: false });
	const [ refreshing, setRefreshing ] = React.useState(false);
	const onRefresh = React.useCallback(() => refresh(), []);
	const user = React.useRef({});

	const { params = {} } = props.navigation.state;
	const { tab='play' } = params;
	const hidden = { display: 'none' };

	function refresh() {
		setRefreshing(true);
		fetchMatches();
	}

	// Mount
	React.useEffect(() => {
		// Call when switching nav stack
		props.navigation.addListener('didFocus', () => {
			Backend.init();
			Backend.listenProfile(res => {
				user.current = res.data;

				Store.dispatch(updateUser( user.current ));
				fetchMatches();
			});
		});
	}, []);


	React.useEffect(() => {
		props.navigation.setParams({
			tab: tab,
			isDarkTheme: isDarkTheme,
			openMenu: () => {
				props.screenProps.openDrawer(true);
			},
			openCreate: () => {
				Store.dispatch(setIsDarkTheme( !isDarkTheme ));
				Storage.set(STORAGE_IS_DARK_THEME, !isDarkTheme + '');
			},
		});
	}, [tab, isDarkTheme]);

	// Render function
	function render() {
		return (
			<SafeAreaView style={ styles.view }>
				<StatusBar hidden={ true }/>

				<PlayTab
					navigation={ props.navigation }
					navigateGame={ navigateGame }
					newMatches={ matches.new }
					showCreateMenu={ showCreateMenu }
					isDarkTheme={ isDarkTheme }
					style={ tab == 'play' ? {} : hidden }/>

				<HistoryTab
					navigation={ props.navigation }
					oldMatches={ matches.old }
					navigateGame={ navigateGame }
					refreshing={ refreshing }
					refresh={ refresh }
					isDarkTheme={ isDarkTheme }
					style={ tab == 'history' ? {} : hidden }/>

				<FriendsTab
					navigation={ props.navigation }
					isDarkTheme={ isDarkTheme }
					opponents={ opponents }
					friends={ user.current.friends }
					style={ tab == 'friends' ? {} : hidden }/>

				<SettingsTab
					navigation={ props.navigation }
					isDarkTheme={ isDarkTheme }
					style={ tab == 'settings' ? {} : hidden }/>

				<HomeCreateMenu
					visible={ createMenuVisible.show }
					onDismiss={ () => showCreateMenu({ show: false }) }
					onSubmit={(theme, time) => {
						createMatch(theme, time, createMenuVisible.modeAI);
						showCreateMenu({ show: false });
					}}/>
			</SafeAreaView>
		);
	}

	// ====================== Functions ======================

	// Navigate to game
	function navigateGame(match) {
		props.navigation.navigate('Game', {
			match: match,
			refresh: () => fetchMatches()
		});
	}

	// Create new match
	function createMatch(theme, time, AI) {
		Backend.createMatch(theme, time, AI).then(match_id => {
			Cache.theme[match_id] = theme;
			navigateGame(match_id);
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
				let stats = {
					draw: 0,
					stalemate: 0,
					win: 0,
					lose: 0,
					ongoing: 0,
					resign: 0,
				};

				matches.forEach((match, j) => {
					let match_data = match[1];

					let color = (match_data.black == Cache.userID) ? TEAM.B : TEAM.W;
					let win = winType(match_data.moves[match_data.moves.length - 1], color);
					if (win === true) stats.win += 1;
					else if (win === false) stats.lose += 1;
					else if (win === 0) stats.draw += 1;
					else if (win === 1) stats.stalemate += 1;
					else if (win === 2) stats.resign += 1;
				});

				if (enemy.name && enemy.name != 'Computer') {
					opponentsSet.add([enemy, stats]);
				}
			});

			setOpponents([...opponentsSet].sort((a, b) => {

				if (a[0].name < b[0].name)
					return -1;
				if (a[0].name > b[0].name)
					return 1;
				return 0;
			}));
			setMatches(resultMatches);
			setRefreshing(false);
		});
	}

	// ====================== Functions ======================

	// Render
	return render();
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
