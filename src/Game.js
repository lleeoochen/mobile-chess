import * as React from 'react';
import { StatusBar, View, Text, Image, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import CONST from './Constant.js';
import ActionBar from './widgets/ActionBar';

var back_img = require('chessvibe/assets/back.png');
var theme_img = require('chessvibe/assets/palette.png');

export default class Game extends React.Component {

	static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
		return ActionBar('Match', back_img, params.goBack, theme_img, params.changeTheme);
	};

	componentDidMount() {
		this.props.navigation.setParams({
			goBack: () => {
				this.props.navigation.goBack()
			},
			changeTheme: () => {
				const injected = `
					onThemeClick();
					true;
				`;
				this.webref.injectJavaScript(injected);
			},
		});
	}

	render() {
		let { navigation } = this.props;
		let match = navigation.getParam('match');

		return (
			<View style={{ flex: 1 }}>
				<StatusBar hidden={ true }/>
				<WebView
					ref={(ref) => (this.webref = ref)}
					source={{ uri: CONST.HOSTNAME + '/game_mobile?match=' + match + '&no_action_bar=1' }}
					style={styles.view}
					allowsBackForwardNavigationGestures={false}
					userAgent="Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	view: {
		alignSelf: 'stretch',
		flex: 1,
	}
});
