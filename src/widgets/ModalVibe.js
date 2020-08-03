import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View, Animated, SafeAreaView } from 'react-native';
import Modal from 'react-native-modal';
import { vw, vh } from '../Util';
import { APP_THEME } from '../Const';
import Store from 'chessvibe/src/redux/Store';
import { useSelector } from 'react-redux';
import { TouchableWithoutFeedback as RNGHTouchableWithoutFeedback } from "react-native-gesture-handler";

export default function ModalVibe(props) {
	const { isVisible=false, style={}, coverAll=false, onDismiss=() => {} } = props;
	const wantVisible = isVisible;
	const duration = 200;

	const isDarkTheme = useSelector(state => state.isDarkTheme);
	const appTheme = isDarkTheme ? APP_THEME.DARK : APP_THEME.LIGHT;
	const [ top ] = React.useState(new Animated.Value(vh(100)));
	const [ shadowIndex ] = React.useState(new Animated.Value(0));
	const [ modalVisible, setModalVisible ] = React.useState(wantVisible);

	// Theme configuration
	let menuStyle = [styles.menu, {
		backgroundColor: appTheme.CONTENT_BACKGROUND,
		borderColor: appTheme.MENU_BACKGROUND,
	}];

	React.useEffect(() => {
		if (wantVisible && !modalVisible) {
			setModalVisible(true);
		}
	},
	[wantVisible]);


	// Render default modal if requested
	if (coverAll) {
		return (
			<Modal
				isVisible={ props.isVisible || false }
				// animationIn={'fadeIn'}
				// animationOut={'fadeOut'}
				animationInTiming={ duration }
				animationOutTiming={ duration }
				backdropTransitionInTiming={ duration }
				backdropTransitionOutTiming={ duration }
				activeOpacity={ 0 }
				hideModalContentWhileAnimating={ true }
				backdropTransitionOutTiming={ 0 }
				onModalHide={ props.onModalHide }
				style={ styles.modal }>
				<TouchableWithoutFeedback onPress={ onDismiss }>
					<View style={ styles.menuOutside }></View>
				</TouchableWithoutFeedback>
				<View style={ menuStyle }>
					{ props.children }
				</View>
			</Modal>
		);
	}

	// Animate when visible
	if (modalVisible) {

		if (wantVisible) {
			// Start animation when modal is getting visible
			Animated.timing(top, {
			    toValue: 0,
			    duration,
			    useNativeDriver: true,
			})
			.start();

			Animated.timing(shadowIndex, {
				toValue: 0.8,
			    duration,
				useNativeDriver: true,
			})
			.start();
		}
		else {
			Animated.timing(top, {
			    toValue: vh(100),
			    duration,
			    useNativeDriver: true,
			})
			.start(() => {
				// Set modal to invisible after animation is done
				setModalVisible(false);
			});

			Animated.timing(shadowIndex, {
				toValue: 0,
			    duration,
				useNativeDriver: true,
			})
			.start();
		}
	}

	let ButtonClass = Platform.OS === 'android' ? RNGHTouchableWithoutFeedback : TouchableWithoutFeedback;
	return (
		<SafeAreaView style={ [styles.full, { display: wantVisible || modalVisible ? 'flex' : 'none' }] }>
			<Animated.View style={ [styles.full, style, { backgroundColor: 'black', opacity: shadowIndex }] }/>
			<Animated.View style={ [styles.full, style, { transform: [{ translateY: top }] }] }>
				<View style={ styles.menuWrap }>
					<ButtonClass onPress={ onDismiss }>
						<View style={ styles.menuOutside }></View>
					</ButtonClass>
					<View style={ menuStyle }>
						{ props.children }
					</View>
				</View>
			</Animated.View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		margin: 0,
		alignItems: 'center',
		justifyContent: 'center',
	},

	full: {
		...StyleSheet.absoluteFillObject,
		zIndex: 100,
	},

	menuWrap: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: '100%',
	},

		menuOutside: {
			flex: 1,
			width: vw(100),
			height: vh(100),
		},

		menu: {
			position: 'absolute',
			padding: '3%',
			backgroundColor: '#1a283a',
			borderStyle: 'solid',
			borderColor: '#0d151f',
			borderWidth: vw(),
			borderRadius: vw(),
			width: '90%',
			zIndex: 100,
		},
});


// import * as React from 'react';
// import { StyleSheet, TouchableWithoutFeedback, View, Modal } from 'react-native';
// // import Modal from 'react-native-modal';
// import { vw, wh } from '../Util';
// import { APP_THEME } from '../Const';
// import Store from 'chessvibe/src/redux/Store';
// import { useSelector } from 'react-redux';

// export default function ModalVibe(props) {
// 	const isDarkTheme = useSelector(state => state.isDarkTheme);
// 	const appTheme = isDarkTheme ? APP_THEME.DARK : APP_THEME.LIGHT;

// 	// Theme configuration
// 	let menuStyle = [styles.menu, {
// 		backgroundColor: appTheme.CONTENT_BACKGROUND,
// 		borderColor: appTheme.MENU_BACKGROUND,
// 	}];

// 	return (
// 		<Modal
// 			visible={ props.isVisible || false }
// 			transparent={true}
// 			animationType={'slide'}
// 			onDismiss={ props.onModalHide }
// 			statusBarTranslucent={true}
// 			style={ styles.modal }>
// 			<View style={ styles.menuWrap }>
// 				<TouchableWithoutFeedback onPress={ props.onDismiss }>
// 					<View style={ styles.menuOutside }></View>
// 				</TouchableWithoutFeedback>
// 				<View style={ menuStyle }>
// 					{ props.children }
// 				</View>
// 			</View>
// 		</Modal>
// 	);

// 	// return (
// 	// 	<Modal
// 	// 		isVisible={ props.isVisible || false }
// 	// 		// animationIn={'fadeIn'}
// 	// 		// animationOut={'fadeOut'}
// 	// 		animationInTiming={100}
// 	// 		animationOutTiming={100}
// 	// 		backdropTransitionInTiming={100}
// 	// 		backdropTransitionOutTiming={100}
// 	// 		activeOpacity={ 0 }
// 	// 		hideModalContentWhileAnimating={ true }
// 	// 		backdropTransitionOutTiming={ 0 }
// 	// 		onModalHide={ props.onModalHide }
// 	// 		style={ styles.modal }>
// 	// 		<TouchableWithoutFeedback onPress={ props.onDismiss }>
// 	// 			<View style={ styles.menuOutside }></View>
// 	// 		</TouchableWithoutFeedback>
// 	// 		<View style={ menuStyle }>
// 	// 			{ props.children }
// 	// 		</View>
// 	// 	</Modal>
// 	// );
// }

// const styles = StyleSheet.create({
// 	modal: {
// 		flex: 1,
// 		margin: 0,
// 		alignItems: 'center',
// 		justifyContent: 'center',
// 	},

// 	menuWrap: {
// 		flex: 1,
// 		justifyContent: "center",
// 		alignItems: "center",
// 	},

// 		menuOutside: {
// 			flex: 1,
// 			position: 'absolute',
// 			width: '100%',
// 			height: '100%',
// 		},

// 		menu: {
// 			padding: '3%',
// 			backgroundColor: '#1a283a',
// 			borderStyle: 'solid',
// 			borderColor: '#0d151f',
// 			borderWidth: vw(),
// 			borderRadius: vw(),
// 			width: '90%',
// 			zIndex: 100,
// 		},
// });