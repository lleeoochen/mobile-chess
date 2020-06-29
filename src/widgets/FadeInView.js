import * as React from 'react';
import { Animated } from 'react-native';


export default function FadeInView(props) {
	const fadeAnim = React.useRef(new Animated.Value(0)).current;

	React.useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: props.duration || 1000,
			useNativeDriver: true
		}).start();
	}, [])

	return (
		<Animated.View
			style={{
				...props.style,
				opacity: fadeAnim,
			}}>
			{props.children}
		</Animated.View>
	);
}
