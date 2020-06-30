import * as React from 'react';
import { StatusBar, View, SafeAreaView, Text, Image, StyleSheet } from 'react-native';
import { WebVibe, ActionBar } from 'chessvibe/src/widgets';
import { URL } from '../Const';

var back_img = require('chessvibe/assets/back.png');
var theme_img = require('chessvibe/assets/palette.png');

// Navigation
GameScreen.navigationOptions = ({ navigation }) => {
	const { params = {} } = navigation.state;
	return ActionBar('Match', back_img, params.goBack, theme_img, params.changeTheme);
};

// Game Screen
export default function GameScreen(props) {
	let webref = React.useRef(null);

	// Mount
	React.useEffect(() => {
		props.navigation.setParams({
			goBack: () => {
				props.navigation.goBack()
			},
			changeTheme: () => {
				const injected = `
					onThemeClick();
					true;
				`;
				webref.current.injectJavaScript(injected);
			},
		});
	}, []);

	// Render
	let match = props.navigation.getParam('match');

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<StatusBar hidden={ true }/>
			<WebVibe
				ref={ webref }
				url={ URL.FRONTEND + '/game_mobile?match=' + match + '&no_action_bar=1' }/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
});
