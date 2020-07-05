import * as React from 'react';
import { StatusBar, View, SafeAreaView, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useSelector, shallowEqual } from 'react-redux';
import AutoHeightImage from 'react-native-auto-height-image';
import Store from 'chessvibe/src/redux/Store';

import * as Reducer from 'chessvibe/src/redux/Reducer';
import { vw, vh } from 'chessvibe/src/Util';
import * as Const from 'chessvibe/src/Const';
import { ActionBar, WebVibe, TextVibe, ModalVibe } from 'chessvibe/src/widgets';

import BaseBoardGrid from './_BaseBoardGrid';

var new_match_img = require('chessvibe/assets/new_match.png');

const pictureSize = vw(15);
const margin_size = vw(1);
const cell_size = (vw(100) - 4 * margin_size) / 8;
const canvas_size = margin_size * 2 + cell_size * 8;

export default function BasePlayerPanel(props) {
	const { color, pos } = props;
	const theme = useSelector(state => state.theme);

	let eaten = useSelector(state => state.game.eaten, (a, b) => {
		JSON.stringify(a) === JSON.stringify(b);
	});

	let player = null;
	if (color == 'white') {
		player = useSelector(state => state.whitePlayer);
		eaten = (eaten && eaten[Const.TEAM.W]) ? eaten[Const.TEAM.W] : [];
	}
	else {
		player = useSelector(state => state.blackPlayer);
		eaten = (eaten && eaten[Const.TEAM.B]) ? eaten[Const.TEAM.B] : [];
	}

	let imageStyle = {
		borderRightWidth: margin_size,
		borderColor: color,
	};

	let titleStyle = {
		color: theme.NAME_TITLE_COLOR,
		fontSize: vw(5),
	};

	console.log(eaten);

	return (
		<View
			style={[
				styles.panel,
				pos == 'top' ? styles.topPanel : styles.bottomPanel,
				{ backgroundColor: theme.COLOR_UTILITY.MOBILE },
				{ borderColor: color }
			]}>
			<View style={ imageStyle }>
				<AutoHeightImage
					width={ pictureSize }
					source={ player && player.photo ? { uri: player.photo + '=c' } : new_match_img }/>
			</View>

			<View style={ styles.middleContainer }>
				<TextVibe style={ titleStyle }>
					{ player && player.name ? player.name : "" }
				</TextVibe>

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
		backgroundColor: 'orange',
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

		playerName: {
			color: 'white'
		}
});
