import * as React from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';
import Slider from 'react-native-slider';
import { TextVibe, ModalVibe, ButtonVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import { vw, formatImage } from 'chessvibe/src/Util';
import { THEME_ID, TIME, IMAGE, APP_THEME, MATCH_MODE, FRIEND } from 'chessvibe/src/Const';
import { useSelector } from 'react-redux';

const BORDER_RADIUS = vw();
const MATCH_SIZE = vw((90 - 8 - 4) / 5);

const INDEX_TIME = [TIME.FIVE, TIME.TEN, TIME.FIFTEEN, TIME.THIRTY, TIME.INFINITE];
const TIME_INDEX = {
	[TIME.FIVE]: 0,
	[TIME.TEN]: 1,
	[TIME.FIFTEEN]: 2,
	[TIME.THIRTY]: 3,
	[TIME.INFINITE]: 4,
};

const MODE_NAMES = ['', 'Computer', 'Friend'];

const MENU_BUTTON_COLOR = '#424c5a';


export default function HomeCreateMenu(props) {
	const { mode, visible, opponents, friends, onDismiss, onSubmit } = props;

	const appThemeId = useSelector(state => state.home.appThemeId);
	const appTheme = APP_THEME[appThemeId];
	const modeAI = mode == MATCH_MODE.COMPUTER;

	const formData = {
		theme: THEME_ID.CLASSIC,
		time: modeAI ? TIME.INFINITE : TIME.FIFTEEN,
		friend: '',
	};

	const textColor = {
		color: appTheme.COLOR
	};

	function createMatch() {
		let isAI = mode == MATCH_MODE.COMPUTER;
		let { theme, time, friend } = formData;
		onSubmit(theme, time, friend, isAI);
	}

	return (
		<ModalVibe
			coverAll={ true }
			isVisible={ visible }
			onDismiss={ onDismiss }>

			<TextVibe style={ [styles.menuText, textColor] }>
				{ MODE_NAMES[mode] } Mode
			</TextVibe>

			<FriendSelector
				appThemeId={ appThemeId }
				formData={ formData }
				opponents={ opponents }
				friends={ friends }
				visible={ !modeAI }/>

			<ThemeSelector
				appThemeId={ appThemeId }
				formData={ formData }/>

			<TimeSelector
				appThemeId={ appThemeId }
				formData={ formData }
				visible={ !modeAI }/>

			<SubmitButton
				appThemeId={ appThemeId }
				onPress={ () => createMatch() }/>
		</ModalVibe>
	);
}

function FriendSelector({ appThemeId, formData, opponents, friends, visible }) {
	if (!visible) return <View/>;

	const appTheme = APP_THEME[appThemeId];
	const [ people, setPeople ] = React.useState([]);
	const [ selected, setSelected ] = React.useState(0);

	React.useEffect(() => {
		let people = opponents
						.map(opponent => {
							return opponent[0];
						})
						.sort((p1) => {
							return friends[p1.user_id] == FRIEND.FRIENDED ? -1 : 1;
						});

		people.unshift({});
		setPeople(people);
	},
	[opponents, friends]);

	function selectFriend(index) {
		formData.friend = people[index].user_id;
		setSelected(index);
	}

	const peopleViews = people.map((person, index) => {
		const borderStyle = index == selected ?
			{
				borderWidth: vw(),
				borderColor: appThemeId === 'DARK' ? appTheme.APP_BACKGROUND : 'white',
			}
			: null;

		return (
			<ButtonVibe
				key={ index }
				style={ styles.profileBtn }
				onPress={() => selectFriend(index)}>

				<AutoHeightImage
					width={ MATCH_SIZE }
					source={ formatImage(person.photo) }
					style={ [styles.profileImg, borderStyle] }/>

			</ButtonVibe>
		);
	});

	return (
		<ScrollView horizontal={ true } contentContainerStyle={{ right: vw(-0.5) }}>
			{ peopleViews }
		</ScrollView>
	);
}

function ThemeSelector({ appThemeId, formData }) {
	const appTheme = APP_THEME[appThemeId];
	const [ theme, setTheme ] = React.useState(THEME_ID.CLASSIC);

	const themeBtnStyle = {... styles.themeBtn, ...{
		backgroundColor: appThemeId !== 'DARK' ? appTheme.APP_BACKGROUND : MENU_BUTTON_COLOR
	}};

	const themeImage =
		theme == THEME_ID.WINTER ? IMAGE.PREVIEW_WINTER :
		theme == THEME_ID.METAL ? IMAGE.PREVIEW_METAL :
		theme == THEME_ID.NATURE ? IMAGE.PREVIEW_NATURE :
		theme == THEME_ID.HELL ? IMAGE.PREVIEW_HELL :
		IMAGE.PREVIEW_CLASSIC;

	function changeTheme(direction) {
		const next = (theme + direction + Object.keys(THEME_ID).length) % Object.keys(THEME_ID).length;
		setTheme(next);
		formData.theme = next;
	}

	return (
		<View style={ styles.themeContainer }>
			<ButtonVibe style={ [themeBtnStyle, styles.themeBtnLeft] } onPress={() => changeTheme(-1)}>
				<Image source={ IMAGE['BACK' + (appThemeId !== 'DARK' ? '_DARK' : '')] } style={ styles.themeBtnImage }/>
			</ButtonVibe>
			<View style={ styles.themeImageWrap }>
				<Image source={ themeImage } style={ styles.themeImage }/>
			</View>
			<ButtonVibe style={ [themeBtnStyle, styles.themeBtnRight] } onPress={() => changeTheme(1)}>
				<Image source={ IMAGE['BACK' + (appThemeId !== 'DARK' ? '_DARK' : '')] } style={ [styles.themeBtnImage,  {transform: [{ scaleX: -1 }]}] }/>
			</ButtonVibe>
		</View>
	);
}

function TimeSelector({ appThemeId, formData, visible }) {
	if (!visible) return <View/>;

	const appTheme = APP_THEME[appThemeId];

	const textColor = {
		color: appTheme.COLOR
	};

	const [ time, setTime ] = React.useState(TIME.FIFTEEN);

	function onValueChange(val) {
		setTime(INDEX_TIME[val]);
		formData.time = INDEX_TIME[val];
	}

	return (
		<View>
			<Slider
				value={ TIME_INDEX[time] }
				step={ 1 }
				maximumValue={ 4 }
				thumbTintColor={ 'white' }
				minimumTrackTintColor={ 'green' }
				maximumTrackTintColor={ 'grey' }
				style={ styles.timeSlider }
				onValueChange={ (val) => onValueChange(val) }/>
			<TextVibe style={ [styles.timeText, textColor] }> Time:&nbsp;&nbsp;
				{
					time == TIME.FIVE     ? '5 min' :
					time == TIME.TEN      ? '10 min' :
					time == TIME.FIFTEEN  ? '15 min' :
					time == TIME.THIRTY   ? '30 min' :
					time == TIME.INFINITE ? '∞ min' :
					''
				}
			</TextVibe>
		</View>
	);
}

function SubmitButton({ appThemeId, onPress }) {
	const appTheme = APP_THEME[appThemeId];

	const submitBtnStyle = {
		backgroundColor: appThemeId !== 'DARK' ? appTheme.APP_BACKGROUND : MENU_BUTTON_COLOR
	};

	const textColor = {
		color: appTheme.COLOR
	};

	return (
		<ButtonVibe style={ [styles.menuSubmitBtn, submitBtnStyle] } onPress={ onPress }>
			<TextVibe style={ [styles.menuSubmitBtnText, textColor] }>Create Match</TextVibe>
		</ButtonVibe>
	);
}

const shadow = {
	shadowColor: '#000',
	shadowOffset: {
		width: 0,
		height: 1,
	},
	shadowOpacity: 0.22,
	shadowRadius: 2.22,
	elevation: 3,
};

const styles = StyleSheet.create({
	menuText: {
		color: 'white',
		fontSize: vw(5),
		width: '100%',
	},

	profileBtn: {
		borderRadius: BORDER_RADIUS,
		marginRight: vw(),

		...shadow,
	},

		profileImg: {
			borderRadius: BORDER_RADIUS,
		},

	themeContainer: {
		flexDirection: 'row',
		marginTop: vw(12),
		marginBottom: vw(8),
	},

		themeImageWrap: {
			...shadow,
		},

			themeImage: {
				width: vw(65),
				height: vw(65),
			},

		themeBtn: {
			flex: 1,
			height: vw(65),
			borderRadius: 0,

			...shadow,
		},

			themeBtnLeft: {
				borderTopLeftRadius: vw(),
				borderBottomLeftRadius: vw(),
			},

			themeBtnRight: {
				borderTopRightRadius: vw(),
				borderBottomRightRadius: vw(),
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
			marginTop: vw(-4),
			// marginBottom: vw(4),
		},

	menuSubmitBtn: {
		marginTop: vw(2),
		backgroundColor: MENU_BUTTON_COLOR,
		padding: vw(2),
		borderRadius: BORDER_RADIUS,
		width: '100%',

		...shadow,
	},

		menuSubmitBtnText: {
			fontSize: vw(5),
			textAlign: 'center',
			color: 'white',
		}
});
