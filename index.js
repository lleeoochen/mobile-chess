import React from 'react';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

AppRegistry.registerComponent(appName, () => App);


// IOS & Android Push Notification Handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
	console.log('Message handled in the background!', remoteMessage);
});

function HeadlessCheck({ isHeadless }) {
	if (isHeadless) {
		// App has been launched in the background by iOS, ignore
		return null;
	}
	return <App />;
}

AppRegistry.registerComponent('app', () => HeadlessCheck);
