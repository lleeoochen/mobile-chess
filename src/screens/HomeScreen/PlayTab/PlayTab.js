import * as React from 'react';
import { Animated, View, SafeAreaView, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Image, Button, RefreshControl } from 'react-native';
import { ActionBar, WebVibe, TextVibe, ModalVibe, ButtonVibe, DialogVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import Carousel from 'react-native-snap-carousel';

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
	const firstLoad = React.useRef(true);

	React.useEffect(() => {
		if (firstLoad.current && newMatches.length > 0) {
			Animated.timing(fadein, {
				toValue: 1,
				duration: 200,
				useNativeDriver: true,
			})
			.start();
			firstLoad.current = false;
		}
	},
	[newMatches]);

	// Custom theme styles
	let viewStyle = [styles.view, props.style, {
		backgroundColor: appTheme.CONTENT_BACKGROUND
	}];

	let titleStyle = [styles.matchesTitle, {
		color: appTheme.COLOR
	}];

	// Render recent matches
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

	// Render carousel action buttons
	let actionItem = ({ item, index }) => {
		return (
			<ButtonVibe style={ styles.actionBtn } onPress={() => showCreateMenu({ show: true })}>
				<Image source={ item.image } style={ styles.actionBtnImage } blurRadius={vw(0)}/>
				<TextVibe style={ styles.actionBtnText }>{ item.text }</TextVibe>
			</ButtonVibe>
		);
	}

	let actionData = [
		{ text: 'Friend', image: IMAGE.NATURE },
		{ text: 'Computer', image: IMAGE.METAL },
		{ text: 'Sandbox', image: IMAGE.WINTER },
	];

	// Render
	let $container = renderMatches();
	return (
		<View style={ viewStyle }>
			<Carousel
				layout={ 'default' }
				data={ actionData }
				renderItem={ actionItem }
				loop={ true }
				loopClonesPerSide={ 5 }
				useScrollView={ true }
				// autoplay={ true }
				// autoplayInterval={ 5000 }
				sliderWidth={ vw(100) }
				itemWidth={ vw(80) }
				contentContainerCustomStyle={ styles.carousel }/>
			{ $container }
		</View>
	);
}


const styles = StyleSheet.create({
	view: {
		alignSelf: 'stretch',
		flex: 1,
	},

	carousel: {
		alignItems: 'flex-start',
		marginTop: vw(15),
	},

		actionBtn: {
			margin: vw(3),
			// marginBottom: 0,
			marginTop: vw(10),

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
				fontSize: vw(10),
				fontWeight: '900',
				margin: vw(15),
				textShadowColor: 'black',
				textShadowOffset: {
					width: 0,
					height: 1,
				},
				textShadowRadius: 5,
				width: '100%',
				textAlign: 'center',
			},

			actionBtnImage: {
				// resizeMode: 'cover',
				height: vw(80),
				width: vw(80),
				position: 'absolute',
				borderRadius: vw(),
			},

		playerBox: {
			width: '100%',
			padding: '3%',
			borderRadius: borderRadius,
			marginBottom: vw(),
			// position: 'absolute',
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
