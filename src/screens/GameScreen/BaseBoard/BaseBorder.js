import * as React from 'react';
import { StatusBar, View, SafeAreaView, Text, Image, StyleSheet } from 'react-native';
import { useSelector, shallowEqual } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Store from 'chessvibe/src/redux/Store';
import * as Reducer from 'chessvibe/src/redux/Reducer';
import { vw, vh, strict_equal } from 'chessvibe/src/Util';
import * as Const from 'chessvibe/src/Const';


export default function BaseBorder(props) {
	const team = useSelector(state => state.game.team);
	const enemy = useSelector(state => state.game.enemy);
	const downward = useSelector(state => state.game.downward);
	const stats = useSelector(state => state.game.stats, strict_equal);


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


const styles = StyleSheet.create({
});
