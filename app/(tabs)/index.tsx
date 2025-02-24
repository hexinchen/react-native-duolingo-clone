import { View } from 'react-native';
import { Link } from 'expo-router';

import '@/global.css';

import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../../components/AppText';
import QuizScreen from '@/app/quiz';
import { SheetProvider } from 'react-native-actions-sheet';

export default function HomeScreen() {
	return (
		<SheetProvider>
			<SafeAreaView className='bg-owl-green h-screen flex flex-col justify-center items-center'>
				<View>
					<Link href='/quiz'>
						<AppText className='text-lg'>Start Quiz</AppText>
					</Link>
				</View>
			</SafeAreaView>
		</SheetProvider>
	);
}
