import * as React from 'react';
import { Animated, View, SafeAreaView, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Image, Button, RefreshControl } from 'react-native';
import { ActionBar, WebVibe, TextVibe, ModalVibe, ButtonVibe, DialogVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import SearchBar from 'react-native-search-bar';

import { URL, TEAM, IMAGE, APP_THEME, FRIEND } from 'chessvibe/src/Const';
import Util, { formatDate, vw, wh, winType } from 'chessvibe/src/Util';
import Cache from 'chessvibe/src/Cache';
import Backend from 'chessvibe/src/Backend';
import SideMenu from 'react-native-side-menu'
import { showDrawer, updateUser, updateTheme } from 'chessvibe/src/redux/Reducer';
import Store from 'chessvibe/src/redux/Store';

const matchSize = vw(20);
const borderRadius = vw();

// Home Screen
export default function FriendsTab(props) {
	const { isDarkTheme, opponents, friends={} } = props;
	const appTheme = isDarkTheme ? APP_THEME.DARK : APP_THEME.LIGHT;
	let [ searchText, setSearchText ] = React.useState('');
	let [ userModalData, showUserModal ] = React.useState(null);

	let viewStyle = [styles.view, props.style, {
		backgroundColor: appTheme.CONTENT_BACKGROUND
	}];

	let Search = isDarkTheme ? SearchDark : SearchLight;

	opponents.sort((a, b) => {
		let statusA = friends[a[0].user_id] || 0;
		let statusB = friends[b[0].user_id] || 0;
		return statusB - statusA;
	});

	let people = opponents.map(data => {
		if (searchText != '' && !data[0].name.toLowerCase().includes(searchText.toLowerCase()))
			return null;

		return (
			<FriendItem
				data={ data }
				appTheme={ appTheme }
				friendStatus={ friends[data[0].user_id] }
				addFriend={ (id) => Backend.requestFriend(id) }
				acceptFriend={ (id) => Backend.acceptFriend(id) }
				onPress={ () => showUserModal(data) }/>
		);
	});

	return (
		<SafeAreaView style={ viewStyle }>
			<Search
				appTheme={ appTheme }
				initText={ searchText }
				onSubmit={ (text) => { setSearchText(text) } }
				onDismiss={ () => { setSearchText('') } }/>
			<ScrollView>
				{ people }
			</ScrollView>

			<FriendModal appTheme={ appTheme } data={ userModalData } onDismiss={ () => showUserModal(null) }/>
		</SafeAreaView>
	);
}

// Hack to get text to change color
function SearchLight(props) { return <SearchInput initText={ props.initText } appTheme={ props.appTheme } onSubmit={ props.onSubmit } onDismiss={ props.onDismiss }/> }
function SearchDark(props) { return <SearchInput initText={ props.initText } appTheme={ props.appTheme } onSubmit={ props.onSubmit } onDismiss={ props.onDismiss }/> }
function SearchInput(props) {
	let { appTheme, onSubmit, onDismiss, initText } = props;
	let [ text, changeText ] = React.useState(initText);
	let ref = React.useRef(null);

	return (
		<SearchBar
			ref={ ref }
			placeholder="Search"
			textColor={ appTheme.COLOR }
			hideBackground={ true }
			onChangeText={ (text) => {
				changeText(text);
				onSubmit(text);
			} }
			onSearchButtonPress={ () => {
				onSubmit(text);
				ref.current.blur();
			} }
			onCancelButtonPress={ () => onDismiss() }
		/>
	);
}

// Friend clickable item on list
function FriendItem(props) {
	let { data, appTheme, onPress, friendStatus, addFriend=()=>{}, acceptFriend=()=>{} } = props;
	let [ enemy, stats ] = data;

	let color = { color: appTheme.COLOR };
	let subColor = { color: appTheme.SUB_COLOR };
	let btnColor = { backgroundColor: appTheme.MENU_BACKGROUND };

	let winPercent = (stats.win * 100.0 / (stats.win + stats.lose)).toFixed(2);
	if (winPercent == 'NaN') winPercent = '--';

	let disabled = friendStatus != null && friendStatus != FRIEND.REQUEST_RECEIVED;
	let styleDisabled = disabled ? {
		backgroundColor: 'transparent'
	} : null;

	let text =
		friendStatus == FRIEND.REQUEST_SENT ? 'Requested' :
		friendStatus == FRIEND.REQUEST_RECEIVED ? 'Accept Friend' :
		friendStatus == FRIEND.FRIENDED ? '' :
		'+ Add Friend';

	let action = friendStatus == FRIEND.REQUEST_RECEIVED ? acceptFriend : addFriend;

	return (
		<ButtonVibe style={ styles.friendBox } onPress={ onPress }>
			<AutoHeightImage width={ matchSize } source={ enemy.photo ? { uri: enemy.photo + '=c' } : IMAGE.NEW_MATCH } style={ styles.friendImage }/>
			<View style={ styles.friendMiddle }>
				<TextVibe style={ [styles.friendName, color] }>{ enemy.name }</TextVibe>
				<TextVibe style={ [styles.friendStat, subColor] }>Win: { winPercent }%</TextVibe>
				<TextVibe style={ [styles.friendStat, subColor] }>Total: { stats.lose + stats.win }</TextVibe>
			</View>

			<ButtonVibe style={ [styles.addBtn, btnColor, styleDisabled] } disabled={ disabled } onPress={ () => action(enemy.user_id) }>
				<TextVibe style={ [styles.addBtnText, color] }>{ text }</TextVibe>
			</ButtonVibe>
		</ButtonVibe>
	);
}

function FriendModal(props) {
	let visible = props.data != null;
	let enemy = {};
	let stats = {};
	let onDismiss = props.onDismiss;
	let color = { color: props.appTheme.COLOR };

	if (visible) {
		[ enemy={}, stats={} ] = props.data;
	}

	return(
		<ModalVibe
			isVisible={ visible }
			onDismiss={ onDismiss }>
			<TextVibe style={ [styles.modalTitle, color] }>{ enemy.name }</TextVibe>
			<AutoHeightImage width={ vw(25) } source={ enemy.photo ? { uri: enemy.photo + '=c' } : IMAGE.NEW_MATCH }/>
		</ModalVibe>
	)
}


const styles = StyleSheet.create({
	view: {
		alignSelf: 'stretch',
		flex: 1,
		backgroundColor: '#1a283a',
	},

	friendBox: {
		flexDirection: 'row',
		width: vw(94),
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		marginBottom: vw(3),
		marginHorizontal: vw(3),
	},

		friendImage: {
			borderRadius: vw(),
		},

		friendName: {
			fontSize: vw(5),
			// marginLeft: vw(2),
		},

		friendMiddle: {
			height: matchSize,
			paddingLeft: vw(3),
			flex: 1,
		},

			friendStat: {
				color: 'grey',
			},

		addBtn: {
			backgroundColor: 'black',
			padding: vw(2),
		},

			addBtnText: {

			},

	modalTitle: {
		fontSize: vw(5),
	}
});
