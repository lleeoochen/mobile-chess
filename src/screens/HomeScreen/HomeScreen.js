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
	const [ createMenuVisible, showCreateMenu ] = React.useState(false);

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
	}, []);

	const { params = {} } = props.navigation.state;
	const { tab='play' } = params;
	const hidden = { display: 'none' };

	// Render function
	function render() {
		return (
			<SafeAreaView style={ styles.view }>
				<StatusBar hidden={ true }/>
				<PlayTab    navigation={ props.navigation } style={ tab == 'play' ? {} : hidden }/>
				<HistoryTab navigation={ props.navigation } style={ tab == 'history' ? {} : hidden }/>

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
			// refresh: () => fetchMatches()
		});
	}

	// Create new match
	function createMatch(theme, time) {
		Backend.createMatch(theme, time).then(match_id => {
			Cache.theme[match_id] = theme;
			// fetchMatches();
			navigateGame(match_id);
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

			playerBox: {
				// backgroundColor: 'darkgrey',
				width: '98%',
				padding: '3%',
				borderRadius: borderRadius,
				marginBottom: vw(),
			},

				playerName: {
					fontSize: 20,
					color: 'white',
					paddingBottom: vw(2),
				},

				matchView: {
					width: matchSize,
					marginRight: vw(2),
					borderRadius: borderRadius,
					shadowColor: "#000",
					shadowOffset: {
						width: 0,
						height: 1,
					},
					shadowOpacity: 0.22,
					shadowRadius: 2.22,

					elevation: 3,
				},

					blackBorder: { borderColor: 'black' },
					whiteBorder: { borderColor: 'white' },

					matchImg: {
					},

					matchDate: {
						textAlign: 'center',
						width: '100%'
					},

						greenColor: { backgroundColor: '#56be68' },
						greyColor: { backgroundColor: '#7f7f7f' },
});
