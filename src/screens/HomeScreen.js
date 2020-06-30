import * as React from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Image, Button } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';

import ActionBar from '../widgets/ActionBar';
import WebVibe from '../widgets/WebVibe';
import TextVibe from '../widgets/TextVibe';
import ModalVibe from '../widgets/ModalVibe';

import { URL, TEAM } from '../Const';
import { formatDate, vw, wh, winType } from '../Util';
import Cache from '../Cache';
import Backend from '../Backend';


var menu_img = require('chessvibe/assets/menu.png');
var new_game_img = require('chessvibe/assets/new_game.png');
var new_match_img = require('chessvibe/assets/new_match.png');

const matchSize = vw((100 - 2 - 6 - 4) / 4);
const borderRadius = vw();


// Navigation
HomeScreen.navigationOptions = ({navigation}) => {
	const { params = {} } = navigation.state;
	return ActionBar('ChessVibe', menu_img, params.openMenu, new_game_img, params.openCreate);
};

// Home Screen
export default function HomeScreen(props) {
	const [allMatches, setMatches] = React.useState([]);
	const [menuVisible, setMenuVisible] = React.useState(false);
	const user = React.useRef({});
	const user_id = React.useRef(null);

	// Mount
	React.useEffect(() => {
		props.navigation.setParams({
			openMenu: () => {
				setMenuVisible(true);
			},
			openCreate: () => {
			},
		});

		Backend.init();
		Backend.getProfile().then(res => {
			user.current = res.data;
			user_id.current = res.id;
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

						let b_time = b[1].updated || 0;
						if (typeof b_time == 'object') b_time = 0;

						return b_time - a_time;
					});
				}

				// Sort opponent by latest date
				results.sort((r1, r2) => {
					let r1_time = r1.matches[0][1].updated || 0;
					if (typeof r1_time == 'object') r1_time = 0;

					let r2_time = r2.matches[0][1].updated || 0;
					if (typeof r2_time == 'object') r2_time = 0;

					return r2_time - r1_time;
				});

				setMatches(results);
			});
		});
	}, []);

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


	// Render
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

		matches.forEach(match => {
			let match_name = match[0];
			let match_data = match[1];

			let d = new Date(match_data.updated);
			let d_str = formatDate(d, '%M/%D');

			let color = (match_data.black == user_id) ? TEAM.B : TEAM.W;
			let active = Math.floor(match_data.moves[match_data.moves.length - 1] / 10) != 0;
			let borderStyle = match_data.black == user_id ? styles.blackBorder : styles.whiteBorder;
			let colorStyle = active ? styles.greenColor : styles.greyColor;

			if (active) {
				$active_matches.push(
					<TouchableOpacity style={ {...styles.matchView, ...borderStyle} } onPress={() => navigateGame(match_name)}>
						<AutoHeightImage width={ matchSize - vw(2) } source={ enemy.photo ? { uri: enemy.photo + '=c' } : new_match_img }/>
						<TextVibe style={ {...styles.matchDate, ...colorStyle} }> { d_str } </TextVibe>
					</TouchableOpacity>
				);
			}
			else {
				$inactive_matches.push(
					<TouchableOpacity style={ {...styles.matchView, ...borderStyle} } onPress={() => navigateGame(match_name)}>
						<AutoHeightImage width={ matchSize - vw(2) } source={ enemy.photo ? { uri: enemy.photo + '=c' } : new_match_img }/>
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
				<View style={ styles.playerBox }>
					<TextVibe style={ styles.playerName }>{ enemy.name }</TextVibe>
					<ScrollView
						horizontal={ true }>
						{ $active_matches }
						{ $inactive_matches }
					</ScrollView>
				</View>
			);
		}
		else {
			$containers.unshift(
				<View style={ styles.playerBox }>
					<TextVibe style={ styles.playerName }>New Matches</TextVibe>
					<ScrollView
						horizontal={ true }>
						{ $active_matches }
						{ $inactive_matches }
					</ScrollView>
				</View>
			);
		}
	}	

	return (
		<SafeAreaView style={ styles.view }>
			<StatusBar hidden={ true }/>
			<ScrollView contentContainerStyle={ styles.playerScroll }>
				{ $containers }
			</ScrollView>

			{/* Menu Modal */}
			<ModalVibe
				isVisible={ menuVisible }
				onDismiss={ () => setMenuVisible(false) }>

				<TextVibe style={ styles.menuText }>{ user.current.name || '' }</TextVibe>
				<AutoHeightImage
					style={ styles.menuImage }
					width={ vw(30) }
					source={ user.current.photo ? { uri: user.current.photo + '=c' } : new_match_img }/>

				<TextVibe style={ styles.menuStat }>Win Rate { (stats.win * 100.0 / (stats.win + stats.lose)).toFixed(2) }%.</TextVibe>
				<TextVibe style={ styles.menuStat }>Win { stats.win } games.</TextVibe>
				<TextVibe style={ styles.menuStat }>Lose { stats.lose } games.</TextVibe>
				<TextVibe style={ styles.menuStat }>Draw { stats.draw } games.</TextVibe>
				<TextVibe style={ styles.menuStat }>Stalemate { stats.stalemate } games.</TextVibe>
				<TextVibe style={ styles.menuStat }>Resign { stats.draw } games.</TextVibe>
				<TextVibe style={ styles.menuStat }>Ongoing { stats.ongoing } games.</TextVibe>
				<TouchableOpacity style={ styles.menuBtn } onPress={ () => setMenuVisible(false) }>
					<TextVibe style={ styles.menuBtnText }>Logout</TextVibe>
				</TouchableOpacity>
			</ModalVibe>
		</SafeAreaView>
	);
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
					fontSize: 25,
					color: 'white',
					paddingBottom: vw(2),
				},

				matchView: {
					backgroundColor: 'orange',
					width: matchSize,
					// height: matchSize,
					marginRight: vw(),
					borderRadius: borderRadius,
					borderWidth: vw(),
				},

					blackBorder: { borderColor: 'black' },
					whiteBorder: { borderColor: 'white' },

					matchDate: {
						textAlign: 'center'
					},

						greenColor: { backgroundColor: '#56be68' },
						greyColor: { backgroundColor: '#7f7f7f' },

	menuText: {
		color: 'white',
		fontSize: vw(8),
		textAlign: 'center',
	},	

	menuImage: {
		marginVertical: vw(5)
	},

	menuStat: {
		color: 'white',
		fontSize: vw(5),
	},

	menuBtn: {
		marginVertical: vw(5),
		backgroundColor: 'white',
		padding: vw(2),
		paddingTop: vw(),
		borderRadius: borderRadius,
		width: '100%',
	},

	menuBtnText: {
		fontSize: vw(5),
		textAlign: 'center',
	}
});
