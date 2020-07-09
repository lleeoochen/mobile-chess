import * as React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { getWinMessage } from 'chessvibe/src/Util';
import { TEAM, DB_REQUEST_ASK, DIALOG } from 'chessvibe/src/Const';
import { DialogVibe } from 'chessvibe/src/widgets';
import Backend from 'chessvibe/src/GameBackend';

export default function UtilityDialogs(props) {
	// Props
	const {
		resignHook,
		drawHook,
		undoHook,
		inviteHook,
		chatHook,
		endingHook,
	} = props;

	// Hook variables
	const [ resignState, setResignState ] = resignHook;
	const [ drawState, setDrawState ] = drawHook;
	const [ undoState, setUndoState ] = undoHook;
	const [ inviteState, setInviteState ] = inviteHook;
	const [ chatState, setChatState ] = chatHook;
	const [ endingState, setEndingState ] = endingHook;
	const dialogHooks = Object.values(props);

	// Game variables
	const theme = useSelector(state => state.theme);
	const game = useSelector(state => state.game);
	const blackPlayer = useSelector(state => state.blackPlayer) || {};
	const whitePlayer = useSelector(state => state.whitePlayer) || {};
	const enemy = game.enemy == TEAM.W ? whitePlayer : blackPlayer;
	const winMessage = getWinMessage(game.match);



	function resign() {
		Backend.resign(game.team == TEAM.W ? TEAM.B : TEAM.W);
		setResignState(DIALOG.CLOSING);
	}

	function cancelDraw() {
		Backend.cancelDraw().then(() => {
			setDrawState(DIALOG.CLOSING);
		});
	}

	function cancelMercy() {
		Backend.cancelUndo().then(() => {
			setUndoState(DIALOG.CLOSING);
		});
	}

	function acceptDraw() {
		Backend.draw().then(() => {
			setDrawState(DIALOG.CLOSING);
		});
	}

	function acceptMercy() {
		Backend.undoMove().then(() => {
			setUndoState(DIALOG.CLOSING);
		});
	}



	// Render
	showDialogOnIdle(dialogHooks);

	return (
		<View>
			<DialogVibe
				title={ 'Are you sure you want to resign match?' }
				confirmBtnText={ 'Resign Match' }
				theme={ theme }
				visible={ resignState == DIALOG.SHOW }
				onDismiss={ () => setResignState(DIALOG.CLOSING) }
				onSuccess={ () => resign() }
				onModalHide={ () => switchDialog(dialogHooks) }/>

			<DialogVibe
				title={ (enemy.name || 'Opponent') + ' is asking for a draw. Confirm?' }
				confirmBtnText={ 'Draw Match' }
				theme={ theme }
				visible={ drawState == DIALOG.SHOW }
				onDismiss={ () => cancelDraw() }
				onSuccess={ () => acceptDraw() }
				onModalHide={ () => switchDialog(dialogHooks) }/>

			<DialogVibe
				title={ (enemy.name || 'Opponent') + ' is asking for your mercy.' }
				confirmBtnText={ 'Undo Move' }
				theme={ theme }
				visible={ undoState == DIALOG.SHOW }
				onDismiss={ () => cancelMercy() }
				onSuccess={ () => acceptMercy() }
				onModalHide={ () => switchDialog(dialogHooks) }/>

			<DialogVibe
				title={ 'Invite Link Copied!' }
				showCancelBtn={ false }
				showConfirmBtn={ false }
				theme={ theme }
				visible={ inviteState == DIALOG.SHOW }
				onDismiss={ () => setInviteState(DIALOG.CLOSING) }
				onSuccess={ () => setInviteState(DIALOG.CLOSING) }
				onModalHide={ () => switchDialog(dialogHooks) }/>

			<DialogVibe
				title={ 'Message Copied!' }
				showCancelBtn={ false }
				showConfirmBtn={ false }
				theme={ theme }
				visible={ chatState == DIALOG.SHOW }
				onDismiss={ () => setChatState(DIALOG.CLOSING) }
				onSuccess={ () => setChatState(DIALOG.CLOSING) }
				onModalHide={ () => switchDialog(dialogHooks) }/>

			<DialogVibe
				title={ winMessage }
				showCancelBtn={ false }
				showConfirmBtn={ false }
				theme={ theme }
				visible={ endingState == DIALOG.SHOW }
				onDismiss={ () => setEndingState(DIALOG.CLOSING) }
				onSuccess={ () => setEndingState(DIALOG.CLOSING) }
				onModalHide={ () => switchDialog(dialogHooks) }/>
		</View>
	);
}


// Switch between dialogs
function switchDialog(dialogHooks) {
	for (let hook of dialogHooks) {
		if (hook[0] == DIALOG.CLOSING) {
			hook[1](DIALOG.HIDE);
		}
	}

	for (let hook of dialogHooks) {
		if (hook[0] == DIALOG.REQUEST_SHOW) {
			hook[1](DIALOG.SHOW);
			break;
		}
	}
}

// Open requesting dialog if idle
function showDialogOnIdle(dialogHooks) {
	let openDialogSafe = Object.values(dialogHooks).every(hook => hook[0] != DIALOG.SHOW && hook[0] != DIALOG.CLOSING);
	if (openDialogSafe) {
		for (let hook of dialogHooks) {
			if (hook[0] == DIALOG.REQUEST_SHOW) {
				hook[1](DIALOG.SHOW);
				break;
			}
		}
	}
}
