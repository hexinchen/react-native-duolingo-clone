import {
	View,
	Text,
	Pressable,
	StyleSheet,
	Platform,
	TextLayoutEventData,
	NativeSyntheticEvent,
	LayoutChangeEvent,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import CloseIcon from '@/assets/icons/close.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Router, useRouter } from 'expo-router';
import AppText from './components/AppText';
import LottieView from 'lottie-react-native';
import { Colors } from '@/constants/Colors';
import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
import { twMerge } from 'tailwind-merge';

interface Word {
	id: string;
	selected: boolean;
	displayText: string;
}

function WordWrapWithDividers({ words }: { words: string[] }) {
	const [lines, setLines] = useState<string[]>([]);
	const textRef = useRef<Text>(null);

	const handleTextLayout = (event: any) => {
		console.log('lines: ', event.nativeEvent.lines);
		setLines(event.nativeEvent.lines.map((line: any) => line.text));
	};

	return (
		<View style={styles.container}>
			<Text ref={textRef} onTextLayout={handleTextLayout} className='text-2xl'>
				{words.join(' ')} {/* Join words with spaces for wrapping */}
			</Text>
		</View>
	);
}

function QuizScreen() {
	const router: Router = useRouter();
	const question: string[] = [
		'Hallo',
		', ',
		' ',
		'kommst',
		' ',
		'du',
		' ',
		'aus',
		' ',
		'Frankreich',
		'?',
	];
	const [choiceBank, setChoiceBank] = useState<Word[]>(
		[
			'the',
			'from',
			'Hello',
			'Nina',
			'France',
			'brother',
			'do',
			'come',
			'smart',
			'you',
		].map((word) => ({ selected: false, displayText: word, id: nanoid() }))
	);
	const [selectedWords, setSelectedWords] = useState<Word[]>(
		[
			'the',
			'from',
			'Hello',
			'Nina',
			'France',
			'brother',
			'do',
			'come',
			'smart',
			'you',
		].map((word) => ({ selected: false, displayText: word, id: nanoid() }))
	);
	const [dividerCount, setDividerCount] = useState(0);

	const questionElement: React.JSX.Element[] = question.map((word) => (
		<AppText key={nanoid()} className='text-eel text-2xl my-2 '>
			{word}
		</AppText>
	));
	const selectedWordsElement: React.JSX.Element = (
		<AppText
			className='text-2xl'
			onTextLayout={(event: NativeSyntheticEvent<TextLayoutEventData>) =>
				setDividerCount(event.nativeEvent.lines.length)
			}
		>
			{choiceBank.map((word) => word.displayText).join(' ')}
		</AppText>
	);

	const choiceBankElement: React.JSX.Element[] = choiceBank.map((word) => (
		<Pressable
			key={word.id}
			disabled={word.selected}
			className={twMerge(
				'border-2 border-b-4 border-swan rounded-2xl p-2 m-2',
				word.selected && 'bg-swan'
			)}
			onPress={() => onWordChoicePress(word.id)}
		>
			<AppText
				className={twMerge(
					'text-2xl',
					word.selected ? 'text-swan' : 'text-eel'
				)}
			>
				{word.displayText}
			</AppText>
		</Pressable>
	));

	function onWordDeselect(id: string) {
		const selectedWord = choiceBank.find((word) => word.id === id);

		if (selectedWord) {
			setSelectedWords((prev) => prev.filter((word) => word.id !== id));
			setChoiceBank((prev) =>
				prev.map((word) =>
					word.id === id ? { ...word, selected: false } : word
				)
			);
		}
	}

	function onWordChoicePress(id: string) {
		const selectedWord = choiceBank.find((word) => word.id === id);

		if (selectedWord) {
			setSelectedWords((prev) => [...prev, selectedWord]);
			setChoiceBank((prev) =>
				prev.map((word) =>
					word.id === id ? { ...word, selected: true } : word
				)
			);
		}
	}

	return (
		<SafeAreaView className='bg-white h-full flex flex-col justify-between px-5'>
			<Pressable className='p-1' onPress={() => router.push('/')}>
				<CloseIcon width={28} height={28} />
			</Pressable>
			<AppText className='font-bold text-3xl'>Translate this sentence</AppText>
			<View id='question' className='flex flex-row justify-start flex-wrap'>
				{/* Section: Question line */}
				<Pressable
					className='bg-macaw h-10 w-10 p-1 mr-2 flex justify-center items-center border-transparent border-2 rounded-xl'
					style={styles.speakerIconButton}
				>
					<LottieView
						autoPlay
						loop={false}
						style={{
							width: 32,
							height: 32,
							backgroundColor: 'transparent',
						}}
						source={require('@/assets/lotties/animatedSpeaker.json')}
					/>
				</Pressable>
				{questionElement}
			</View>
			<View className='flex flex-row flex-wrap'>
				{/* Section:  blank lines that hold user's choice of words*/}
				{selectedWordsElement}
			</View>
			<View className='flex flex-row flex-wrap'>
				{/* Section: word choices */}
				{choiceBankElement}
				<Text style={{ fontSize: 16 }}>
					This is some{' '}
					<Text style={{ fontWeight: 'bold', fontSize: 20 }}>bold</Text> text
					and some <Text style={{ color: 'red' }}>red</Text> text.
				</Text>
			</View>
			<Pressable
				className='bg-owl-green flex flex-row justify-center items-center rounded-3xl h-fit p-4'
				style={styles.checkButton}
			>
				<AppText className='text-white text-2xl'>CHECK</AppText>
			</Pressable>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	speakerIconButton: {
		shadowColor: Colors.whale, // Shadow color
		shadowOffset: { width: 0, height: 5 }, // Shadow offset (x, y)
		shadowOpacity: 1, // Shadow opacity
		shadowRadius: 0,
	},
	checkButton: {
		shadowColor: Colors['tree-frog'], // Shadow color
		shadowOffset: { width: 0, height: 5 }, // Shadow offset (x, y)
		shadowOpacity: 1, // Shadow opacity
		shadowRadius: 0,
	},
	container: {
		width: '90%', // Or whatever width you want
		margin: 20,
	},
	text: {
		// Other text styles if needed
	},
	divider: {
		width: '100%',
		height: 1,
		backgroundColor: 'gray',
		marginTop: 5,
		marginBottom: 5,
	},
});

export default QuizScreen;
