import * as React from 'react';
import { Keyboard, Switch, Animated, View, SafeAreaView, ScrollView, StyleSheet, StatusBar, TouchableOpacity, TouchableWithoutFeedback, Image, Button, RefreshControl } from 'react-native';
import { ActionBar, WebVibe, TextVibe, ModalVibe, ButtonVibe, DialogVibe, InputVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';

import { URL, TEAM, IMAGE, STORAGE_IS_DARK_THEME, APP_THEME } from 'chessvibe/src/Const';
import Util, { formatDate, vw, vh } from 'chessvibe/src/Util';
import Storage from 'chessvibe/src/Storage';
import Cache from 'chessvibe/src/Cache';
import Backend from 'chessvibe/src/Backend';
import SideMenu from 'react-native-side-menu'
import Store from 'chessvibe/src/redux/Store';
import { useSelector } from 'react-redux';


// Home Screen
export default function ReportModal(props) {
	const { isDarkTheme, isVisible, onDismiss } = props;
	const appTheme = isDarkTheme ? APP_THEME.DARK : APP_THEME.LIGHT;
	const [ email, setEmail ] = React.useState(Cache.user.email);
	const [ message, setMessage ] = React.useState('');

	let textColor = {
		color: appTheme.COLOR
	};

	let inputStyle = {
		backgroundColor: isDarkTheme ? '#ffffff2e' : appTheme.MENU_BACKGROUND
	};

	let btnStyle = {
		backgroundColor: appTheme.APP_BACKGROUND
	};

	function clearForm() {
		setEmail(Cache.user.email);
		setMessage('');
	}

	function submitForm() {
		if (email != '' && message != '') {
			Backend.sendInbox(email, message);
			clearForm();
		}
		onDismiss();
	}

	return (
		<ModalVibe isVisible={ isVisible } coverAll={ true } onDismiss={ onDismiss }>
			<TouchableWithoutFeedback onPress={ Keyboard.dismiss } style={{ flex: 1 }}>
				<View>
					<TextVibe style={ [styles.title, textColor] }>Report Issues</TextVibe>
					<InputVibe
						placeholder={ 'Email' }
						initValue={ email }
						style={ {...styles.emailInput, ...inputStyle, ...textColor} }
						onChangeText={ text => setEmail(text) }
						onSubmitText={ text => {
							setEmail(text);
							submitForm();
						} }/>
					<InputVibe
						placeholder={ 'Describe any bug, feature, or improvement...' }
						initValue={ message }
						style={ {...styles.messageInput, ...inputStyle, ...textColor} }
						multiline={ true }
						blurOnSubmit={ true }
						onChangeText={ text => setMessage(text) }
						onSubmitText={ text => {
							setMessage(text);
							submitForm();
						} }/>
				</View>
			</TouchableWithoutFeedback>
		</ModalVibe>
	);
}


const styles = StyleSheet.create({
	view: {
		alignSelf: 'stretch',
		flex: 1,
	},

		header: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'flex-start',
		},

			title: {
				fontSize: vw(5),
			},

			clearBtn: {
				paddingHorizontal: vw(2),
			},

		emailInput: {
			fontSize: vw(5),
			borderRadius: vw(),
			height: vw(10),
			marginTop: vw(5),
		},

		messageInput: {
			fontSize: vw(5),
			borderRadius: vw(),
			height: vh(50),
			marginTop: vw(),
		},
});
