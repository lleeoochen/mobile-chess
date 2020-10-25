import * as React from 'react';
import { Keyboard, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { TextVibe, ModalVibe, InputVibe } from 'chessvibe/src/widgets';

import { APP_THEME } from 'chessvibe/src/Const';
import { vw, vh } from 'chessvibe/src/Util';
import Cache from 'chessvibe/src/Cache';
import Backend from 'chessvibe/src/Backend';


// Home Screen
export default function ReportModal(props) {
	const { appThemeId, isVisible, onDismiss } = props;
	const appTheme = APP_THEME[appThemeId];
	const [ email, setEmail ] = React.useState(Cache.user.email);
	const [ message, setMessage ] = React.useState('');

	let textColor = {
		color: appTheme.COLOR
	};

	let inputStyle = {
		backgroundColor: appThemeId === 'DARK' ? '#ffffff2e' : appTheme.MENU_BACKGROUND
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
	title: {
		fontSize: vw(5),
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
