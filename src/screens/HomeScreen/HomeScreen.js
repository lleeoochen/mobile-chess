import * as React from 'react';
import { Animated, View, SafeAreaView, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Image, Button, RefreshControl } from 'react-native';
import { ActionBar, WebVibe, TextVibe, ModalVibe, ButtonVibe, DialogVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import SideMenu from 'react-native-side-menu';

import Store from 'chessvibe/src/redux/Store';
import { showDrawer, updateUser, updateTheme } from 'chessvibe/src/redux/Reducer';
import { URL, TEAM, IMAGE } from 'chessvibe/src/Const';
import Util, { formatDate, vw, wh, winType } from 'chessvibe/src/Util';
import Cache from 'chessvibe/src/Cache';
import Backend from 'chessvibe/src/Backend';

import HomeUserMenu from './HomeUserMenu';
import HomeCreateMenu from './HomeCreateMenu';
import PlayTab from './PlayTab';
import HistoryTab from './HistoryTab';


const matchSize = vw((100 - 2 - 6 - 4) / 4);
const borderRadius = vw();

const wait = (timeout) => {
	return new Promise(resolve => {
		setTimeout(resolve, timeout);
	});
}

// Navigation
HomeScreen.navigationOptions = ({navigation}) => {
	const { params = {} } = navigation.state;
	return ActionBar('ChessVibe', IMAGE.MENU, params.openMenu, IMAGE.NEW_GAME, params.openCreate);
};


// Home Screen
export default function HomeScreen(props) {
	const [ matches, setMatches ] = React.useState({});
	const [ createMenuVisible, showCreateMenu ] = React.useState(false);
	const [ refreshing, setRefreshing ] = React.useState(false);
	const onRefresh = React.useCallback(() => refresh(), []);
	const user = React.useRef({});


	function refresh() {
		setRefreshing(true);
		fetchMatches();
	}

	// Mount
	React.useEffect(() => {
		props.navigation.setParams({
			openMenu: () => {
				props.screenProps.openDrawer(true);
			},
			openCreate: () => {
				showCreateMenu(true)
			},
		});
		fetchMatches();
	}, []);

	const { params = {} } = props.navigation.state;
	const { tab='play' } = params;
	const hidden = { display: 'none' };

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
					style={ tab == 'play' ? {} : hidden }/>

				<HistoryTab
					navigation={ props.navigation }
					oldMatches={ matches.old }
					navigateGame={ navigateGame }
					refreshing={ refreshing }
					refresh={ refresh }
					style={ tab == 'history' ? {} : hidden }/>

				<HomeCreateMenu
					visible={ createMenuVisible }
					onDismiss={ () => showCreateMenu(false) }
					onSubmit={(theme, time) => {
						showCreateMenu(false);
						createMatch(theme, time);
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
	function createMatch(theme, time) {
		Backend.createMatch(theme, time).then(match_id => {
			Cache.theme[match_id] = theme;
			fetchMatches();
			navigateGame(match_id);
		});
	}

	// Fetch user matches
	function fetchMatches() {
		Backend.init();
		Backend.listenProfile(res => {
			user.current = res.data;
			let matches_dict = {};
			let matches_promises = [];

			Store.dispatch(updateUser( user.current ));

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

				// Sort opponent by latest date
				results.sort((r1, r2) => {
					let r1_time = r1.matches[0][1].updated || 0;
					if (typeof r1_time == 'object') r1_time = 0;
					if (Util.gameFinished(r1.matches[0][1])) r1_time -= new Date().getTime();

					let r2_time = r2.matches[0][1].updated || 0;
					if (typeof r2_time == 'object') r2_time = 0;
					if (Util.gameFinished(r2.matches[0][1])) r2_time -= new Date().getTime();

					return r2_time - r1_time;
				});


				let newMatches = [];
				let oldMatches = [];

				for (let i in results) {
					if (results[i].enemy.name) oldMatches.push(results[i]);
					else                       newMatches.push(results[i]);
				}

				setMatches({
					new: newMatches,
					old: oldMatches,
				});
				setRefreshing(false);
			});
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
		backgroundColor: '#1a283a',
	},

		playerScroll: {
			alignItems: 'center',
			backgroundColor: '#1a283a',
		},
});
