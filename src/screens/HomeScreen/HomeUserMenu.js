import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { TextVibe, ModalVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import { vw } from 'chessvibe/src/Util';

const new_match_img = require('chessvibe/assets/new_match.png');
const borderRadius = vw();

export default function HomeUserMenu(props) {

	let { visible, onDismiss, onLogout, user, stats } = props;

	return (
		<ModalVibe
			isVisible={ visible }
			onDismiss={ onDismiss }>

			<TextVibe style={ styles.menuText }>{ user.name || '' }</TextVibe>
			<AutoHeightImage
				style={ styles.menuImage }
				width={ vw(30) }
				source={ user.photo ? { uri: user.photo + '=c' } : new_match_img }/>

			<TextVibe style={ styles.menuStat }>Win Rate { (stats.win * 100.0 / (stats.win + stats.lose)).toFixed(2) }%.</TextVibe>
			<TextVibe style={ styles.menuStat }>Win { stats.win } games.</TextVibe>
			<TextVibe style={ styles.menuStat }>Lose { stats.lose } games.</TextVibe>
			<TextVibe style={ styles.menuStat }>Draw { stats.draw } games.</TextVibe>
			<TextVibe style={ styles.menuStat }>Stalemate { stats.stalemate } games.</TextVibe>
			<TextVibe style={ styles.menuStat }>Resign { stats.draw } games.</TextVibe>
			<TextVibe style={ styles.menuStat }>Ongoing { stats.ongoing } games.</TextVibe>
			<TouchableOpacity style={ styles.menuBtn } onPress={ onLogout }>
				<TextVibe style={ styles.menuBtnText }>Logout</TextVibe>
			</TouchableOpacity>
		</ModalVibe>
	);
}

const styles = StyleSheet.create({
	menuText: {
		color: 'white',
		fontSize: vw(8),
		textAlign: 'center',
	},

	menuImage: {
		marginVertical: vw(5),
		borderRadius: borderRadius,
	},

	menuStat: {
		color: 'white',
		fontSize: vw(5),
	},

	menuBtn: {
		marginTop: vw(5),
		backgroundColor: 'white',
		padding: vw(2),
		borderRadius: borderRadius,
		width: '100%',
	},

	menuBtnText: {
		fontSize: vw(5),
		textAlign: 'center',
	}
});