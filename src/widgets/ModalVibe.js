import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { vw, wh } from '../Util';

export default function ModalVibe(props) {
	return (
		<Modal
			isVisible={ props.isVisible || false }
			animationIn={'fadeIn'}
			animationOut={'fadeOut'} activeOpacity={0}
			style={ styles.modal }>
			<TouchableOpacity style={ styles.menuOutside } onPressIn={ props.onDismiss }>
			</TouchableOpacity>
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
		borderWidth: vw(2),
		width: '90%',
		left: '5%',
		right: '5%',
		zIndex: 100
	},
});
