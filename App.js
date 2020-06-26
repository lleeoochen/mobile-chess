import * as React from 'react';
import { StatusBar, View } from 'react-native';
import { WebView } from 'react-native-webview';
import CONST from './src/Constant.js';

export default class App extends React.Component {

	onMessage(event) {
		console.log(event.nativeEvent.data);
	}

	render() {
		const runFirst = `
			document.body.style.backgroundColor = 'red';
			setTimeout(function() { window.alert('hi') }, 2000);
			window.ReactNativeWebView.postMessage("Hello!")
			true; // note: this is required, or you'll sometimes get silent failures
		`;

		return (
			<View style={{ flex: 1 }}>
				<StatusBar hidden={true} />
				<WebView
					ref={(r) => (this.webref = r)}
					source={{ uri: CONST.HOSTNAME }}
					style={{ flex: 1 }}
					allowsBackForwardNavigationGestures={true}
					userAgent="Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"
					injectedJavaScript={runFirst}
					onMessage={this.onMessage}/>
			</View>
		);
	}
}
