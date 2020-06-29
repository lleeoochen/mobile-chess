import * as React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { URL } from '../Constants';
import ActionBar from '../widgets/ActionBar';

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
	let sessionToken = props.navigation.getParam('session_token');
	let sessionScript = `
		setStorage('session_token', '${ sessionToken }');
		main();
		true;
	`;

	return (
		<View style={{ flex: 1 }}>
			<StatusBar hidden={ true }/>
			<WebView
				ref={ webref }
				source={{ uri: URL.FRONTEND + '/mobile?no_action_bar=1' }}
				style={ styles.view }
				injectedJavaScript={ sessionScript }
				javaScriptEnabledAndroid={ true }
				allowsBackForwardNavigationGestures={ false }
				userAgent="Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"
				onMessage={ (e) => onMessage(e) }/>
		</View>
	);
}

const styles = StyleSheet.create({
	view: {
		alignSelf: 'stretch',
		flex: 1,
	}
});
