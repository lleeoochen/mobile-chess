import * as React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { TEAM, DB_REQUEST_ASK, DIALOG } from 'chessvibe/src/Const';
import { DialogVibe } from 'chessvibe/src/widgets';
import Backend from 'chessvibe/src/GameBackend';

export default function UtilityDialogs(props) {
	const {
		resignHook,
		drawHook,
		undoHook,
		inviteHook,
		chatHook,
	} = props;

	const [ resignState, setResignState ] = resignHook;
	const [ drawState, setDrawState ] = drawHook;
	const [ undoState, setUndoState ] = undoHook;
	const [ inviteState, setInviteState ] = inviteHook;
	const [ chatState, setChatState ] = chatHook;

	const theme = useSelector(state => state.theme);
	const game = useSelector(state => state.game);
	const blackPlayer = useSelector(state => state.blackPlayer) || {};
	const whitePlayer = useSelector(state => state.whitePlayer) || {};


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
		Backend.undo();
		setUndoState(DIALOG.CLOSING);
	}


	function switchModal() {
		if (resignState == DIALOG.CLOSING) setResignState(DIALOG.HIDE);
		if (drawState == DIALOG.CLOSING) setDrawState(DIALOG.HIDE);
		if (undoState == DIALOG.CLOSING) setUndoState(DIALOG.HIDE);
		if (inviteState == DIALOG.CLOSING) setInviteState(DIALOG.HIDE);
		if (chatState == DIALOG.CLOSING) setChatState(DIALOG.HIDE);

		if (resignState == DIALOG.REQUEST_SHOW) setResignState(DIALOG.SHOW);
		else if (drawState == DIALOG.REQUEST_SHOW) setDrawState(DIALOG.SHOW);
		else if (undoState == DIALOG.REQUEST_SHOW) setUndoState(DIALOG.SHOW);
		else if (inviteState == DIALOG.REQUEST_SHOW) setInviteState(DIALOG.SHOW);
		else if (chatState == DIALOG.REQUEST_SHOW) setChatState(DIALOG.SHOW);
	}

	// Undo dialog show/hide
	if (undoState == DIALOG.HIDE) {
		let undoModalShow = game != null && game.match != null;

		if (undoModalShow) {
			let { team, match } = game;
			undoModalShow = (
				team == TEAM.B && match.white_undo == DB_REQUEST_ASK ||
				team == TEAM.W && match.black_undo == DB_REQUEST_ASK
			);
		}

		if (undoModalShow) {
			setUndoState(DIALOG.REQUEST_SHOW);
		}
	}

	// Draw dialog show/hide
	if (drawState == DIALOG.HIDE) {
		let drawModalShow = game != null && game.match != null;

		if (drawModalShow) {
			let { team, match } = game;
			drawModalShow = (
				team == TEAM.B && match.white_draw == DB_REQUEST_ASK ||
				team == TEAM.W && match.black_draw == DB_REQUEST_ASK
			);
		}

		if (drawModalShow) {
			setDrawState(DIALOG.REQUEST_SHOW);
		}
	}

	console.log("===================");
	console.log(resignState, drawState, undoState, inviteState, chatState);

	if (resignState != DIALOG.SHOW && drawState != DIALOG.SHOW && undoState != DIALOG.SHOW && inviteState != DIALOG.SHOW && chatState != DIALOG.SHOW &&
		resignState != DIALOG.CLOSING && drawState != DIALOG.CLOSING && undoState != DIALOG.CLOSING && inviteState != DIALOG.CLOSING && chatState != DIALOG.CLOSING) {
		if (resignState == DIALOG.REQUEST_SHOW) {
			setResignState(DIALOG.SHOW);
		}
		else if (drawState == DIALOG.REQUEST_SHOW) {
			setDrawState(DIALOG.SHOW);
		}
		else if (undoState == DIALOG.REQUEST_SHOW) {
			setUndoState(DIALOG.SHOW);
		}
		else if (inviteState == DIALOG.REQUEST_SHOW) {
			setInviteState(DIALOG.SHOW);
		}
		else if (chatState == DIALOG.REQUEST_SHOW) {
			setChatState(DIALOG.SHOW);
		}
	}

	let enemy = game.enemy == TEAM.W ? whitePlayer : blackPlayer;

	return (
		<View>
			<DialogVibe
				title={ 'Are you sure you want to resign match?' }
				confirmBtnText={ 'Resign Match' }
				theme={ theme }
				visible={ resignState == DIALOG.SHOW }
				onDismiss={ () => setResignState(DIALOG.CLOSING) }
				onSuccess={ () => resign() }
				onModalHide={ () => switchModal() }/>

			<DialogVibe
				title={ (enemy.name || 'Opponent') + ' is asking for a draw. Confirm?' }
				confirmBtnText={ 'Draw Match' }
				theme={ theme }
				visible={ drawState == DIALOG.SHOW }
				onDismiss={ () => cancelDraw() }
				onSuccess={ () => acceptDraw() }
				onModalHide={ () => switchModal() }/>

			<DialogVibe
				title={ (enemy.name || 'Opponent') + ' is asking for your mercy.' }
				confirmBtnText={ 'Undo Move' }
				theme={ theme }
				visible={ undoState == DIALOG.SHOW }
				onDismiss={ () => cancelMercy() }
				onSuccess={ () => acceptMercy() }
				onModalHide={ () => switchModal() }/>

			<DialogVibe
				title={ 'Invite Link Copied!' }
				confirmBtnText={ 'Okay' }
				showCancelBtn={ false }
				theme={ theme }
				visible={ inviteState == DIALOG.SHOW }
				onDismiss={ () => setInviteState(DIALOG.CLOSING) }
				onSuccess={ () => setInviteState(DIALOG.CLOSING) }
				onModalHide={ () => switchModal() }/>

			<DialogVibe
				title={ 'Message Copied!' }
				confirmBtnText={ 'Okay' }
				showCancelBtn={ false }
				theme={ theme }
				visible={ chatState == DIALOG.SHOW }
				onDismiss={ () => setChatState(DIALOG.CLOSING) }
				onSuccess={ () => setChatState(DIALOG.CLOSING) }
				onModalHide={ () => switchModal() }/>
		</View>
	);
}