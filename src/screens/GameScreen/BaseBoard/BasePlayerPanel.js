import * as React from 'react';
import { StatusBar, View, SafeAreaView, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useSelector, shallowEqual } from 'react-redux';
import AutoHeightImage from 'react-native-auto-height-image';
import Store, { PopupStore } from 'chessvibe/src/redux/Store';

import * as Reducer from 'chessvibe/src/redux/Reducer';
import { vw, vh, formatTimer, formatImage } from 'chessvibe/src/Util';
import * as Const from 'chessvibe/src/Const';
import { ActionBar, WebVibe, TextVibe, ModalVibe, ButtonVibe } from 'chessvibe/src/widgets';

import BaseBoardGrid from './BaseBoardGrid';

const pictureSize = vw(15);
const margin_size = vw(1);
const cell_size = (vw(100) - 4 * margin_size) / 8;
const canvas_size = margin_size * 2 + cell_size * 8;

export default function BasePlayerPanel(props) {
	const { color, pos } = props;
	const theme = useSelector(state => state.game.theme);
	const match = useSelector(state => state.game.match) || {};
	const turn = useSelector(state => state.game.turn);

	let eaten = useSelector(state => state.game.eaten, (a, b) => {
		JSON.stringify(a) === JSON.stringify(b);
	});

	let player = null;
	let timer = 0;

	if (color == 'white') {
		player = useSelector(state => state.game.whitePlayer);
		eaten = (eaten && eaten[Const.TEAM.W]) ? eaten[Const.TEAM.W] : [];
		timer = useSelector(state => state.game.white_timer);
	}
	else {
		player = useSelector(state => state.game.blackPlayer);
		eaten = (eaten && eaten[Const.TEAM.B]) ? eaten[Const.TEAM.B] : [];
		timer = useSelector(state => state.game.black_timer);
	}

	let imageStyle = {
		borderRightWidth: margin_size,
		borderColor: color,
	};

	let titleStyle = {
		color: theme.NAME_TITLE_COLOR,
		fontSize: vw(5),
	};

	timer = timer == null ? Const.MAX_TIME : timer;
	let timerText =
		timer >= Const.MAX_TIME ? ''
		:
		timer <= 0 ? '00.00'
		:
		formatTimer(timer);

	let timerColor = {
		color: (turn == color.charAt(0).toUpperCase()) ? 'white' : 'darkgrey'
	};

	return (
		<View
			style={[
				styles.panel,
				pos == 'top' ? styles.topPanel : styles.bottomPanel,
				{ backgroundColor: theme.COLOR_UTILITY.MOBILE },
				{ borderColor: color }
			]}>
			<ButtonVibe style={ imageStyle } onPress={ () => PopupStore.openProfile(player) }>
				<AutoHeightImage
					width={ pictureSize }
					source={ formatImage(player ? player.photo : null) }/>
			</ButtonVibe>

			<View style={ styles.middleContainer }>
				<View style={ styles.middleTopContainer }>
					<TextVibe style={ titleStyle }>
						{ player && player.name ? player.name : "" }
					</TextVibe>
					<TextVibe style={ [titleStyle, timerColor] }>{ timerText }</TextVibe>
				</View>

				<ScrollView horizontal={ true } contentContainerStyle={ { alignSelf: 'center' } }>
					{
						eaten.map((img, i) => {
							return <AutoHeightImage key={i} width={ vw(5) } source={ img }/>
						})
					}
				</ScrollView>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({

	panel: {
		flex: 1,
		flexDirection: 'row',
		width: canvas_size,
		borderWidth: margin_size,
	},

		topPanel: {
			borderColor: 'white',
			borderBottomWidth: 0,
			borderTopLeftRadius: vw(0.75),
			borderTopRightRadius: vw(0.75),
		},
		bottomPanel: {
			borderColor: 'black',
			borderTopWidth: 0,
			borderBottomLeftRadius: vw(0.75),
			borderBottomRightRadius: vw(0.75),
		},

		middleContainer: {
			flex: 1,
			flexDirection: 'column',
			marginHorizontal: margin_size,
		},

			middleTopContainer: {
				flex: 1,
				flexDirection: 'row',
				justifyContent: 'space-between',
			},

				playerName: {
					color: 'white'
				}
});
