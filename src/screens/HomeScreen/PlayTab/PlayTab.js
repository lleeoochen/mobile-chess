import * as React from 'react';
import { Animated, View, SafeAreaView, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Image, Button, RefreshControl } from 'react-native';
import { ActionBar, WebVibe, TextVibe, ModalVibe, ButtonVibe, DialogVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import Carousel from 'react-native-snap-carousel';
import Store, { HomeStore } from 'chessvibe/src/redux/Store';
import { useSelector } from 'react-redux';
import HomeCreateMenu from '../HomeCreateMenu';


import { URL, TEAM, IMAGE, APP_THEME, MATCH_MODE } from 'chessvibe/src/Const';
import Util, { formatDate, vw, vh, formatImage } from 'chessvibe/src/Util';
import Cache from 'chessvibe/src/Cache';
import Backend from 'chessvibe/src/Backend';
import SideMenu from 'react-native-side-menu'

const matchSize = vw((100 - 2 - 6 - 4) / 4);
const borderRadius = vw();


// Navigation
PlayTab.navigationOptions = ({navigation}) => {
	return {
		tabBarLabel: 'Play',
		tabBarIcon: (
			<Image style={ styles.tab } source={ IMAGE['DRAW' + (Store.getState().home.isDarkTheme ? '' : '_DARK')] }/>
		)
	};
};

// Home Screen
export default function PlayTab(props) {
	// Screen props from navigation
	const {
		isDarkTheme,
		newMatches,
		friends,
		opponents,
		navigateGame,
	} = props.navigation.getScreenProps();

	const ACTION_DATA = [
		{
			text: 'Sandbox',
			description: 'To be announced...',
			image: IMAGE.WINTER,
			onPress: () => {},
		},
		{
			text: 'Friend',
			description: 'Challenge a friend',
			image: IMAGE.NATURE,
			onPress: () => showCreateMenu({ show: true, mode: MATCH_MODE.FRIEND }),
		},
		{
			text: 'Computer',
			description: 'Practice with computer',
			image: IMAGE.METAL,
			onPress: () => showCreateMenu({ show: true, mode: MATCH_MODE.COMPUTER }),
		},
	];


	const [ createMenuVisible, showCreateMenu ] = React.useState({ show: false });


	const startingMode = 1;
	const [ description, setDescription ] = React.useState(ACTION_DATA[startingMode].description);
	const [ fadein ] = React.useState(new Animated.Value(0));
	const appTheme = isDarkTheme ? APP_THEME.DARK : APP_THEME.LIGHT;
	const firstLoad = React.useRef(true);

	React.useEffect(() => {
		if (firstLoad.current) {
			Animated.timing(fadein, {
				toValue: 1,
				duration: 200,
				delay: 100,
				useNativeDriver: true,
			})
			.start();
			firstLoad.current = false;
		}
	}, [newMatches]);


	// Custom theme styles
	let viewStyle = [styles.view, props.style, {
		backgroundColor: appTheme.CONTENT_BACKGROUND
	}];

	let titleStyle = [styles.matchesTitle, {
		color: appTheme.COLOR
	}];


	function onSnapToMode(modeData) {
		setDescription(modeData.description);
	}


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
						<AutoHeightImage width={ matchSize } source={ formatImage(enemy.photo) } style={ styles.matchImg }/>
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
			<ButtonVibe style={ styles.actionBtn } onPress={ item.onPress }>
				<Image source={ item.image } style={ styles.actionBtnImage } blurRadius={vw(0)}/>
				<TextVibe style={ styles.actionBtnText }>{ item.text }</TextVibe>
			</ButtonVibe>
		);
	}

	// Render
	let $container = renderMatches();
	return (
		<View style={ viewStyle }>
			<Carousel
				layout={ 'default' }
				data={ ACTION_DATA }
				renderItem={ actionItem }
				firstItem={ startingMode }
				// loop={ true }
				// loopClonesPerSide={ 5 }
				// useScrollView={ true }
				// autoplay={ true }
				// autoplayInterval={ 5000 }
				sliderWidth={ vw(100) }
				itemWidth={ vw(80) }
				contentContainerCustomStyle={ styles.carousel }
				onScrollIndexChanged={ index => onSnapToMode(ACTION_DATA[index]) }/>
			<TextVibe style={ [styles.description, { color: appTheme.SUB_COLOR }] }>{ description }</TextVibe>
			{ $container }

			<HomeCreateMenu
				visible={ createMenuVisible.show }
				mode={ createMenuVisible.mode }
				opponents={ opponents }
				friends={ friends || {} }
				onDismiss={ () => showCreateMenu({ show: false, mode: createMenuVisible.mode }) }
				onSubmit={(theme, time, friend, isAI) => {
					showCreateMenu({ show: false });
					Backend.createMatch(theme, time, friend, isAI).then(match_id => {
						Cache.theme[match_id] = theme;
						navigateGame(match_id);
					});
				} }/>
		</View>
	);
}

const tab_size = vw(7);

const styles = StyleSheet.create({
	view: {
		alignSelf: 'stretch',
		flex: 1,
	},

	tab: {
		width: tab_size,
		height: tab_size,
		marginTop: 'auto',
		marginBottom: 'auto',
	},

	carousel: {
		alignItems: 'flex-start',
		marginTop: vw(5),
		paddingTop: vw(10),
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

	description: {
		// width: vw(70),
		fontSize: vw(4.5),
		textAlign: 'center',
		color: 'grey',
		flex: 1,
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
