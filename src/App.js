import * as React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from './Home';
import Game from './Game';

const Navigator = createStackNavigator(
	{
		Home: { screen: Home },
		Game: { screen: Game },
	},
	{

		initialRouteName: 'Home',
		/* The header config from HomeScreen is now here */
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
