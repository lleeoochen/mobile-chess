import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View, Image, ScrollView, Animated } from 'react-native';
import Slider from "react-native-slider";
import { TextVibe, ModalVibe, ButtonVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import { vw, vh } from 'chessvibe/src/Util';
import { THEME_ID, TIME, IMAGE, APP_THEME, NOTIFICATION_TYPE, FRIEND } from 'chessvibe/src/Const';
import { useSelector } from 'react-redux';
import Backend from 'chessvibe/src/GameBackend';

export default function NotificationMenu(props) {
	const { visible, setVisible, isDarkTheme, notificationIDs=[], friends } = props;
	const appTheme = isDarkTheme ? APP_THEME.DARK : APP_THEME.LIGHT;

	const fullShift = vh(-100);
	const [ shiftY ] = React.useState(new Animated.Value(fullShift));
	const [ notificationData, setNotificationData ] = React.useState([]);

	// Passive load on notification data
	React.useEffect(() => {
		async function fetchNotifications(ids) {
			let result = await Backend.getNotificationList(ids);
			setNotificationData(result.data);
		}

		if (notificationIDs.length > 0) {
			fetchNotifications(notificationIDs);
		}

	}, [notificationIDs]);

	// Shift animation
	if (visible) {
		Animated.spring(shiftY, {
			toValue: 0,
			speed: 20,
			bounciness: 7,
			useNativeDriver: true,
		})
		.start();
	}
	else {
		Animated.spring(shiftY, {
			toValue: fullShift,
			speed: 20,
			bounciness: 7,
			useNativeDriver: true,
		})
		.start();
	}

	// Custom theme stylings
	let backgroundColor = {
		backgroundColor: appTheme.APP_BACKGROUND
	};

	let textColor = {
		color: appTheme.COLOR
	};

	let shiftStyle = {
		transform: [{ translateY: shiftY }],
	};

	// notificationData = [
	// 	{
	// 		type: NOTIFICATION_TYPE.INFO,
	// 		payload: 'Welcome to ChessVibe!',
	// 	},
	// 	{
	// 		type: NOTIFICATION_TYPE.FRIEND_REQUEST,
	// 		uid: 'ST2EgnAwBvTvLZioae06PcLCxxR2',
	// 	},
	// 	{
	// 		type: NOTIFICATION_TYPE.FRIEND_ACCEPTED,
	// 		uid: 'Uf2U0TIsvBSxlHKDomhwXowqJq22',
	// 	},
	// 	{
	// 		type: NOTIFICATION_TYPE.CHALLENGE,
	// 		uid: 'AI',
	// 	},
	// ];

	let notifications = notificationData.map((data, index) => {
		return (
			<Notification
				key={ index }
				data={ data }
				friends={ friends }
				id={ notificationIDs[index] }
				isDarkTheme={ isDarkTheme }/>
		);
	});

	let content;

	if (notifications.length != 0) {
		content = (
			<ScrollView>
				{ notifications }
			</ScrollView>
		);
	}
	else {
		content = (
			<View style={ styles.emptyBox }>
				<TextVibe style={ [styles.emptyText, textColor] }>
					Nothing To Show
				</TextVibe>
			</View>
		);
	}

	return (
		<Animated.View style={ [styles.outerView, shiftStyle] }>
			<TouchableWithoutFeedback onPress={ () => setVisible(false) }>
				<View style={ styles.backView }/>
			</TouchableWithoutFeedback>
			<View style={ [styles.view, backgroundColor] }>
				<TextVibe style={ [styles.title, textColor] }>Notifications</TextVibe>
				{ content }
			</View>
		</Animated.View>
	);
}

function Notification(props) {
	const {
		data={},
		id='',
		friends={},
		isDarkTheme=false,
	} = props;

	const appTheme = isDarkTheme ? APP_THEME.DARK : APP_THEME.LIGHT;
	const { type=NOTIFICATION_TYPE.INFO, payload='', uid='' } = data;
	const [ user, setUser ] = React.useState({});
	const [ friendAlready, setFriendAlready ] = React.useState(friends[uid] == FRIEND.FRIENDED);


	// Update whenver uid changes
	React.useEffect(() => {
		setFriendAlready(friends[uid] == FRIEND.FRIENDED);
	},
	[friends[uid] == FRIEND.FRIENDED]);


	// Update whenver uid changes
	React.useEffect(() => {
		if (uid == '') return;

		Backend.getUser(uid).then(result => {
			setUser(result.data);
		});
	},
	[uid]);


	// Custom styles
	let backgroundStyle = {
		backgroundColor: appTheme.CONTENT_BACKGROUND
	};

	let textStyle = {
		color: appTheme.COLOR
	};

	let confirmBtnStyle = {
		backgroundColor: appTheme.COLOR,
	};

	let confirmBtnTextStyle = {
		color: appTheme.CONTENT_BACKGROUND,
	};


	// Notification content based on type
	let message, icon, confirmIcon, confirmText, confirmClick;
	switch(type) {
		case NOTIFICATION_TYPE.INFO:
			icon = isDarkTheme ? IMAGE.HISTORY : IMAGE.HISTORY_DARK;
			message = payload;
			break;

		case NOTIFICATION_TYPE.FRIEND_REQUEST:
			icon = user.photo ? { uri: user.photo + '=c' } : isDarkTheme ? IMAGE.FRIENDS : IMAGE.FRIENDS_DARK;

			if (friendAlready) {
				message = (user.name || '') + ' is now your friend.';
			}
			else {
				message = (user.name || '') + ' sent you a friend request.';
				confirmText = 'Accept';
				confirmIcon = isDarkTheme ? IMAGE.FRIENDS_DARK : IMAGE.FRIENDS;
				confirmClick = () => {
					setFriendAlready(true);
					Backend.acceptFriend(uid);
				};
			}
			break;

		case NOTIFICATION_TYPE.FRIEND_ACCEPTED:
			icon = user.photo ? { uri: user.photo + '=c' } : isDarkTheme ? IMAGE.FRIENDS : IMAGE.FRIENDS_DARK;
			message = (user.name || '') + ' accepted your friend request.';
			break;

		case NOTIFICATION_TYPE.CHALLENGE:
			icon = user.photo ? { uri: user.photo + '=c' } : isDarkTheme ? IMAGE.DRAW : IMAGE.DRAW_DARK;
			message = (user.name || '') + ' challenged you to a chess match.';
			confirmText = 'Accept';
			confirmIcon = isDarkTheme ? IMAGE.DRAW_DARK : IMAGE.DRAW;
			break;

		default:
			return <View/>;
	}


	// Action buttons
	let confirmBtn = confirmText ?
		(
			<View style={ styles.notifActionBox }>
				<ButtonVibe style={ [styles.notifActionBtn, confirmBtnStyle] } onPress={ confirmClick }>
					<TextVibe style={ [styles.notifActionBtnText, confirmBtnTextStyle] }>{ confirmText }</TextVibe>
					<Image style={ styles.notifActionBtnIcon } source={ confirmIcon }/>
				</ButtonVibe>
			</View>
		)
		: null;

	return (
		<ButtonVibe style={ [styles.notif, backgroundStyle] }>
			<Image style={ styles.notifIcon } source={ icon }/>
			<View style={ styles.notifContent }>
				<TextVibe style={ [styles.notifText, textStyle] }>
					{ message }
				</TextVibe>

				{ confirmBtn }
			</View>
		</ButtonVibe>
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
		width: '90%',
		minHeight: vh(20),
		maxHeight: vh(70),

		alignSelf: 'flex-end',
		top: vw(1),
		right: vw(0.5),
		padding: vw(2),
		borderRadius: vw(),

		backgroundColor: 'black',

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

		emptyBox: {
			flex: 1,
			justifyContent: 'center',
			marginBottom: vw(3),
		},

			emptyText: {
				textAlign: 'center',
			},

		notif: {
			borderRadius: vw(),
			marginBottom: vw(),
			padding: vw(2),
			alignItems: 'flex-start',
			flexDirection: 'row',
		},

			notifIcon: {
				width: vw(16),
				height: vw(16),
				marginRight: vw(4),
				borderRadius: vw(),
			},

			notifContent: {
				flex: 1,
			},

				notifText: {
					flex: 1,
					fontSize: vw(5),
				},

				notifActionBox: {
					flexDirection: 'row',
					justifyContent: 'flex-end',
					marginTop: vw(4),
				},

					notifActionBtn: {
						backgroundColor: 'orange',
						paddingVertical: vw(0.5),
						paddingHorizontal: vw(2),
						marginLeft: vw(),
						flexDirection: 'row',
					},

						notifActionBtnText: {
							fontSize: vw(5),
						},

						notifActionBtnIcon: {
							width: vw(7),
							height: vw(7),
							marginLeft: vw(),
						},
});
