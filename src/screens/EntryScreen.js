import * as React from 'react';
import { View, Text, Button, StyleSheet, StatusBar, Image, Dimensions } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import { URL } from '../Constants';
import Util, { vw, vh } from '../Utilities';
import FadeInView from '../widgets/FadeInView';

let logoImg = require('chessvibe/assets/logo.jpg');

// Navigation
EntryScreen.navigationOptions = ({navigation}) => {
	return {
		headerShown: false
	};
};

// Entry Screen
export default function EntryScreen(props) {
	const [signingin, setSigningin] = React.useState(false);
	const [user, setUser] = React.useState();

	// Signin configs
	GoogleSignin.configure({
		webClientId: '364782423342-ieled6vsqf8no3bp5ce33fr6bf7rd3k9.apps.googleusercontent.com',
	});


	// Mount
	React.useEffect(() => {
		// Handle user state changes
		auth().onAuthStateChanged(async (user) => {
			setUser(user);
			if (user) {
				navigateHome();
			}
		});
	}, []);


	// Signin
	async function signIn() {
		setSigningin(true);

		try {
			let { idToken } = await GoogleSignin.signIn();
			let gCredential = auth.GoogleAuthProvider.credential(idToken);

			await auth().signInWithCredential(gCredential);
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
		}
		catch (error) {
			console.log(error);
		}
		setUser(null);
	}

	// Navigate to home
	async function navigateHome() {
		let auth_token = await auth().currentUser.getIdToken(true);

		// Login with firebase token
		let result = await Util.request('POST', URL.BACKEND + '/login', { auth_token: auth_token });

		if (result.session_token) {

			// Go to home screen
			props.navigation.navigate('Home', {
				session_token: result.session_token
			});
		}
		else {
			signOut();
		}
	}


	// Render
	if (props.navigation.getParam('signout')) {
		return signOut();
	}

	if (!user) {
		return (
			<View style={ styles.screen }>
				<StatusBar hidden={ true }/>

				<Text style={ styles.title }>Chess Vibe</Text>
				<Image style={ styles.logo } source={ logoImg }/>

				<FadeInView style={ styles.googleBtnWrap }>
					<GoogleSigninButton
						style={ styles.googleBtn }
						size={ GoogleSigninButton.Size.Wide }
						color={ GoogleSigninButton.Color.Dark }
						onPress={ () => signIn() }
						disabled={ signingin }/>
				</FadeInView>
			</View>
		);
	}

	return (
		<View style={ styles.screen }>
			<StatusBar hidden={ true }/>

			<Text style={ styles.title }>Chess Vibe</Text>
			<Image style={ styles.logo } source={ logoImg }/>
			{/*<Button
				title="Go to home."
				onPress={ () => navigateHome() }/>*/}
		</View>
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
		fontFamily: 'Spectral, serif',
		fontSize: 50,
		position: 'absolute',
		top: 50,
	},
	logo: {
		width: logoSize,
		height: logoSize
	},
	googleBtnWrap: {
		width: '80%',
		height: 50,
		position: 'absolute',
		bottom: 0,
		marginTop: 50,
		marginBottom: 50,
	},
	googleBtn: {
		width: '100%',
	}
});
