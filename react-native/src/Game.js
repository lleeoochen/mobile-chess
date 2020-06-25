import BottomSheet from 'reanimated-bottom-sheet'

class Example extends React.Component {
	renderContent = () => (
		/* render */
	)

	renderHeader = () => (
		/* render */
	)

	render() {
		return (
			<View style={styles.container}>
				<BottomSheet
					snapPoints = {[450, 300, 0]}
					renderContent = {this.renderContent}
					renderHeader = {this.renderHeader}
				/>
		</View>)
	}
}
