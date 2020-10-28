import * as React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Entry from '../screens/EntryScreen';
import { vw } from '../Util';

export default function LoginNavigator({setNavStack}) {
	const LoginContainer = getLoginContainer();

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
			<StatusBar hidden={ true }/>
			<LoginContainer
				screenProps={{
					setNavStack,
				}}/>
		</SafeAreaView>
	);
}

// Login Navigation
function getLoginContainer() {
	const LoginNavigator = createStackNavigator(
		{
			Entry: { screen: Entry },
		},
		{
			initialRouteName: 'Entry',
			defaultNavigationOptions: {
				headerStyle: {
					backgroundColor: 'black',
					shadowColor: 'black',
					shadowRadius: vw(0.5),
					elevation: 2,
					height: vw(15),
				},
				headerTintColor: 'white',
				headerTitleStyle: {
					fontWeight: 'bold',
				},
				gestureEnabled: false,
			},
		}
	);
	return createAppContainer(LoginNavigator);
}
