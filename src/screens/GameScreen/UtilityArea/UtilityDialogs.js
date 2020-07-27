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
		setResignState(DIALOG.HIDE);
	}

	function cancelDraw() {
		Backend.cancelDraw().then(() => {
			setDrawState(DIALOG.HIDE);
		});
	}

	function cancelMercy() {
		Backend.cancelUndo().then(() => {
			setUndoState(DIALOG.HIDE);
		});
	}

	function acceptDraw() {
		Backend.draw().then(() => {
			setDrawState(DIALOG.HIDE);
		});
	}

	function acceptMercy() {
		Backend.undoMove().then(() => {
			setUndoState(DIALOG.HIDE);
		});
	}


	// Render
	return (
		<View>
			<DialogVibe
				title={ (enemy.name || 'Opponent') + ' is asking for your mercy.' }
				confirmBtnText={ 'Undo Move' }
				theme={ theme }
				visible={ undoState == DIALOG.REQUEST_SHOW }
				onDismiss={ () => cancelMercy() }
				onSuccess={ () => acceptMercy() }/>

			<DialogVibe
				title={ (enemy.name || 'Opponent') + ' is asking for a draw. Confirm?' }
				confirmBtnText={ 'Draw Match' }
				theme={ theme }
				visible={ drawState == DIALOG.REQUEST_SHOW }
				onDismiss={ () => cancelDraw() }
				onSuccess={ () => acceptDraw() }/>

			<DialogVibe
				title={ 'Are you sure you want to resign match?' }
				confirmBtnText={ 'Resign Match' }
				theme={ theme }
				visible={ resignState == DIALOG.REQUEST_SHOW }
				onDismiss={ () => setResignState(DIALOG.HIDE) }
				onSuccess={ () => resign() }/>

			<DialogVibe
				title={ 'Invite Link Copied!' }
				showCancelBtn={ false }
				showConfirmBtn={ false }
				theme={ theme }
				visible={ inviteState == DIALOG.REQUEST_SHOW }
				onDismiss={ () => setInviteState(DIALOG.HIDE) }
				onSuccess={ () => setInviteState(DIALOG.HIDE) }/>

			<DialogVibe
				title={ 'Message Copied!' }
				showCancelBtn={ false }
				showConfirmBtn={ false }
				theme={ theme }
				visible={ chatState == DIALOG.REQUEST_SHOW }
				onDismiss={ () => setChatState(DIALOG.HIDE) }
				onSuccess={ () => setChatState(DIALOG.HIDE) }/>

			<DialogVibe
				title={ winMessage }
				showCancelBtn={ false }
				showConfirmBtn={ false }
				theme={ theme }
				visible={ endingState == DIALOG.REQUEST_SHOW }
				onDismiss={ () => setEndingState(DIALOG.HIDE) }
				onSuccess={ () => setEndingState(DIALOG.HIDE) }/>
		</View>
	);
}
