import * as React from 'react';
import { Animated, View, SafeAreaView } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider, useSelector } from 'react-redux';

import Entry from './screens/EntryScreen';
import Home from './screens/HomeScreen';
import Game from './screens/GameScreen';
import { vw } from './Util';
import store from './redux/Store';

import SideMenu from 'react-native-side-menu'
import HomeUserMenu from './screens/HomeScreen/HomeUserMenu';
import { showDrawer } from 'chessvibe/src/redux/Reducer';
import Store from 'chessvibe/src/redux/Store';

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

// export default createAppContainer(Navigator);
const Container = createAppContainer(Navigator);


const userMenu = (navRef, drawerOpen, openDrawer) => {
	return (<HomeUserMenu visible={ true } navRef={ navRef } drawerOpen={ drawerOpen } openDrawer={ openDrawer }/>);
};

function AppContent() {
	const [ drawerOpen, openDrawer ] = React.useState(false);
	const navRef = React.useRef(null);

	function onDrawerChange() {
		if (drawerOpen)
			openDrawer(false);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#0d151f' }}>
			<SideMenu
				menu={ userMenu(navRef, drawerOpen, openDrawer) }
				openMenuOffset={ vw(70) }
				onChange={() => onDrawerChange()}
				disableGestures={ true }
				bounceBackOnOverdraw={ false }
				animationFunction={(prop, value) => Animated.timing(prop, {
					toValue: value,
					duration: 200,
					useNativeDriver: true,
				})}
				isOpen={ drawerOpen }>
				<Container ref={navRef} screenProps={{ openDrawer }}/>
			</SideMenu>
		</SafeAreaView>
	);
}

export default function App() {
	return (
		<Provider store={store} style={ {backgroundColor: 'black'} }>
			<AppContent/>
		</Provider>
	);
}

