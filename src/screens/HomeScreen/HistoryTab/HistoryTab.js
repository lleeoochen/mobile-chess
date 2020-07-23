import * as React from 'react';
import { Animated, View, SafeAreaView, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Image, Button, RefreshControl } from 'react-native';
import { ActionBar, WebVibe, TextVibe, ModalVibe, ButtonVibe, DialogVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';

import { URL, TEAM, IMAGE, APP_THEME } from 'chessvibe/src/Const';
import Util, { formatDate, vw, wh, winType } from 'chessvibe/src/Util';
import Cache from 'chessvibe/src/Cache';
import Backend from 'chessvibe/src/Backend';
import SideMenu from 'react-native-side-menu'
import { showDrawer, updateUser, updateTheme } from 'chessvibe/src/redux/Reducer';
import Store from 'chessvibe/src/redux/Store';

const matchSize = vw((100 - 2 - 6 - 4) / 4);
const borderRadius = vw();

// Home Screen
export default function HistoryTab(props) {
	const { oldMatches, navigateGame, refreshing, refresh, isDarkTheme } = props;
	const appTheme = isDarkTheme ? APP_THEME.DARK : APP_THEME.LIGHT;
	// const [ selectedMatch, selectMatch ] = React.useState(null);
	const user = React.useRef({});
	const fadein = new Animated.Value(0);
	const onRefresh = React.useCallback(() => refresh(), []);


	React.useEffect(() => {
		Animated.timing(fadein, {
			toValue: 1,
			duration: 500,
			useNativeDriver: true,
		})
		.start();
	}, [oldMatches]);


	function deleteMatch(match_id) {
		Backend.deleteMatch(match_id).then(async () => {
			selectMatch(null);
			refresh();
		});
	}

	let viewStyle = [styles.view, props.style, {
		backgroundColor: appTheme.CONTENT_BACKGROUND
	}];

	let titleStyle = [styles.matchesTitle, {
		color: appTheme.COLOR
	}];

	// Render function
	function render() {
		// Render
		let $containers = renderMatches();

		return (
			<SafeAreaView style={ viewStyle }>
				<StatusBar hidden={ true }/>

				<ScrollView
					contentContainerStyle={ styles.playerScroll }
					refreshControl={
						<RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } tintColor={ appTheme.COLOR } />
					}>
					{ $containers }
				</ScrollView>

				{/*
				<DialogVibe
					title={ 'Delete match?' }
					confirmBtnText={ 'Delete' }
					visible={ selectedMatch != null }
					onSuccess={ () => deleteMatch(selectedMatch) }
					onDismiss={ () => selectMatch(null) }/>
				*/}
			</SafeAreaView>
		);
	}

	// ====================== Functions ======================

	// Render user matches
	function renderMatches() {
		let $containers = [];

		for (let i in oldMatches) {
			let { enemy, matches } = oldMatches[i];
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
						<ButtonVibe key={ j } style={ {...styles.matchView, ...borderStyle} } onPress={() => navigateGame(match_name)} onLongPress={ () => selectMatch(match_name) }>
							<AutoHeightImage width={ matchSize } source={ enemy.photo ? { uri: enemy.photo + '=c' } : IMAGE.NEW_MATCH } style={ styles.matchImg }/>
							<View style={ {...styles.matchDate, ...colorStyle} }>
								<TextVibe> { d_str } </TextVibe>
							</View>
						</ButtonVibe>
					);
				}
				else {
					$inactive_matches.push(
						<ButtonVibe key={ j } style={ {...styles.matchView, ...borderStyle} } onPress={() => navigateGame(match_name)} onLongPress={ () => selectMatch(match_name) }>
							<AutoHeightImage width={ matchSize } source={ enemy.photo ? { uri: enemy.photo + '=c' } : IMAGE.NEW_MATCH } style={ styles.matchImg }/>
							<View style={ {...styles.matchDate, ...colorStyle} }>
								<TextVibe> { d_str } </TextVibe>
							</View>
						</ButtonVibe>
					);
				}
			});
			$containers.push(
				<Animated.View key={ i } style={ [styles.playerBox, { opacity: fadein }] }>
					<TextVibe style={ titleStyle }>{ enemy.name }</TextVibe>
					<ScrollView
						horizontal={ true }>
						{ $active_matches }
						{ $inactive_matches }
					</ScrollView>
				</Animated.View>
			);
		}

		return $containers;
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

		playerBox: {
			width: '100%',
			padding: '3%',
			borderRadius: borderRadius,
			marginBottom: vw(),
		},

			matchesTitle: {
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
					borderTopLeftRadius: vw(1),
					borderTopRightRadius: vw(1),
				},

				matchDate: {
					alignItems: 'center',
					width: '100%',
					borderBottomLeftRadius: vw(1),
					borderBottomRightRadius: vw(1),
				},

					greenColor: { backgroundColor: '#56be68' },
					greyColor: { backgroundColor: '#7f7f7f' },
});
