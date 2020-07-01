import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextVibe, ModalVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import { vw } from 'chessvibe/src/Util';

const new_match_img = require('chessvibe/assets/new_match.png');
const borderRadius = vw();

const THEME = {
	CLASSIC: 0,
	WINTER: 1,
	METAL: 2,
	NATURE: 3,
};

const TIME = {
	FIVE: 0,
	FIFTEEN: 1,
	THIRTY: 2,
	INFINITE: 3,
};

export default function HomeCreateMenu(props) {
	let [ theme, setTheme ] = React.useState(THEME.CLASSIC);
	let [ time, setTime ] = React.useState(TIME.FIFTEEN);
	let { visible, onDismiss, onSubmit } = props;

	let styleClassic = { ...styles.menuBtn, ...styles.classic, ...(theme == THEME.CLASSIC ? styles.selected : {}) };
	let styleWinter  = { ...styles.menuBtn, ...styles.winter, ...(theme == THEME.WINTER ? styles.selected : {}) };
	let styleMetal   = { ...styles.menuBtn, ...styles.metal, ...(theme == THEME.METAL ? styles.selected : {}) };
	let styleNature  = { ...styles.menuBtn, ...styles.nature, ...(theme == THEME.NATURE ? styles.selected : {}) };

	let styleFive     = { ...styles.menuBtn, ...(time == TIME.FIVE ? styles.selected : {}) };
	let styleFifteen  = { ...styles.menuBtn, ...(time == TIME.FIFTEEN ? styles.selected : {}) };
	let styleThirty   = { ...styles.menuBtn, ...(time == TIME.THIRTY ? styles.selected : {}) };
	let styleInfinite = { ...styles.menuBtn, ...(time == TIME.INFINITE ? styles.selected : {}) };

	return (
		<ModalVibe
			isVisible={ visible }
			onDismiss={ onDismiss }>

			<TextVibe style={ styles.menuText }> Theme </TextVibe>
			<View style={ styles.menuContainer }>
				<TouchableOpacity style={ styleClassic } onPress={ () => setTheme(THEME.CLASSIC) }>
					<TextVibe style={ styles.menuBtnText }>Classic</TextVibe>
				</TouchableOpacity>
				<TouchableOpacity style={ styleWinter } onPress={ () => setTheme(THEME.WINTER) }>
					<TextVibe style={ styles.menuBtnText }>Winter</TextVibe>
				</TouchableOpacity>
				<TouchableOpacity style={ styleMetal } onPress={ () => setTheme(THEME.METAL) }>
					<TextVibe style={ styles.menuBtnText }>Metal</TextVibe>
				</TouchableOpacity>
				<TouchableOpacity style={ styleNature } onPress={ () => setTheme(THEME.NATURE) }>
					<TextVibe style={ styles.menuBtnText }>Nature</TextVibe>
				</TouchableOpacity>
			</View>

			<TextVibe style={ styles.menuText }> Time </TextVibe>
			<View style={ styles.menuContainer }>
				<TouchableOpacity style={ styleFive } onPress={ () => setTime(TIME.FIVE) }>
					<TextVibe style={ styles.menuBtnText }>5 min</TextVibe>
				</TouchableOpacity>
				<TouchableOpacity style={ styleFifteen } onPress={ () => setTime(TIME.FIFTEEN) }>
					<TextVibe style={ styles.menuBtnText }>15 min</TextVibe>
				</TouchableOpacity>
				<TouchableOpacity style={ styleThirty } onPress={ () => setTime(TIME.THIRTY) }>
					<TextVibe style={ styles.menuBtnText }>30 min</TextVibe>
				</TouchableOpacity>
				<TouchableOpacity style={ styleInfinite } onPress={ () => setTime(TIME.INFINITE) }>
					<TextVibe style={ styles.menuBtnText }>∞</TextVibe>
				</TouchableOpacity>
			</View>

			<TouchableOpacity style={ styles.menuSubmitBtn } onPress={ () => onSubmit(theme, time) }>
				<TextVibe style={ styles.menuSubmitBtnText }>Create Match</TextVibe>
			</TouchableOpacity>
		</ModalVibe>
	);
}

const styles = StyleSheet.create({
	menuText: {
		color: 'white',
		fontSize: vw(5),
		textAlign: 'center',
	},

	menuContainer: {
		flexDirection: 'row',
		// marginRight: vw(-1),
		width: '100%',
		marginBottom: vw(2),
	},

		menuBtn: {
			marginRight: vw(),
			backgroundColor: 'white',
			padding: vw(2),
			borderRadius: borderRadius,
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
		},

			menuBtnText: {
				fontSize: vw(4),
				textAlign: 'center',
			},

			selected: {
				borderWidth: vw(),
				borderColor: 'black',
			},

			classic: { backgroundColor: '#e6bf83' },
			winter: { backgroundColor: '#00b3de' },
			metal: { backgroundColor: '#d2d2d2' },
			nature: { backgroundColor: '#c7da61' },

	menuSubmitBtn: {
		marginTop: vw(5),
		backgroundColor: 'white',
		padding: vw(2),
		borderRadius: borderRadius,
		width: '100%',
	},

		menuSubmitBtnText: {
			fontSize: vw(5),
			textAlign: 'center',
		}
});
