import * as React from 'react';
import { StatusBar, View, SafeAreaView, Text, Image, StyleSheet } from 'react-native';
import { useSelector, shallowEqual } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Store from 'chessvibe/src/redux/Store';
import * as Reducer from 'chessvibe/src/redux/Reducer';
import { vw, vh, strict_equal } from 'chessvibe/src/Util';
import * as Const from 'chessvibe/src/Const';


export default function BaseBorder(props) {
	const { stats, team, enemy, downward } = useSelector(state => {
		return {
			stats: state.game.stats,
			team: state.game.team,
			enemy: state.game.enemy,
			downward: state.game.downward,
		};
	}, strict_equal);

	// Render
	let ratio = 0.5;
	let colors = ['white', 'black'];

	if (stats && team && enemy) {
		let raw_ratio = stats[enemy] / (stats[team] + stats[enemy]);
		ratio = 0.35 * Math.atan(10 * raw_ratio - 5) + 0.5;

		let blackTop = team == Const.TEAM.W ? !downward : downward;
		colors = blackTop ? ['black', 'white'] : ['white', 'black'];
	}

	return (
		<LinearGradient
			locations={ [ratio, ratio] }
			colors={ colors }
			style={ [props.style] }>
		</LinearGradient>
	);
}
