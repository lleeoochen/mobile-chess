import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View, Image, ScrollView, Animated } from 'react-native';
import Slider from "react-native-slider";
import { TextVibe, ModalVibe, ButtonVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import { vw, vh } from 'chessvibe/src/Util';
import { THEME_ID, TIME, IMAGE, APP_THEME } from 'chessvibe/src/Const';
import { useSelector } from 'react-redux';

export default function NotificationMenu(props) {
	const { visible, setVisible, isDarkTheme } = props;
	const appTheme = isDarkTheme ? APP_THEME.DARK : APP_THEME.LIGHT;
	const shiftX = new Animated.Value(visible ? vw(80) : 0);
	const [ actualVisible, setActualVisible ]  = React.useState(visible);

	// Set state to prop visible
	React.useEffect(() => {
		if (visible && !actualVisible) {
			setActualVisible(true);
		}
	},
	[visible]);
		console.log(visible, actualVisible);

	// Shift animation
	if (actualVisible) {
		if (visible) {
			Animated.spring(shiftX, {
				toValue: 0,
				speed: 20,
				useNativeDriver: true,
			})
			.start();
		}
		else if (actualVisible) {
			Animated.spring(shiftX, {
				toValue: vw(80),
				speed: 20,
				useNativeDriver: true,
			})
			.start(() => {
				setActualVisible(false);
			});
		}
	}

	// Opacity animation
	let opacity = shiftX.interpolate({
		inputRange: [0, vw(80)],
		outputRange: [1, 0],
	});

	// Custom theme stylings
	let backgroundColor = {
		backgroundColor: appTheme.APP_BACKGROUND
	};

	let notifBackgroundColor = {
		backgroundColor: appTheme.CONTENT_BACKGROUND
	};

	let textColor = {
		color: appTheme.COLOR
	};

	let visibleStyle = {
		display: actualVisible ? 'flex' : 'none',
		opacity,
		transform: [{ translateX: shiftX }],
	};


	return (
		<Animated.View style={ [styles.outerView, visibleStyle] }>
			<TouchableWithoutFeedback onPress={ () => setVisible(false) }>
				<View style={ styles.backView }/>
			</TouchableWithoutFeedback>

			<View style={ [styles.view, backgroundColor] }>
				<TextVibe style={ [styles.title, textColor] }>Notifications</TextVibe>
				<ScrollView>
					<ButtonVibe style={ [styles.notif, notifBackgroundColor] }>
						<TextVibe style={ [styles.notifText, textColor] }>Wei Tung sent you a friend request.</TextVibe>
					</ButtonVibe>
					<ButtonVibe style={ [styles.notif, notifBackgroundColor] }>
						<TextVibe style={ [styles.notifText, textColor] }>Jose has challenged you!</TextVibe>
					</ButtonVibe>
				</ScrollView>
			</View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	outerView: {
		flex: 1,
		width: vw(100),
		height: vh(100),
		position: 'absolute',
		zIndex: 100,
	},

	backView: {
		...StyleSheet.absoluteFillObject,
	},

	view: {
		position: 'absolute',
		backgroundColor: 'black',
		width: '90%',
		alignSelf: 'flex-end',
		top: vw(1),
		right: vw(0.5),
		borderRadius: vw(),
		padding: vw(2),

		height: vh(60),

		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.5,
		shadowRadius: 5,
		elevation: 3,
	},

		title: {
			fontSize: vw(5),
			marginBottom: vw(3),
		},

		notif: {
			borderRadius: vw(),
			marginBottom: vw(),
			padding: vw(2),
			alignItems: 'flex-start',
		},

		notifText: {
			fontSize: vw(5),
		},
});
