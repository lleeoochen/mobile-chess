import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { vw, vh } from 'chessvibe/src/Util';
import { THEME, APP_THEME } from 'chessvibe/src/Const';
import { useSelector } from 'react-redux';

import TextVibe from './TextVibe';
import ButtonVibe from './ButtonVibe';
import ModalVibe from './ModalVibe';

const handle_height = 20 + vw(3);
const panel_height = vw(12);
const header_height = panel_height + handle_height;
export default function DialogVibe(props) {
	const appThemeId = useSelector(state => state.home.appThemeId);
	const appTheme = APP_THEME[appThemeId];

	let {
		visible=false,
		onSuccess=() => {},
		onDismiss=() => {},
		onModalHide=() => {},
		theme=THEME.CLASSIC,
		title='',
		confirmBtnText='Confirm',
		cancelBtnText='Cancel',
		showCancelBtn=true,
		showConfirmBtn=true,
	} = props;

	let confirmBtnStyle = {...styles.confirmBtn, ...{
		backgroundColor: theme.COLOR_BOARD_LIGHT,
		color: theme.COLOR_BOARD_LIGHT,
	}};

	let textColor = {
		color: appTheme.COLOR
	};

	let cancelBtn = null, confirmBtn = null;

	if (showCancelBtn) {
		cancelBtn = (
			<ButtonVibe style={ styles.cancelBtn } useGestureButton={ Platform.OS == 'android' } onPress={ () => onDismiss() }>
				<TextVibe style={ [styles.btnText, styles.black] }>{ cancelBtnText }</TextVibe>
			</ButtonVibe>
		);
	}

	if (showConfirmBtn) {
		confirmBtn = (
			<ButtonVibe style={ confirmBtnStyle } useGestureButton={ Platform.OS == 'android' } onPress={ () => onSuccess() }>
				<TextVibe style={ [styles.btnText, styles.black] }>{ confirmBtnText }</TextVibe>
			</ButtonVibe>
		);
	}

	return (
		<ModalVibe
			isVisible={ visible }
			onDismiss={ () => onDismiss() }
			onModalHide={ () => onModalHide() }
			style={{ top: vh(-100) + header_height }}>
			<View style={ styles.squareBack }></View>

			<TextVibe style={ [styles.text, textColor] }>{ title }</TextVibe>
			<View style={ styles.btnContainer }>
				{ cancelBtn }
				{ confirmBtn }
			</View>
		</ModalVibe>
	);
}

const styles = StyleSheet.create({
	btnContainer: {
		// flex: 1,
		flexDirection: 'row',
		paddingHorizontal: vw(2),
		justifyContent: 'center',
	},

		btnText: {
			fontSize: vw(5),
			textAlign: 'center',
			color: 'white',
		},

		cancelBtn: {
			backgroundColor: 'white',
			paddingVertical: vw(),
			paddingHorizontal: vw(3),
			margin: vw(),
			marginTop: vw(5),
		},

		confirmBtn: {
			backgroundColor: '#57bf69',
			paddingVertical: vw(),
			paddingHorizontal: vw(3),
			margin: vw(),
			fontWeight: 'bold',
			marginTop: vw(5),
		},

	text: {
		fontSize: vw(5),
		textAlign: 'center',
		color: 'white',
		// backgroundColor: 'darkslategrey',
		paddingHorizontal: vw(2),
	},

	black: {
		color: 'black',
	},
});
