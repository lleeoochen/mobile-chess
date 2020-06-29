import React, { useRef, useState, useEffect } from 'react';
import { Animated, View, Text, Button, StyleSheet, StatusBar } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';

const FadeInView = (props) => {
	const fadeAnim = useRef(new Animated.Value(0)).current;

	React.useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 1000,
			useNativeDriver: true
		}).start();
	}, [])

	return (
		<Animated.View
			style={{
				...props.style,
				opacity: fadeAnim,
			}}>
			{props.children}
		</Animated.View>
	);
}

EntryScreen.navigationOptions = ({navigation}) => {
	return {
		headerShown: false
	};
};

export default function EntryScreen(props) {
	// Webhooks
	const [signingin, setSigningin] = useState(false);
	const [user, setUser] = useState();

	// Signin configs
	GoogleSignin.configure({
		webClientId: '364782423342-ieled6vsqf8no3bp5ce33fr6bf7rd3k9.apps.googleusercontent.com',
	});

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
		let result = await request('POST', '/login', { auth_token: auth_token });

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

	// Component did mount
	useEffect(() => {
		// Handle user state changes
		auth().onAuthStateChanged(async (user) => {
			setUser(user);
			if (user) {
				navigateHome();
			}
		});
	}, []);

	if (props.navigation.getParam('signout')) {
		signOut();
	}

	if (!user) {
		return (
			<View style={styles.screen}>
				<StatusBar hidden={ true }/>
				<Text style={styles.title}>Chess Vibe</Text>
				<FadeInView style={styles.googleBtnWrap}>
					<GoogleSigninButton
						style={styles.googleBtn}
						size={GoogleSigninButton.Size.Wide}
						color={GoogleSigninButton.Color.Dark}
						onPress={() => signIn()}
						disabled={signingin}/>
				</FadeInView>
			</View>
		);
	}

	return (
		<View style={styles.screen}>
			<StatusBar hidden={ true }/>
			<Text style={styles.title}>Chess Vibe</Text>
			{/*<Button
				title="Go to home."
				onPress={() => navigateHome()}/>*/}
		</View>
	);
}

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


function request(method, url, body) {
	return new Promise(async (resolve, reject) => {
		let time_start = new Date().getTime();

		const response = await fetch('http://10.0.0.59:8000' + url, {
			method: method,
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body)
		});

		let result = await response.json();
		resolve(result);
	});
}
