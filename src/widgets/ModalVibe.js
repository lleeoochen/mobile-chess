import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Modal from 'react-native-modal';
import { vw, wh } from '../Util';
import { APP_THEME } from '../Const';
import Store from 'chessvibe/src/redux/Store';
import { useSelector } from 'react-redux';

export default function ModalVibe(props) {
	const isDarkTheme = useSelector(state => state.isDarkTheme);
	const appTheme = isDarkTheme ? APP_THEME.DARK : APP_THEME.LIGHT;

	// Theme configuration
	let menuStyle = [styles.menu, {
		backgroundColor: appTheme.CONTENT_BACKGROUND,
		borderColor: appTheme.MENU_BACKGROUND,
	}];

	return (
		<Modal
			isVisible={ props.isVisible || false }
			// animationIn={'fadeIn'}
			// animationOut={'fadeOut'}
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
		backgroundColor: '#1a283a',
		borderStyle: 'solid',
		borderColor: '#0d151f',
		borderWidth: vw(),
		borderRadius: vw(),
		width: '90%',
		left: '5%',
		right: '5%',
		zIndex: 100,
	},
});
