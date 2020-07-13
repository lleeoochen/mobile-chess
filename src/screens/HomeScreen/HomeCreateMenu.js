import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Slider from "react-native-slider";
import { TextVibe, ModalVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import { vw } from 'chessvibe/src/Util';
import { THEME_ID, TIME } from 'chessvibe/src/Const';

const new_match_img = require('chessvibe/assets/new_match.png');
const borderRadius = vw();

export default function HomeCreateMenu(props) {
	let [ theme, setTheme ] = React.useState(THEME_ID.CLASSIC);
	let [ time, setTime ] = React.useState(TIME.FIFTEEN);
	let { visible, onDismiss, onSubmit } = props;

	let styleClassic = { ...styles.menuBtn, ...styles.classic, ...(theme == THEME_ID.CLASSIC ? styles.selected : {}) };
	let styleWinter  = { ...styles.menuBtn, ...styles.winter, ...(theme == THEME_ID.WINTER ? styles.selected : {}) };
	let styleMetal   = { ...styles.menuBtn, ...styles.metal, ...(theme == THEME_ID.METAL ? styles.selected : {}) };
	let styleNature  = { ...styles.menuBtn, ...styles.nature, ...(theme == THEME_ID.NATURE ? styles.selected : {}) };

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
				<TouchableOpacity style={ styleClassic } onPress={ () => setTheme(THEME_ID.CLASSIC) }>
					<TextVibe style={ styles.menuBtnText }>Classic</TextVibe>
				</TouchableOpacity>
				<TouchableOpacity style={ styleWinter } onPress={ () => setTheme(THEME_ID.WINTER) }>
					<TextVibe style={ styles.menuBtnText }>Winter</TextVibe>
				</TouchableOpacity>
				<TouchableOpacity style={ styleMetal } onPress={ () => setTheme(THEME_ID.METAL) }>
					<TextVibe style={ styles.menuBtnText }>Metal</TextVibe>
				</TouchableOpacity>
				<TouchableOpacity style={ styleNature } onPress={ () => setTheme(THEME_ID.NATURE) }>
					<TextVibe style={ styles.menuBtnText }>Nature</TextVibe>
				</TouchableOpacity>
			</View>

			<TextVibe style={ styles.menuText }> Time </TextVibe>
			<Slider
				step={ 1 }
				maximumValue={ 3 }
				thumbTintColor={ 'white' }
				minimumTrackTintColor={ 'darkslateblue' }
				maximumTrackTintColor={ 'grey' }
				style={ styles.timeSlider }
				onValueChange={(val) => {
					     if (val == 0) setTime(TIME.FIVE)
					else if (val == 1) setTime(TIME.FIFTEEN)
					else if (val == 2) setTime(TIME.THIRTY)
					else if (val == 3) setTime(TIME.INFINITE)
				}}/>
			<TextVibe style={ styles.timeText }>
				{
					time == TIME.FIVE ? '5 min' :
					time == TIME.FIFTEEN ? '15 min' :
					time == TIME.THIRTY ? '30 min' :
					time == TIME.INFINITE ? '∞ min' :
					''
				}
			</TextVibe>

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
		// textAlign: 'center',
		width: '100%',
	},

	menuContainer: {
		flexDirection: 'row',
		width: '100%',
		marginTop: vw(4),
		marginBottom: vw(8),
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

	timeSlider: {
		width: '100%',
	},

	timeText: {
		color: 'white',
		fontSize: vw(5),
		textAlign: 'right',
		width: '100%',
	},

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
