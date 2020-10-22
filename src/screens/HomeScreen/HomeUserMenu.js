import * as React from 'react';
import { ScrollView, StyleSheet, Image, Animated } from 'react-native';
import { TextVibe, ButtonVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import { vw, formatImage } from 'chessvibe/src/Util';
import { useSelector } from 'react-redux';
import { IMAGE, APP_THEME } from 'chessvibe/src/Const';
import { HomeStore, PopupStore } from 'chessvibe/src/redux/Store';

const borderRadius = vw();

export default function HomeUserMenu(props) {
	const isDarkTheme = useSelector(state => state.home.isDarkTheme);
	const user = useSelector(state => state.home.user) || {};
	const [ zoomIn ] = React.useState(new Animated.Value(props.drawerOpen ? 0.8 : 1));
	const [ selected, setSelected ] = React.useState(0);
	const appTheme = isDarkTheme ? APP_THEME.DARK : APP_THEME.LIGHT;

	let {
		onLogout=() => {

			HomeStore.toLogout(true);
			setSelected(0);
		},
	} = props;

	React.useEffect(() => {
		Animated.timing(zoomIn, {
			toValue: props.drawerOpen ? 1 : 0.8,
			duration: 200,
			useNativeDriver: true,
		}).start();
	}, [props.drawerOpen]);

	function navigateHome(tab) {
		if (props.navRef && props.navRef.current && props.navRef.current._navigation) {
			props.openDrawer(false);
			props.navRef.current._navigation.navigate('Home', { tab });
		}
	}

	// Theme configuration
	let menuStyle = [styles.menu, { transform: [{ scale: zoomIn }] }, {
		backgroundColor: appTheme.MENU_BACKGROUND
	}];

	let textColor = {
		color: appTheme.COLOR
	};

	let selectedStyle = {
		backgroundColor: appTheme.CONTENT_BACKGROUND,
		shadowOffset: {
			height: 0,
		},
		shadowColor: 'black',
		shadowOpacity: 0.2,
		shadowRadius: vw(0.5),
		elevation: 2,
	};



	const configs = [
		{
			tab: 'play',
			image: 'DRAW',
			text: 'Play Chess',
		},
		{
			tab: 'history',
			image: 'HISTORY',
			text: 'Match History',
		},
		{
			tab: 'friends',
			image: 'FRIENDS',
			text: 'Friends',
		},
		{
			tab: 'settings',
			image: 'SETTINGS',
			text: 'Settings',
		},
	];

	let buttons = configs.map((config, index) => {
		let { tab, image, text } = config;
		let style = selected == index ? selectedStyle : {};

		return (
			<ButtonVibe
				key={ index }
				style={ [styles.pageItem, style] }
				onPress={ () => {
					setSelected(index);
					navigateHome(tab);
				} }>
				<Image source={ IMAGE[image + (isDarkTheme ? '' : '_DARK')] } style={ styles.logoutBtnIcon }/>
				<TextVibe style={ [styles.logoutBtnText, textColor] }>{ text }</TextVibe>
			</ButtonVibe>
		);
	});


	return (
		<Animated.View style={ menuStyle }>
			<ButtonVibe style={ styles.profile } onPress={ () => PopupStore.openProfile(user) }>
				<AutoHeightImage
					style={ styles.menuImage }
					width={ vw(25) }
					source={ formatImage(user.photo) }/>
				<TextVibe style={ [styles.menuText, textColor] }>{ user.name || '' }</TextVibe>
			</ButtonVibe>

			<ScrollView contentContainerStyle={ styles.pageList }>
				{ buttons }
			</ScrollView>

			<ButtonVibe style={ styles.logoutBtn } onPress={ onLogout }>
				<Image source={ IMAGE['LOGOUT' + (isDarkTheme ? '' : '_DARK')] } style={ styles.logoutBtnIcon }/>
				<TextVibe style={ [styles.logoutBtnText, textColor] }>Logout</TextVibe>
			</ButtonVibe>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	menu: {
		flex: 1,
	},

	menuText: {
		fontSize: vw(7),
		marginLeft: vw(5),
	},

	menuImage: {
		marginTop: vw(5),
		marginBottom: vw(3),
		borderRadius: borderRadius,
		marginLeft: vw(5),
	},

	profile: {
		alignItems: 'flex-start'
	},

	pageList: {
		marginTop: vw(10),
	},

		pageItem: {
			paddingLeft: vw(5),
			fontSize: vw(5),
			paddingVertical: vw(2.5),
			width: '100%',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			borderRadius: 0,
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
			textAlign: 'left',
		},
});