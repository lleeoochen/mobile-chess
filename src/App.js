import * as React from 'react';
import { View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Entry from './screens/EntryScreen';
import Home from './screens/HomeScreen';
import Game from './screens/GameScreen';

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
				shadowRadius: 2,
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
