import * as React from 'react';
import { FlatList, Animated, View, StyleSheet, Image } from 'react-native';
import { TextVibe, ButtonVibe, InputVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import Carousel from 'react-native-snap-carousel';
import Store from 'chessvibe/src/redux/Store';
import HomeCreateMenu from '../HomeCreateMenu';
import { useSelector } from 'react-redux';

import { IMAGE, APP_THEME, MATCH_MODE } from 'chessvibe/src/Const';
import { formatDate, vw, formatImage } from 'chessvibe/src/Util';
import Cache from 'chessvibe/src/Cache';
import Backend from 'chessvibe/src/Backend';

const matchSize = vw((100 - 2 - 6 - 4) / 4);
const borderRadius = vw();


// Navigation
PlayTab.navigationOptions = () => {
	return {
		tabBarLabel: 'Play',
		tabBarIcon: (
			<Image style={ styles.tab } source={ IMAGE['DRAW' + (Store.getState().home.appThemeId === 'DARK' ? '' : '_DARK')] }/>
		)
	};
};

// Home Screen
export default function PlayTab(props) {
	// Screen props from navigation
	const {
		navigateGame,
	} = props.navigation.getScreenProps();

	const appThemeId = useSelector(state => state.home.appThemeId);
	const newMatches = useSelector(state => state.home.matches.new);
	const opponents = useSelector(state => state.home.opponents);
	const {friends={}} = useSelector(state => state.home.user);

	const ACTION_DATA = [
		{
			text: 'Practice with Computer',
			description: '',
			image: IMAGE.METAL,
			onPress: () => showCreateMenu({ show: true, mode: MATCH_MODE.COMPUTER }),
		},
		{
			text: 'Challenge A Friend',
			description: '',
			image: IMAGE.NATURE,
			onPress: () => showCreateMenu({ show: true, mode: MATCH_MODE.FRIEND }),
		},
		// {
		// 	text: 'Hell Mode',
		// 	description: 'Play dirty and play to win',
		// 	image: IMAGE.HELL,
		// 	onPress: () => {},
		// },
	];

	const [ createMenuVisible, showCreateMenu ] = React.useState({ show: false });

	const startingMode = 1;
	const [ description, setDescription ] = React.useState(ACTION_DATA[startingMode].description);
	const [ fadein ] = React.useState(new Animated.Value(0));
	const appTheme = APP_THEME[appThemeId];
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
	function renderMatches(matches) {
		const renderMatchItem = ({index, item}) => {
			const [match_name, match_data, enemy] = item;
			Cache.theme[match_name] = match_data.theme;
			return renderMatch(enemy, match_name, match_data, index);
		};

		return (
			<Animated.View style={ [styles.playerBox, { opacity: fadein }] }>
				<TextVibe style={ titleStyle }>Recent Matches</TextVibe>
				<FlatList
					data={matches}
					renderItem={renderMatchItem}
					keyExtractor={(item, index) => index.toString()}
					horizontal={true}/>
			</Animated.View>
		);
	}

	function renderMatch(enemy, match_name, match_data, count) {
		let active = false, updated_date = '', colorStyle = styles.greyColor;

		if (match_data.moves) {
			active = Math.floor(match_data.moves[match_data.moves.length - 1] / 10) != 0;
			colorStyle = active ? styles.greenColor : styles.greyColor;
		}

		if (match_data.updated) {
			updated_date = formatDate(new Date(match_data.updated), '%M/%D');
		}

		return (
			<ButtonVibe
				key={count}
				style={styles.matchView}
				onPress={() => navigateGame(match_name)}>

				<AutoHeightImage
					width={matchSize}
					source={formatImage(enemy.photo)}
					style={styles.matchImg}/>

				<View style={{...styles.matchDate, ...colorStyle}}>
					<TextVibe>{updated_date}</TextVibe>
				</View>
			</ButtonVibe>
		);
	}

	// Render carousel action buttons
	let actionItem = ({ item }) => {
		return (
			<ButtonVibe style={ styles.actionBtn } onPress={ item.onPress }>
				<Image source={ item.image } style={ styles.actionBtnImage } blurRadius={vw(0)}/>
				<TextVibe style={ styles.actionBtnText }>{ item.text }</TextVibe>
			</ButtonVibe>
		);
	};

	// Render
	const formattedMatches = newMatches.map(({enemy, matches}) => {
		return matches.map(match => [...match, enemy]);
	}).flat();
	const $container = renderMatches(formattedMatches);

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
			{/* <TextVibe style={ [styles.description, { color: appTheme.SUB_COLOR }] }>{ description }</TextVibe> */}
			<InputVibe
				initValue=''
				placeholder='Invite Code'
				onSubmitText={(matchName) => navigateGame(matchName)}
				onChangeText={() => {}}
				style={{
					color: appTheme.COLOR,
					backgroundColor: appTheme.MENU_BACKGROUND,
					margin: vw(2),
					borderRadius: vw(),
				}}
			/>
			{$container}

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
				}}/>
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
	},

		actionBtn: {
			margin: vw(3),
			height: vw(80),

			shadowColor: '#000',
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

			shadowColor: '#000',
			shadowOffset: {
				width: 0,
				height: 1,
			},
			shadowOpacity: 0.22,
			shadowRadius: 2.22,
			elevation: 3,
		},

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
