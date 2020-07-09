import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Modal from 'react-native-modal';
import { vw, wh } from '../Util';
import Store from 'chessvibe/src/redux/Store';

export default function ModalVibe(props) {
	let { theme } = Store.getState();

	let menuStyle = {...styles.menu, ...{
		borderColor: theme.COLOR_BOARD_DARK,
	}};

	return (
		<Modal
			isVisible={ props.isVisible || false }
			animationIn={'fadeIn'}
			animationOut={'fadeOut'}
			animationInTiming={100}
			animationOutTiming={100}
			backdropTransitionInTiming={100}
			backdropTransitionOutTiming={100}
			activeOpacity={ 0 }
			hideModalContentWhileAnimating={ true }
			backdropTransitionOutTiming={ 0 }
			onModalHide={ props.onModalHide }
			style={ styles.modal }>
			<TouchableWithoutFeedback onPress={ props.onDismiss }>
				<View style={ styles.menuOutside }></View>
			</TouchableWithoutFeedback>
			<View style={ menuStyle }>
				{ props.children }
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		margin: 0
	},

	menuOutside: {
		flex: 1,
	},

	menu: {
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '3%',
		backgroundColor: 'darkslategrey',
		borderStyle: 'solid',
		borderColor: 'green',
		borderWidth: vw(),
		borderRadius: vw(),
		width: '90%',
		left: '5%',
		right: '5%',
		zIndex: 100,
	},
});
