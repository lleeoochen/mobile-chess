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
export default function PlayTab(props) {
	const { newMatches, navigateGame, showCreateMenu, isDarkTheme } = props;
	const fadein = new Animated.Value(0);
	const appTheme = isDarkTheme ? APP_THEME.DARK : APP_THEME.LIGHT;

	React.useEffect(() => {
		Animated.timing(fadein, {
			toValue: 1,
			duration: 500,
			useNativeDriver: true,
		})
		.start();
	}, [newMatches]);

	let viewStyle = [styles.view, props.style, {
		backgroundColor: appTheme.CONTENT_BACKGROUND
	}];

	let titleStyle = [styles.matchesTitle, {
		color: appTheme.COLOR
	}];

	function renderMatches() {
		if (!newMatches || newMatches.length < 1) return;

		let $matches = [];

		for (let i in newMatches) {
			let { enemy, matches } = newMatches[i];

			matches.forEach((match, j) => {
				let match_name = match[0];
				let match_data = match[1];
				Cache.theme[match_name] = match_data.theme;

				let d = new Date(match_data.updated);
				let d_str = formatDate(d, '%M/%D');

				let active = Math.floor(match_data.moves[match_data.moves.length - 1] / 10) != 0;
				let borderStyle = match_data.black == Cache.userID ? styles.blackBorder : styles.whiteBorder;
				let colorStyle = active ? styles.greenColor : styles.greyColor;

				$matches.push(
					<ButtonVibe key={ i + '' + j } style={ {...styles.matchView, ...borderStyle} } onPress={() => navigateGame(match_name)}>
						<AutoHeightImage width={ matchSize } source={ enemy.photo ? { uri: enemy.photo + '=c' } : IMAGE.NEW_MATCH } style={ styles.matchImg }/>
						<View style={ {...styles.matchDate, ...colorStyle} }>
							<TextVibe> { d_str } </TextVibe>
						</View>
					</ButtonVibe>
				);
			});
		}

		return (
			<Animated.View style={ [styles.playerBox, { opacity: fadein }] }>
				<TextVibe style={ titleStyle }>Recent Matches</TextVibe>
				<ScrollView horizontal={ true }>
					{ $matches }
				</ScrollView>
			</Animated.View>
		);
	}

	let $container = renderMatches();
	return (
		<View style={ viewStyle }>
			<ScrollView>
				<ButtonVibe style={ styles.actionBtn } onPress={() => showCreateMenu({ show: true })}>
					<Image source={ IMAGE.NATURE } style={ styles.actionBtnImage } blurRadius={vw(0)}/>
					<TextVibe style={ styles.actionBtnText }>Play Friend</TextVibe>
				</ButtonVibe>
				<ButtonVibe style={ styles.actionBtn } onPress={() => showCreateMenu({ show: true, modeAI: true })}>
					<Image source={ IMAGE.METAL } style={ styles.actionBtnImage } blurRadius={vw(0)}/>
					<TextVibe style={ styles.actionBtnText }>Play Computer</TextVibe>
				</ButtonVibe>
			</ScrollView>
			{ $container }
		</View>
	);
}


const styles = StyleSheet.create({
	view: {
		alignSelf: 'stretch',
		flex: 1,
	},

		actionBtn: {
			margin: vw(3),
			marginBottom: 0,

			shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 1,
			},
			shadowOpacity: 0.22,
			shadowRadius: 2.22,
			elevation: 3,
		},

			actionBtnText: {
				color: 'white',
				fontSize: 25,
				fontWeight: '900',
				margin: vw(15),
				textShadowColor: 'black',
				textShadowOffset: {
					width: 0,
					height: 1,
				},
				textShadowRadius: 5,
			},

			actionBtnImage: {
				resizeMode: 'cover',
				height: '100%',
				width: '100%',
				position: 'absolute',
				borderRadius: vw(),
			},

		playerBox: {
			width: '100%',
			padding: '3%',
			borderRadius: borderRadius,
			marginBottom: vw(),
			position: 'absolute',
			bottom: 0,
		},

			matchesTitle: {
				fontSize: 20,
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
