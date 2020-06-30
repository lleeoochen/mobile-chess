import * as React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { URL } from '../Const';
import ActionBar from '../widgets/ActionBar';
import WebVibe from '../widgets/WebVibe';
import Cache from '../Cache';

var menu_img = require('chessvibe/assets/menu.png');
var new_game_img = require('chessvibe/assets/new-game.png');

// Navigation
HomeScreen.navigationOptions = ({navigation}) => {
	const { params = {} } = navigation.state;
	return ActionBar('ChessVibe', menu_img, params.openMenu, new_game_img, params.openCreate);
};

// Home Screen
export default function HomeScreen(props) {
	const webref = React.useRef(null);

	// Mount
	React.useEffect(() => {
		props.navigation.setParams({
			openMenu: () => {
				const injected = `
					$('#menu-modal').modal('show');
					true;
				`;
				webref.current.injectJavaScript(injected);
			},
			openCreate: () => {
				const injected = `
					$('#new-match-modal').modal('show');
					true;
				`;
				webref.current.injectJavaScript(injected);
			},
		});
	}, []);

	// Message from WebView
	function onMessage(event) {
		let { type, ...data } = JSON.parse(event.nativeEvent.data);
		
		if (type == 'match_click') {
			props.navigation.navigate('Game', data);
		}
		else if (type == 'signout') {
			props.navigation.navigate('Entry', {
				signout: true
			});
		}
	}

	// Render
	let sessionToken = Cache.sessionToken;
	let sessionScript = `
		setStorage('session_token', '${ sessionToken }');
		main();
		true;
	`;

	return (
		<View style={{ flex: 1 }}>
			<StatusBar hidden={ true }/>
			<WebVibe
				ref={ webref }
				url={ URL.FRONTEND + '/mobile?no_action_bar=1' }
				script={ sessionScript }
				onMessage={ onMessage }/>
		</View>
	);
}

const styles = StyleSheet.create({
	view: {
		alignSelf: 'stretch',
		flex: 1,
		backgroundColor: 'black'
	}
});
