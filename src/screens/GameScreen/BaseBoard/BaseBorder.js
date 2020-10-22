import * as React from 'react';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import * as Const from 'chessvibe/src/Const';

export default function BaseBorder(props) {
	const { stats, team, enemy, downward } = useSelector(state => {
		return {
			stats: state.game.stats,
			team: state.game.team,
			enemy: state.game.enemy,
			downward: state.game.downward,
		};
	});

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
