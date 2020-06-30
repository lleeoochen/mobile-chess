import * as React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default WebVibe = React.forwardRef((props, ref) => {
	return (
		<WebView
			ref={ ref }
			source={ { uri: props.url } }
			style={ {...styles.view, ...props.style} }
			injectedJavaScript={ props.script }
			javaScriptEnabledAndroid={ true }
			allowsBackForwardNavigationGestures={ false }
			userAgent="Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"
			onMessage={ (e) => props.onMessage ? props.onMessage(e) : true }/>
	);
});

const styles = StyleSheet.create({
	view: {
		alignSelf: 'stretch',
		flex: 1,
		backgroundColor: 'black'
	}
});
