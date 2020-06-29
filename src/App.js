import * as React from 'react';
import { View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Entry from './EntryScreen';
import Home from './HomeScreen';
import Game from './GameScreen';

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
			},
			headerTintColor: 'white',
			headerTitleStyle: {
				fontWeight: 'bold',
			},
		},
	}
);

export default createAppContainer(Navigator);
// const Container = createAppContainer(Navigator);


// export default class App extends React.Component {
// 	render() {
// 		return (
// 			<Container>

// 			</Container>
// 		);
// 	}
// }
