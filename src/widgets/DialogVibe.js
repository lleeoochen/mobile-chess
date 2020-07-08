import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { vw, vh } from 'chessvibe/src/Util';
import { THEME } from 'chessvibe/src/Const';

import TextVibe from './TextVibe';
import ButtonVibe from './ButtonVibe';
import ModalVibe from './ModalVibe';

export default function DialogVibe(props) {
	let {
		visible=false,
		onSuccess=() => {},
		onDismiss=() => {},
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

	let cancelBtn = null, confirmBtn = null;

	if (showCancelBtn) {
		cancelBtn = (
			<ButtonVibe style={ styles.cancelBtn } onPress={ () => onDismiss() }>
				<TextVibe style={ [styles.btnText, styles.black] }>{ cancelBtnText }</TextVibe>
			</ButtonVibe>
		);
	}

	if (showConfirmBtn) {
		confirmBtn = (
			<ButtonVibe style={ confirmBtnStyle } onPress={ () => onSuccess() }>
				<TextVibe style={ [styles.btnText, styles.black] }>{ confirmBtnText }</TextVibe>
			</ButtonVibe>
		);
	}

	return (
		<ModalVibe
			isVisible={ visible }
			onDismiss={ () => onDismiss() }>
			<View style={ styles.squareBack }></View>

			<TextVibe style={ styles.text }>{ title }</TextVibe>
			<View style={ styles.btnContainer }>
				{ cancelBtn }
				{ confirmBtn }
			</View>
		</ModalVibe>
	);
}

const styles = StyleSheet.create({
	btnContainer: {
		flex: 1,
		flexDirection: 'row',
		paddingHorizontal: vw(2),
		backgroundColor: 'darkslategrey',
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
		backgroundColor: 'darkslategrey',
		paddingHorizontal: vw(2),
	},

	black: {
		color: 'black',
	},
});
