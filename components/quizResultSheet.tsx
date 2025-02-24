import { View, Text } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import AppText from './AppText';

function QuizResultSheet() {
	return (
		<ActionSheet>
			<View>
				<AppText className='text-2xl'>YAY</AppText>
			</View>
		</ActionSheet>
	);
}

export default QuizResultSheet;
