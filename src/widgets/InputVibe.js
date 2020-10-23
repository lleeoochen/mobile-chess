import * as React from 'react';
import { View, TextInput } from 'react-native';

export default function InputVibe(props) {
	let {
		style={},
		initValue,
		placeholder,
		onSubmitText=() => {},
		onChangeText=() => {},
		hidden=false,
		multiline=false,
		blurOnSubmit=false,
	} = props;
	let { fontSize=20 } = style;

	const [ value, changeText ] = React.useState(initValue || placeholder);

	let inputStyle = {
		fontSize,
		fontFamily: 'Spectral',
		flex: 1,
		color: value == placeholder ? '#7b7b7b' : style.color || 'white',
		textAlignVertical: 'top',
	};

	let wrapStyle = {...{
		height: Platform.OS === 'android' ? fontSize * 2 * 1.2 : fontSize * 2,
		paddingLeft: fontSize / 3,
	}, ...style};

	if (hidden) {
		return (<View/>);
	}

	return (
		<View style={ wrapStyle }>
			<TextInput
				style={ inputStyle }
				onChangeText={ text => {
					changeText(text);
					onChangeText(text);
				}}
				onSubmitEditing={ () => {
					changeText('');
					if (value != '') {
						onSubmitText(value);
					}
				}}
				onFocus={ () => {
					if (value == placeholder)
						changeText('');
				}}
				onBlur={ () => {
					if (value == '')
						changeText(placeholder);
				}}
				enablesReturnKeyAutomatically={ true }
				keyboardAppearance={ 'dark' }
				placeholderTextColor={ 'white' }
				returnKeyType={ 'send' }
				scrollEnabled={ true }
				blurOnSubmit={ blurOnSubmit }
				multiline={ multiline }
				value={ value }/>
		</View>
	);
}
