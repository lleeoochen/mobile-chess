import * as React from 'react';
import { View, SafeAreaView, Text, Button, StyleSheet, StatusBar, Image, Dimensions } from 'react-native';
import { FadeInView, TextVibe } from 'chessvibe/src/widgets';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import { URL, STORAGE_IS_DARK_THEME } from '../Const';
import Util, { vw, vh } from '../Util';
import Cache, { CACHE_DEFAULT } from '../Cache';

import Storage from 'chessvibe/src/Storage';
import Store from 'chessvibe/src/redux/Store';
import { setIsDarkTheme } from 'chessvibe/src/redux/Reducer';

let logoImg = require('chessvibe/assets/logo.jpg');

// Navigation
EntryScreen.navigationOptions = ({navigation}) => {
	return {
		headerShown: false
	};
};

// Entry Screen
export default function EntryScreen(props) {
	const [initializing, setInitializing] = React.useState(true);
	const [signingin, setSigningin] = React.useState(false);
	const [user, setUser] = React.useState();


	// Signin configs
	GoogleSignin.configure({
		webClientId: '364782423342-ieled6vsqf8no3bp5ce33fr6bf7rd3k9.apps.googleusercontent.com',
		iosClientId: '364782423342-5gdd9i071pha4sjao8htllghr2l08j2e.apps.googleusercontent.com',
		loginHint: '',
	});


	// Mount
	React.useEffect(() => {
		// Handle user state changes
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber;
	}, []);


	function onAuthStateChanged(user) {
		setUser(user);

		if (initializing) {
			setInitializing(false);
		}

		if (user) {
			navigateHome(user);
		}
	}

	// Signin
	async function signIn() {
		setSigningin(true);

		try {
			let { idToken } = await GoogleSignin.signIn();
			let gCredential = auth.GoogleAuthProvider.credential(idToken);

			let res = await auth().signInWithCredential(gCredential);
		}
		catch (error) {
			console.log(error);
		}
		setSigningin(false);
	}

	// Signout
	async function signOut() {
		try {
			await GoogleSignin.signOut();
			await auth().signOut();
			Object.assign(Cache, JSON.parse(JSON.stringify(CACHE_DEFAULT)));
			Storage.clear();
		}
		catch (error) {
			console.log(error);
		}
		setUser(null);
	}

	// Navigate to home
	async function navigateHome(user) {
		Store.dispatch(setIsDarkTheme( await Storage.get(STORAGE_IS_DARK_THEME) == 'true' ));

		let auth_token = await auth().currentUser.getIdToken(true);

		// Login with firebase token
		let result = await Util.request('POST', URL.BACKEND + '/login', { auth_token: auth_token });

		if (result.session_token) {
			Cache.sessionToken = result.session_token;
			Cache.userID = auth().currentUser.uid;
			props.navigation.navigate('Home');
		}
		else {
			signOut();
		}
	}


	// Render
	if (props.navigation.getParam('signout')) {
		props.navigation.setParams({ 'signout': null });
		signOut();
	}

	if (initializing) return null;

	if (!user) {
		return (
			<SafeAreaView style={ styles.screen }>
				<StatusBar hidden={ true }/>

				<TextVibe style={ styles.title }>Chess Vibe</TextVibe>
				<Image style={ styles.logo } source={ logoImg }/>

				<FadeInView style={ styles.googleBtnWrap }>
					<GoogleSigninButton
						style={ styles.googleBtn }
						size={ GoogleSigninButton.Size.Wide }
						color={ GoogleSigninButton.Color.Dark }
						onPress={ () => signIn() }
						disabled={ signingin }/>
				</FadeInView>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={ styles.screen }>
			<StatusBar hidden={ true }/>

			<TextVibe style={ styles.title }>Chess Vibe</TextVibe>
			<Image style={ styles.logo } source={ logoImg }/>
		</SafeAreaView>
	);
}

const logoSize = vw(50);
const styles = StyleSheet.create({
	screen: {
		flex: 1,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: 'black',
	},
	title: {
		color: 'white',
		fontSize: 50,
		position: 'absolute',
		top: 50,
	},
	logo: {
		width: logoSize,
		height: logoSize
	},
	googleBtnWrap: {
		// width: '50%',
		height: 50,
		position: 'absolute',
		bottom: 0,
		marginTop: 50,
		marginBottom: 50,
	},
	googleBtn: {
		// width: '100%',
	}
});
