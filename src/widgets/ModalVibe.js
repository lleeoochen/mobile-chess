import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Modal from 'react-native-modal';
import { vw, wh } from '../Util';

export default function ModalVibe(props) {
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
			style={ styles.modal }>
			<TouchableWithoutFeedback onPress={ props.onDismiss }>
				<View style={ styles.menuOutside }></View>
			</TouchableWithoutFeedback>
			<View style={ styles.menu }>
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
		borderColor: 'grey',
		borderWidth: vw(),
		borderRadius: vw(),
		width: '90%',
		left: '5%',
		right: '5%',
		zIndex: 100,
	},
});
