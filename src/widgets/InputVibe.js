import * as React from 'react';
import { View, TextInput, StyleSheet, ScrollView } from 'react-native';
import { vw, vh } from 'chessvibe/src/Util';


export default function InputVibe(props) {
	let { style, placeholder, onSubmitText } = props;
	let { fontSize } = style;

	const [ value, changeText ] = React.useState(placeholder);
	const contentRef = React.useRef();

	let inputStyle = {
		fontSize,
		fontFamily: 'Spectral',
		flex: 1,
		color: 'white',
	};

	let wrapStyle = {...{
		height: fontSize * 1.6,
		paddingLeft: fontSize / 3,
	}, ...style};

	return (
		<View style={ wrapStyle }>
			<TextInput
				style={ inputStyle }
				onChangeText={ text => changeText(text) }
				onSubmitEditing={ () => {
					if (value != '') {
						onSubmitText(value);
					}
					changeText('');
				}}
				onFocus={ () => {
					if (value == placeholder)
						changeText('');
				}}
				onBlur={ () => {
					if (value == '')
						changeText(placeholder);
				}}
				keyboardAppearance={ 'dark' }
				placeholderTextColor={ 'white' }
				returnKeyType={ 'send' }
				scrollEnabled={ true }
				blurOnSubmit={ false }
				value={ value }/>
		</View>
	);
}
