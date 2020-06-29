import React, { Component, Fragment } from "react";
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button, Image,} from 'react-native';
import { Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions,} from 'react-native/Libraries/NewAppScreen';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';

export default class LoginController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pushData: [],
      loggedIn: false
    }
  }
  componentDidMount() {
    GoogleSignin.configure({
      webClientId: '364782423342-ieled6vsqf8no3bp5ce33fr6bf7rd3k9.apps.googleusercontent.com', 
      offlineAccess: true, 
      hostedDomain: '', 
      forceConsentPrompt: true, 
    });
  }

  _signIn = async () => {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo: userInfo, loggedIn: true });
  };

  getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      this.setState({ userInfo });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // user has not signed in yet
        this.setState({ loggedIn: false });
      } else {
        // some other error
        this.setState({ loggedIn: false });
      }
    }
  };

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({ user: null, loggedIn: false }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <GoogleSigninButton
                  style={{ width: 192, height: 48 }}
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Dark}
                  onPress={this._signIn}
                  disabled={this.state.isSigninInProgress} />
              </View>
              <View style={styles.buttonContainer}>
                {!this.state.loggedIn && <Text>You are currently logged out</Text>}
                {this.state.loggedIn && <Button onPress={this.signOut}
                  title="Signout"
                  color="#841584">
                </Button>}
              </View>

              {!this.state.loggedIn && <LearnMoreLinks />}
              {this.state.loggedIn && <View>
                <View style={styles.listHeader}>
                  <Text>User Info</Text>
                </View>
                <View style={styles.dp}>
                  <Image
                    style={{ width: 100, height: 100 }}
                    source={{ uri: this.state.userInfo && this.state.userInfo.user && this.state.userInfo.user.photo }}
                  />
                </View>
                <View style={styles.detailContainer}>
                  <Text style={styles.title}>Name</Text>
                  <Text style={styles.message}>{this.state.userInfo && this.state.userInfo.user && this.state.userInfo.user.name}</Text>
                </View>
                <View style={styles.detailContainer}>
                  <Text style={styles.title}>Email</Text>
                  <Text style={styles.message}>{this.state.userInfo && this.state.userInfo.user && this.state.userInfo.user.email}</Text>
                </View>
                <View style={styles.detailContainer}>
                  <Text style={styles.title}>ID</Text>
                  <Text style={styles.message}>{this.state.userInfo && this.state.userInfo.user && this.state.userInfo.user.id}</Text>
                </View>
              </View>}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  listHeader: {
    backgroundColor: '#eee',
    color: "#222",
    height: 44,
    padding: 12
  },
  detailContainer: {
    paddingHorizontal: 20
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 10
  },
  message: {
    fontSize: 14,
    paddingBottom: 15,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1
  },
  dp:{
    marginTop: 32,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});


// import React, { useState, useEffect } from 'react';
// import { View, Text, Button } from 'react-native';
// import auth from '@react-native-firebase/auth';
// import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';

// export default function Entry() {
// 	// Set an initializing state whilst Firebase connects
// 	const [initializing, setInitializing] = useState(true);
// 	const [user, setUser] = useState();


// 	// GoogleSignin.configure({
// 	// 	androidClientId: '364782423342-ieled6vsqf8no3bp5ce33fr6bf7rd3k9.apps.googleusercontent.com',
// 	// });


// 	GoogleSignin.configure({
// 		scopes: ['https://www.googleapis.com/auth/drive.readonly'],
// 		webClientId: '364782423342-ieled6vsqf8no3bp5ce33fr6bf7rd3k9.apps.googleusercontent.com', 
// 		offlineAccess: true, 
// 		hostedDomain: '', 
// 		loginHint: '', 
// 		forceConsentPrompt: true, 
// 		accountName: '',
// 	});


// 	// Handle user state changes
// 	function onAuthStateChanged(user) {
// 		console.log("hi");
// 		setUser(user);
// 		if (initializing) setInitializing(false);
// 	}

// 	async function onGoogleButtonPress() {
// 		try {
// 			await GoogleSignin.hasPlayServices();
// 			const userInfo = await GoogleSignin.signIn();
// 			this.setState({ userInfo: userInfo, loggedIn: true });
// 		}
// 		catch (error) {
// 			if (error.code === statusCodes.SIGN_IN_CANCELLED) {
// 				console.log('user cancelled the login flow');
// 			} else if (error.code === statusCodes.IN_PROGRESS) {
// 				console.log('operation (f.e. sign in) is in progress already');
// 			} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
// 				console.log('play services not available or outdated');
// 			} else {
// 				console.log('some other error happened');
// 			}
// 		}


// 		// // Get the users ID token
// 		// const { idToken } = await GoogleSignin.signIn();

// 		// // Create a Google credential with the token
// 		// const googleCredential = auth.GoogleAuthProvider.credential(idToken);

// 		// // Sign-in the user with the credential
// 		// return auth().signInWithCredential(googleCredential);
// 	}


// 	useEffect(() => {
// 		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
// 		return subscriber; // unsubscribe on unmount
// 	}, []);

// 	if (initializing) return null;

// 	if (!user) {
// 		return (
// 			<Button
// 				title="Google Sign-In"
// 				onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
// 		    />
// 		);
// 	}

// 	return (
// 		<View>
// 			<Text>Welcome {user.email}</Text>
// 		</View>
// 	);
// }