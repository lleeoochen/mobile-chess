import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import Slider from "react-native-slider";
import { TextVibe, ModalVibe, ButtonVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import { vw } from 'chessvibe/src/Util';
import { THEME_ID, TIME, IMAGE, APP_THEME } from 'chessvibe/src/Const';
import { useSelector } from 'react-redux';

const new_match_img = require('chessvibe/assets/new_match.png');
const borderRadius = vw();

const INDEX_TIME = [TIME.FIVE, TIME.TEN, TIME.FIFTEEN, TIME.THIRTY, TIME.INFINITE];
const TIME_INDEX = {
	[TIME.FIVE]: 0,
	[TIME.TEN]: 1,
	[TIME.FIFTEEN]: 2,
	[TIME.THIRTY]: 3,
	[TIME.INFINITE]: 4,
};

const INDEX_THEME = [THEME_ID.CLASSIC, THEME_ID.WINTER, THEME_ID.METAL, THEME_ID.NATURE];

export default function HomeCreateMenu(props) {
	const isDarkTheme = useSelector(state => state.isDarkTheme);
	const appTheme = isDarkTheme ? APP_THEME.DARK : APP_THEME.LIGHT;

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

	function changeTheme(direction) {
		let next = (theme + direction + INDEX_THEME.length) % INDEX_THEME.length;
		setTheme(INDEX_THEME[next]);
	}

	let themeImage =
		theme == THEME_ID.WINTER ? IMAGE.PREVIEW_WINTER :
		theme == THEME_ID.METAL ? IMAGE.PREVIEW_METAL :
		theme == THEME_ID.NATURE ? IMAGE.PREVIEW_NATURE :
		IMAGE.PREVIEW_CLASSIC;

	let textColor = {
		color: appTheme.COLOR
	};

	let themeBtnStyle = {... styles.themeBtn, ...{
		backgroundColor: isDarkTheme ? '#ffffff2e' : appTheme.APP_BACKGROUND
	}};

	let submitBtnStyle = {
		backgroundColor: isDarkTheme ? '#ffffff2e' : appTheme.APP_BACKGROUND
	};

	return (
		<ModalVibe
			coverAll={ true }
			isVisible={ visible }
			onDismiss={ onDismiss }>

			<TextVibe style={ [styles.menuText, textColor] }> Theme </TextVibe>

			<View style={ styles.themeContainer }>
				<ButtonVibe style={ themeBtnStyle } onPress={() => changeTheme(-1)}>
					<Image source={ IMAGE['BACK' + (isDarkTheme ? '' : '_DARK')] } style={ styles.themeBtnImage }/>
				</ButtonVibe>
				<Image source={ themeImage } style={ styles.themeImage }/>
				<ButtonVibe style={ themeBtnStyle } onPress={() => changeTheme(1)}>
					<Image source={ IMAGE['BACK' + (isDarkTheme ? '' : '_DARK')] } style={ [styles.themeBtnImage,  {transform: [{ scaleX: -1 }]}] }/>
				</ButtonVibe>
			</View>

			<TextVibe style={ [styles.menuText, textColor] }> Time </TextVibe>
			<Slider
				value={ TIME_INDEX[time] }
				step={ 1 }
				maximumValue={ 4 }
				thumbTintColor={ 'white' }
				minimumTrackTintColor={ 'darkslateblue' }
				maximumTrackTintColor={ 'grey' }
				style={ styles.timeSlider }
				onValueChange={(val) => {
					setTime(INDEX_TIME[val]);
				}}/>
			<TextVibe style={ [styles.timeText, textColor] }>
				{
					time == TIME.FIVE     ? '5 min' :
					time == TIME.TEN      ? '10 min' :
					time == TIME.FIFTEEN  ? '15 min' :
					time == TIME.THIRTY   ? '30 min' :
					time == TIME.INFINITE ? '∞ min' :
					''
				}
			</TextVibe>

			<ButtonVibe style={ [styles.menuSubmitBtn, submitBtnStyle] } onPress={ () => onSubmit(theme, time) }>
				<TextVibe style={ [styles.menuSubmitBtnText, textColor] }>Create Match</TextVibe>
			</ButtonVibe>
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

	themeContainer: {
		flexDirection: 'row',
		marginTop: vw(4),
		marginBottom: vw(8),
	},

		themeImage: {
			width: vw(65),
			height: vw(65),
		},

		themeBtn: {
			flex: 1,
			height: vw(65),
			borderRadius: 0,
		},

			themeBtnImage: {
				width: vw(10),
				height: vw(10),
			},

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
		backgroundColor: '#ffffff2e',
		padding: vw(2),
		borderRadius: borderRadius,
		width: '100%',
	},

		menuSubmitBtnText: {
			fontSize: vw(5),
			textAlign: 'center',
			color: 'white',
		}
});
