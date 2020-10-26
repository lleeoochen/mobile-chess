import * as React from 'react';
import { Animated, View, SafeAreaView, ScrollView, StyleSheet, StatusBar, Image, RefreshControl } from 'react-native';
import { TextVibe, ButtonVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import Store from 'chessvibe/src/redux/Store';

import { IMAGE, APP_THEME } from 'chessvibe/src/Const';
import { formatDate, vw, formatImage } from 'chessvibe/src/Util';
import Cache from 'chessvibe/src/Cache';

const matchSize = vw((100 - 2 - 6 - 4) / 4);
const borderRadius = vw();


// Navigation
HistoryTab.navigationOptions = () => {
	return {
		tabBarLabel: 'History',
		tabBarIcon: (
			<Image style={ styles.tab } source={ IMAGE['HISTORY' + (Store.getState().home.appThemeId === 'DARK' ? '' : '_DARK')] }/>
		)
	};
};

// Home Screen
export default function HistoryTab(props) {
	// Screen props from navigation
	const {
		appThemeId,
		oldMatches,
		navigateGame,
		refresh,
	} = props.navigation.getScreenProps();

	// const [ selectedMatch, selectMatch ] = React.useState(null);
	const appTheme = APP_THEME[appThemeId];
	const onRefresh = React.useCallback(() => refresh(), []);
	const [ refreshing ] = React.useState(false);
	const [matchesData, setMatchesData] = React.useState([]);

	React.useEffect(() => {
		setTimeout(() => setMatchesData(oldMatches), 500);
	}, [oldMatches]);

	// function deleteMatch(match_id) {
	// 	Backend.deleteMatch(match_id).then(async () => {
	// 		selectMatch(null);
	// 		refresh();
	// 	});
	// }

	let viewStyle = [styles.view, props.style, {
		backgroundColor: appTheme.CONTENT_BACKGROUND
	}];

	let titleStyle = [styles.matchesTitle, {
		color: appTheme.COLOR
	}];

	// Render function
	function render() {
		let $container = matchesData.length !== oldMatches.length ?
			oldMatches.map(({enemy}, i) => {
				return renderFakeMatches(enemy, i);
			})
			:
			matchesData.map(({enemy, matches}, i) => {
				return renderMatches(enemy, matches, i);
			});
		console.log($container);

		return (
			<SafeAreaView style={ viewStyle }>
				<StatusBar hidden={ true }/>

				<ScrollView
					contentContainerStyle={ styles.playerScroll }
					refreshControl={
						<RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } tintColor={ appTheme.COLOR } />
					}>
					{$container}
				</ScrollView>

				{/*
				<DialogVibe
					title={ 'Delete match?' }
					confirmBtnText={ 'Delete' }
					visible={ selectedMatch != null }
					onSuccess={ () => deleteMatch(selectedMatch) }
					onDismiss={ () => selectMatch(null) }/>
				*/}
			</SafeAreaView>
		);
	}

	// ====================== Functions ======================

	function renderFakeMatches(enemy, enemyIndex) {
		return (
			<View key={enemyIndex} style={[styles.playerBox]}>
				<TextVibe style={titleStyle}>{enemy.name}</TextVibe>
				<ScrollView horizontal={ true }>
					{ renderMatch({}, '', {}, 0, 0) }
				</ScrollView>
			</View>
		);
	}


	// Render recent matches
	function renderMatches(enemy, matches, enemyIndex) {
		let $matches = [];
		let matchIndex = 0;
		let customFadein = getFadeinAnimation(enemyIndex);

		matches.forEach((match) => {
			let [match_name, match_data] = match;
			$matches.push(
				renderMatch(enemy, match_name, match_data, enemyIndex, matchIndex++)
			);
			Cache.theme[match_name] = match_data.theme;
		});

		return (
			<View key={enemyIndex} style={[styles.playerBox]}>
				<TextVibe style={ titleStyle }>{ enemy.name }</TextVibe>
				<Animated.View style={ [{ opacity: customFadein }] }>
					<ScrollView horizontal={ true }>
						{ $matches }
					</ScrollView>
				</Animated.View>
			</View>
		);
	}

	function renderMatch(enemy, matchName, matchData, enemyIndex, matchIndex) {
		let active = false, updated_date = '', colorStyle = styles.greyColor;
		let customFadein = getFadeinAnimation(enemyIndex, matchIndex);

		if (matchData.moves) {
			active = Math.floor(matchData.moves[matchData.moves.length - 1] / 10) != 0;
			colorStyle = active ? styles.greenColor : styles.greyColor;
		}

		if (matchData.updated) {
			updated_date = formatDate(new Date(matchData.updated), '%M/%D');
		}

		return (
			<Animated.View key={matchIndex} style={{ opacity: customFadein }}>
				<ButtonVibe
					style={styles.matchView}
					onPress={() => navigateGame(matchName)}
					onLongPress={() => selectMatch(matchName)}>

					<AutoHeightImage
						width={matchSize}
						source={formatImage(enemy.photo)}
						style={styles.matchImg}/>

					<View style={{ ...styles.matchDate, ...colorStyle }}>
						<TextVibe>{updated_date}</TextVibe>
					</View>
				</ButtonVibe>
			</Animated.View>
		);
	}

	function getFadeinAnimation(enemyIndex=0, matchIndex=0) {
		const ENEMY_DELAY = 200;
		const MATCH_DELAY = 500;
		const duration = ENEMY_DELAY * enemyIndex + MATCH_DELAY * matchIndex + 500;

		let fadein = new Animated.Value(0);
		Animated.timing(fadein, {
			toValue: 1,
			duration,
			useNativeDriver: true,
		}).start();

		return fadein;
	}


	// ====================== Functions ======================


	// Render
	return render();
}

const tab_size = vw(7);

const styles = StyleSheet.create({
	view: {
		alignSelf: 'stretch',
		flex: 1,
		backgroundColor: '#1a283a',
	},

	tab: {
		width: tab_size,
		height: tab_size,
		marginTop: 'auto',
		marginBottom: 'auto',
	},

		playerBox: {
			width: '100%',
			padding: '3%',
			borderRadius: borderRadius,
			marginBottom: vw(),
		},

			matchesTitle: {
				fontSize: 20,
				color: 'white',
				paddingBottom: vw(2),
			},

			matchView: {
				width: matchSize,
				marginRight: vw(2),
				borderRadius: borderRadius,
				shadowColor: '#000',
				shadowOffset: {
					width: 0,
					height: 1,
				},
				shadowOpacity: 0.22,
				shadowRadius: 2.22,

				elevation: 3,
			},

				matchImg: {
					borderTopLeftRadius: vw(1),
					borderTopRightRadius: vw(1),
				},

				matchDate: {
					alignItems: 'center',
					width: '100%',
					borderBottomLeftRadius: vw(1),
					borderBottomRightRadius: vw(1),
				},

					greenColor: { backgroundColor: '#56be68' },
					greyColor: { backgroundColor: '#7f7f7f' },
});
