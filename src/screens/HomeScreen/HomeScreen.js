import * as React from 'react';
import { Animated, View, SafeAreaView, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Image, Button, RefreshControl } from 'react-native';
import { ActionBar, WebVibe, TextVibe, ModalVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';

import { URL, TEAM, IMAGE } from 'chessvibe/src/Const';
import Util, { formatDate, vw, wh, winType } from 'chessvibe/src/Util';
import Cache from 'chessvibe/src/Cache';
import Backend from 'chessvibe/src/Backend';
import HomeUserMenu from './HomeUserMenu';
import HomeCreateMenu from './HomeCreateMenu';

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
	const [allMatches, setMatches] = React.useState([]);
	const [userMenuVisible, showUserMenu] = React.useState(false);
	const [createMenuVisible, showCreateMenu] = React.useState(false);
	const [refreshing, setRefreshing] = React.useState(false);
	const user = React.useRef({});
	const fadein = new Animated.Value(0);

	// Mount
	React.useEffect(() => {
		props.navigation.setParams({
			openMenu: () => {
				showUserMenu(true);
			},
			openCreate: () => {
				showCreateMenu(true)
			},
		});

		fetchMatches();
	}, []);


	const onRefresh = React.useCallback(() => {
		setRefreshing(true);

		fetchMatches();

		wait(1000).then(() => setRefreshing(false));
	}, []);


	React.useEffect(() => {
		Animated.timing(fadein, {
			toValue: 1,
			duration: 200,
			useNativeDriver: true,
		})
		.start();
	}, [allMatches]);

	// Render function
	function render() {
		// Render
		let { $containers, stats } = renderMatches();

		return (
			<SafeAreaView style={ styles.view }>
				<StatusBar hidden={ true }/>

				<ScrollView
					contentContainerStyle={ styles.playerScroll }
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}>
					{ $containers }
				</ScrollView>

				<HomeUserMenu
					visible={ userMenuVisible }
					user={ user.current }
					stats={ stats }
					onDismiss={ () => showUserMenu(false) }
					onLogout={() => {
						showUserMenu(false);
						props.navigation.navigate('Entry', {
							signout: true
						});
					}}/>

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

	// Message from WebView
	function onMessage(event) {
		let { type, ...data } = JSON.parse(event.nativeEvent.data);

		if (type == 'match_click') {
			navigateGame(data.match);
		}
		else if (type == 'signout') {
			props.navigation.navigate('Entry', {
				signout: true
			});
		}
	}

	// Navigate to game
	function navigateGame(match) {
		props.navigation.navigate('Game', {
			match: match
		});
	}

	// Create new match
	function createMatch(theme, time) {
		Backend.createMatch(theme, time).then(match => {
			fetchMatches();
			navigateGame(match);
		});
	}

	// Fetch user matches
	function fetchMatches() {
		Backend.init();
		Backend.listenProfile(res => {
			user.current = res.data;
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

				setMatches(results);
			});
		});
	}

	// Render user matches
	function renderMatches() {
		let $containers = [];
		let stats = {
			draw: 0,
			stalemate: 0,
			win: 0,
			lose: 0,
			ongoing: 0,
			resign: 0,
		};

		for (let i in allMatches) {
			let { enemy, matches } = allMatches[i];
			let $active_matches = [];
			let $inactive_matches = [];

			matches.forEach((match, j) => {
				let match_name = match[0];
				let match_data = match[1];
				Cache.theme[match_name] = match_data.theme;

				let d = new Date(match_data.updated);
				let d_str = formatDate(d, '%M/%D');

				let color = (match_data.black == Cache.userID) ? TEAM.B : TEAM.W;
				let active = Math.floor(match_data.moves[match_data.moves.length - 1] / 10) != 0;
				let borderStyle = match_data.black == Cache.userID ? styles.blackBorder : styles.whiteBorder;
				let colorStyle = active ? styles.greenColor : styles.greyColor;

				if (active) {
					$active_matches.push(
						<TouchableOpacity key={ j } style={ {...styles.matchView, ...borderStyle} } onPress={() => navigateGame(match_name)}>
							<AutoHeightImage width={ matchSize } source={ enemy.photo ? { uri: enemy.photo + '=c' } : IMAGE.NEW_MATCH } style={ styles.matchImg }/>
							<TextVibe style={ {...styles.matchDate, ...colorStyle} }> { d_str } </TextVibe>
						</TouchableOpacity>
					);
				}
				else {
					$inactive_matches.push(
						<TouchableOpacity key={ j } style={ {...styles.matchView, ...borderStyle} } onPress={() => navigateGame(match_name)}>
							<AutoHeightImage width={ matchSize } source={ enemy.photo ? { uri: enemy.photo + '=c' } : IMAGE.NEW_MATCH } style={ styles.matchImg }/>
							<TextVibe style={ {...styles.matchDate, ...colorStyle} }> { d_str } </TextVibe>
						</TouchableOpacity>
					);

					let win = winType(match_data.moves[match_data.moves.length - 1], color);
					if (win === true) stats.win += 1;
					else if (win === false) stats.lose += 1;
					else if (win === 0) stats.draw += 1;
					else if (win === 1) stats.stalemate += 1;
					else if (win === 2) stats.resign += 1;
				}
			});

			if (enemy.name) {
				$containers.push(
					<Animated.View key={ i } style={ [styles.playerBox, { opacity: fadein }] }>
						<TextVibe style={ styles.playerName }>{ enemy.name }</TextVibe>
						<ScrollView
							horizontal={ true }>
							{ $active_matches }
							{ $inactive_matches }
						</ScrollView>
					</Animated.View>
				);
			}
			else {
				$containers.unshift(
					<Animated.View key={ i } style={ [styles.playerBox, { opacity: fadein }] }>
						<TextVibe style={ styles.playerName }>New Matches</TextVibe>
						<ScrollView
							horizontal={ true }>
							{ $active_matches }
							{ $inactive_matches }
						</ScrollView>
					</Animated.View>
				);
			}
		}

		return { $containers, stats };
	}


	// ====================== Functions ======================


	// Render
	return render();
}


const styles = StyleSheet.create({
	view: {
		alignSelf: 'stretch',
		flex: 1,
		backgroundColor: 'black'
	},

		playerScroll: {
			alignItems: 'center'
		},

			playerBox: {
				backgroundColor: '#2e4e4e',
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
					},

						greenColor: { backgroundColor: '#56be68' },
						greyColor: { backgroundColor: '#7f7f7f' },
});
