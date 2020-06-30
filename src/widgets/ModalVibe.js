import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { vw, wh } from '../Util';

export default function ModalVibe(props) {
	return (
		<Modal isVisible={ props.isVisible || false }>
			<TouchableOpacity style={ styles.menuOutside } onPressOut={ props.onDismiss }>
				<View style={ styles.menu }>
					{ props.children }
				</View>
			</TouchableOpacity>
		</Modal>
	);
}

const styles = StyleSheet.create({
	menuOutside: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},

	menu: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: '3%',
		backgroundColor: 'darkslategrey',
		borderStyle: 'dashed',
		borderColor: 'grey',
		borderWidth: vw(2),
		width: '90%'
	},
});
