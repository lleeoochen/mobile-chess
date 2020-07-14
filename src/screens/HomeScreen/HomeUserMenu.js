import * as React from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { TextVibe, ModalVibe, ButtonVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import { vw } from 'chessvibe/src/Util';
import Cache from 'chessvibe/src/Cache';
import { useSelector } from 'react-redux';
import { IMAGE } from 'chessvibe/src/Const';
import { showDrawer } from 'chessvibe/src/redux/Reducer';
import Store from 'chessvibe/src/redux/Store';

const new_match_img = require('chessvibe/assets/new_match.png');
const borderRadius = vw();

export default function HomeUserMenu(props) {
	const user = useSelector(state => state.user) || {};
	const zoomIn = new Animated.Value(props.drawerOpen ? 0.8 : 1);

	let {
		visible=false,
		onDismiss=() => {},
		onLogout=() => {
			if (props.navRef && props.navRef.current && props.navRef.current._navigation) {
				props.openDrawer(false);

				setTimeout(() => {
					props.navRef.current._navigation.navigate('Entry', {
						signout: true
					});
				}, 500);
			}
		},
		stats={
			draw: 0,
			stalemate: 0,
			win: 0,
			lose: 0,
			ongoing: 0,
			resign: 0,
		}
	} = props;


	Animated.timing(zoomIn, {
		toValue: props.drawerOpen ? 1 : 0.8,
		duration: 200,
		useNativeDriver: true,
	}).start();


	// <TextVibe style={ styles.menuStat }>Win Rate { (stats.win * 100.0 / (stats.win + stats.lose)).toFixed(2) }%.</TextVibe>
	// <TextVibe style={ styles.menuStat }>Win { stats.win } games.</TextVibe>
	// <TextVibe style={ styles.menuStat }>Lose { stats.lose } games.</TextVibe>
	// <TextVibe style={ styles.menuStat }>Draw { stats.draw } games.</TextVibe>
	// <TextVibe style={ styles.menuStat }>Stalemate { stats.stalemate } games.</TextVibe>
	// <TextVibe style={ styles.menuStat }>Resign { stats.draw } games.</TextVibe>
	// <TextVibe style={ styles.menuStat }>Ongoing { stats.ongoing } games.</TextVibe>

	return (
		<Animated.View style={ [styles.menu, { transform: [{ scale: zoomIn }] }] }>
			<AutoHeightImage
				style={ styles.menuImage }
				width={ vw(25) }
				source={ user.photo ? { uri: user.photo + '=c' } : new_match_img }/>
			<TextVibe style={ styles.menuText }>{ user.name || '' }</TextVibe>

			<ScrollView contentContainerStyle={ styles.pageList }>
				<ButtonVibe style={ styles.pageItem }>
					<Image source={ IMAGE.DRAW } style={ styles.logoutBtnIcon }/>
					<TextVibe style={ styles.logoutBtnText }>Play Chess</TextVibe>
				</ButtonVibe>
				<ButtonVibe style={ styles.pageItem }>
					<Image source={ IMAGE.HISTORY } style={ styles.logoutBtnIcon }/>
					<TextVibe style={ styles.logoutBtnText }>Match History</TextVibe>
				</ButtonVibe>
				<ButtonVibe style={ styles.pageItem }>
					<Image source={ IMAGE.FRIENDS } style={ styles.logoutBtnIcon }/>
					<TextVibe style={ styles.logoutBtnText }>Friends</TextVibe>
				</ButtonVibe>
				<ButtonVibe style={ styles.pageItem }>
					<Image source={ IMAGE.SETTINGS } style={ styles.logoutBtnIcon }/>
					<TextVibe style={ styles.logoutBtnText }>Settings</TextVibe>
				</ButtonVibe>
			</ScrollView>

			<ButtonVibe style={ styles.logoutBtn } onPress={ onLogout }>
				<Image source={ IMAGE.LOGOUT } style={ styles.logoutBtnIcon }/>
				<TextVibe style={ styles.logoutBtnText }>Logout</TextVibe>
			</ButtonVibe>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	menu: {
		flex: 1,
		backgroundColor: '#0d151f',
		// alignItems: 'center',
	},
	menuText: {
		color: 'white',
		fontSize: vw(7),
		// textAlign: 'center',
		marginLeft: vw(5),
	},

	menuImage: {
		marginTop: vw(5),
		marginBottom: vw(3),
		borderRadius: borderRadius,
		marginLeft: vw(5),
	},

	menuStat: {
		color: 'white',
		fontSize: vw(5),
	},

	pageList: {
		marginLeft: vw(5),
		marginTop: vw(10),
	},

		pageItem: {
			color: 'white',
			fontSize: vw(5),
			paddingVertical: vw(2.5),
			width: '100%',
			flexDirection: 'row',
			justifyContent: 'flex-start',
		},

	logoutBtn: {
		marginTop: vw(5),
		padding: vw(5),
		width: '100%',
		bottom: 0,
		position: 'absolute',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},

		logoutBtnIcon: {
			width: vw(8),
			height: vw(8),
			marginRight: vw(2),
		},

		logoutBtnText: {
			fontSize: vw(5),
			textAlign: 'center',
			color: 'white',
			textAlign: 'left',
		},
});