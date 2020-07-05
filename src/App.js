import * as React from 'react';
import { View, SafeAreaView } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from 'react-redux';

import Entry from './screens/EntryScreen';
import Home from './screens/HomeScreen';
import Game from './screens/GameScreen';
import { vw } from './Util';
import store from './redux/Store';

// Navigation
const Navigator = createStackNavigator(
	{
		Entry: { screen: Entry },
		Home: { screen: Home },
		Game: { screen: Game },
	},
	{
		initialRouteName: 'Entry',
		defaultNavigationOptions: {
			headerStyle: {
				backgroundColor: 'black',
				shadowColor: 'black',
				shadowRadius: vw(),
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

// export default createAppContainer(Navigator);
const Container = createAppContainer(Navigator);


export default class App extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
				<Container/>
				</SafeAreaView>
			</Provider>
		);
	}
}
