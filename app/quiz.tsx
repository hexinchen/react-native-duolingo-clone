import {
	View,
	Pressable,
	StyleSheet,
	Platform,
	LayoutChangeEvent,
	Dimensions,
	ScaledSize,
	FlatList,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import CloseIcon from '@/assets/icons/close.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Router, useRouter } from 'expo-router';
import AppText from '../components/AppText';
import LottieView from 'lottie-react-native';
import { Colors } from '@/constants/Colors';
import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
import { twMerge } from 'tailwind-merge';

import { useFonts } from 'expo-font';
import { debounce } from 'lodash';
import { remToPx } from '@/utils/utils';
import { Word, Row } from '@/interfaces/quiz';
import { quizzes } from '@/data/quizData';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { BottomSheet } from '@/components/BottomSheet';

import useSoundManager from '@/hooks/useSoundManager';
import useWindowSizeChange from '@/hooks/useWindowSizeChange';
import * as Haptics from 'expo-haptics';

function QuizScreen() {
	const { sounds, playSound } = useSoundManager();
	const animation = useRef<LottieView>(null);
	const [loaded, error] = useFonts({
		'DINRoundPro-Light': require('@/assets/fonts/din-round-light.ttf'),
	});

	if (!loaded && !error) {
		return null;
	}
	const isResultSheetOpen = useSharedValue(false);
	const translateX = useSharedValue(0);
	const [index, setIndex] = useState(0);
	const [isCorrect, setIsCorrect] = useState(false);
	const router: Router = useRouter();
	const horizonalPaddingRem = 1.25;
	const [choiceBank, setChoiceBank] = useState<Word[]>(
		quizzes[index].choiceBank.map((word) => ({
			selected: false,
			displayText: word,
			id: nanoid(),
			buttonWidth: 0,
		}))
	);

	const [rowCount, setRowCount] = useState(
		Dimensions.get('window').width < 390
			? 3
			: Dimensions.get('window').width < 598
			? 2
			: 1
	);

	const [rowsData, setRowsData] = useState<Row[]>([]);
	const [singleDividerWidth, setSingleDividerWidth] = useState(
		Platform.OS === 'web'
			? Dimensions.get('window').width
			: Dimensions.get('window').width - 2 * remToPx(horizonalPaddingRem)
	);

	const debouncedHandleWindowChange = debounce((window: ScaledSize) => {
		console.log('window size changed!');
		setSingleDividerWidth(
			Platform.OS === 'web'
				? Dimensions.get('window').width
				: Dimensions.get('window').width - 2 * remToPx(horizonalPaddingRem)
		);
		setRowCount(window.width < 390 ? 3 : window.width < 598 ? 2 : 1);
	}, 700);

	useWindowSizeChange(debouncedHandleWindowChange);

	useEffect(() => {
		console.log('index: ', index);
		const rowsData: Row[] = [];
		for (let i = 0; i < rowCount; i++) {
			rowsData.push({
				id: i.toString(),
				words: [],
				remainingWidth: singleDividerWidth,
				isWidthLocked: false,
			});
		}
		setRowsData([...rowsData]);
		setChoiceBank(
			quizzes[index].choiceBank.map((word) => ({
				selected: false,
				displayText: word,
				id: nanoid(),
				buttonWidth: 0,
			}))
		);
		setIsCorrect(false);
		animation.current?.reset();
		animation.current?.play();
	}, [rowCount, index]);

	const questionElement: React.JSX.Element[] = quizzes[index].question.map(
		(word) => (
			<AppText
				key={nanoid()}
				className='text-eel text-2xl my-2'
				style={styles.wordButtonText}
			>
				{word.display}
			</AppText>
		)
	);

	function setButtonWidth(event: LayoutChangeEvent, id: string): void {
		const width: number = event.nativeEvent?.layout.width;

		if (width > 0) {
			setChoiceBank((prev) =>
				prev.map((item) =>
					item.id === id && item.buttonWidth !== width
						? { ...item, buttonWidth: width }
						: item
				)
			);
		}
	}

	const choiceBankElement: React.JSX.Element[] = choiceBank.map((word) => (
		<Pressable
			key={word.id}
			onLayout={(event: LayoutChangeEvent) => setButtonWidth(event, word.id)}
			disabled={word.selected}
			className={twMerge(wordButtonClasses, 'm-2', word.selected && 'bg-swan')}
			onPress={() => onWordSelect(word.id)}
		>
			<AppText
				className={twMerge(
					'text-2xl font-bold',
					word.selected ? 'text-swan' : 'text-eel'
				)}
				style={styles.wordButtonText}
			>
				{word.displayText}
			</AppText>
		</Pressable>
	));

	function onWordDeselect(wordId: string) {
		const deselectedWord = choiceBank.find((word) => word.id === wordId);

		if (deselectedWord) {
			setChoiceBank((prev) =>
				prev.map((word) =>
					word.id === wordId ? { ...word, selected: false } : word
				)
			);
			let currentData = [...rowsData];
			let flattenedWords: Word[] = currentData.reduce<Word[]>((acc, item) => {
				return [...acc, ...item.words];
			}, []);
			flattenedWords = flattenedWords.filter((word) => word.id !== wordId);
			const newRowsData: Row[] = [];

			for (let i = 0; i < rowCount; i++) {
				const newWords: Word[] = [];
				let currentRemainingWidth = singleDividerWidth;
				let currentIsWidthLocked = false;
				let wordToInsert = flattenedWords.shift();
				console.log('word to insert: ', wordToInsert);

				while (
					wordToInsert !== undefined &&
					currentRemainingWidth > wordToInsert.buttonWidth &&
					!currentIsWidthLocked
				) {
					newWords.push(wordToInsert);
					currentRemainingWidth -= wordToInsert.buttonWidth;
					wordToInsert = flattenedWords.shift();
				}

				if (
					wordToInsert !== undefined &&
					currentRemainingWidth < wordToInsert?.buttonWidth
				) {
					//这行不够放，留到下一行
					flattenedWords.unshift(wordToInsert);
					currentIsWidthLocked = true;
				}

				newRowsData.push({
					id: i.toString(),
					words: [...newWords],
					remainingWidth: currentRemainingWidth,
					isWidthLocked: currentIsWidthLocked,
				});
				console.log('new data list: ', newRowsData);
			}
			setRowsData([...newRowsData]);
			Haptics.selectionAsync();
		}
	}

	function onWordSelect(id: string): void {
		const selectedWord = choiceBank.find((word) => word.id === id);

		if (selectedWord) {
			setChoiceBank((prev) =>
				prev.map((word) =>
					word.id === id ? { ...word, selected: true } : word
				)
			);

			//往flatlist里塞
			const currentData = [...rowsData];
			const insertRowIndex = currentData.findIndex(
				(item: Row) =>
					item.remainingWidth > selectedWord.buttonWidth && !item.isWidthLocked
			);

			currentData[insertRowIndex].words.push(selectedWord);
			currentData[insertRowIndex].remainingWidth -= selectedWord.buttonWidth;
			setRowsData([...currentData]);
			Haptics.selectionAsync();
		}
	}

	function renderRow(item: Row): React.JSX.Element {
		return (
			<View className='flex flex-row border-b-2 border-swan h-16 px-'>
				{item.words.length > 0 &&
					item.words.map((word: Word) => (
						<Pressable
							key={word.id}
							className={wordButtonClasses}
							onPress={() => onWordDeselect(word.id)}
						>
							<AppText className='text-2xl' style={styles.wordButtonText}>
								{word.displayText}
							</AppText>
						</Pressable>
					))}
			</View>
		);
	}

	function checkAnswer(): boolean {
		const flattenedWords: string[] = rowsData.reduce<string[]>((acc, item) => {
			return [
				...acc,
				...item.words.map((word) => word?.displayText.toLowerCase()),
			];
		}, []);

		if (flattenedWords.length === 0) {
			return false;
		}

		const result: boolean =
			flattenedWords.length === quizzes[index].answer.length &&
			quizzes[index].answer.every(
				(word, i) => word.toLowerCase() === flattenedWords[i]
			);
		console.log('result : ', result);

		return result;
	}

	async function onCheckPress(e: any): Promise<void> {
		const isCorrect = checkAnswer();
		const sound = isCorrect ? sounds.correct : sounds.incorrect;

		if (sound) {
			await sound.replayAsync();
		}
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		setIsCorrect(isCorrect);
		isResultSheetOpen.value = true;
	}

	function onContinuePress(): void {
		translateX.value = 1000; //Sliding animation for the next quiz
		translateX.value = withTiming(0, { duration: 500 });
		if (index < quizzes.length - 1) {
			setIndex((prev) => prev + 1);
		} else {
			setIndex(0);
		}
		isResultSheetOpen.value = false;
	}

	return (
		<SafeAreaView className='flex-1 bg-white'>
			<Animated.View
				// className='px-[1.25rem]'
				className={twMerge(`px-[${horizonalPaddingRem}rem]`)}
				style={[
					useAnimatedStyle(() => ({
						transform: [{ translateX: translateX.value }],
					})),
					{ ...styles.container },
				]}
			>
				<Pressable className='p-1' onPress={() => router.push('/')}>
					<CloseIcon width={28} height={28} />
				</Pressable>
				<AppText className='font-bold text-3xl'>
					Translate this sentence
				</AppText>
				<View className='flex flex-row justify-start flex-wrap'>
					{/* Section: Question line */}
					<Pressable
						className='bg-macaw h-10 w-10 p-1 mr-2 flex justify-center items-center border-transparent border-2 rounded-xl'
						style={styles.speakerIconButton}
					>
						<LottieView
							autoPlay
							ref={animation}
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

				<View className='flex flex-col'>
					<FlatList
						data={rowsData}
						renderItem={({ item }) => renderRow(item)}
						keyExtractor={(item) => item.id}
					/>
				</View>

				<View className='flex flex-row flex-wrap justify-center'>
					{/* Section: word choices */}
					{choiceBankElement}
				</View>
				<Pressable
					className='bg-owl-green flex flex-row justify-center items-center rounded-3xl h-fit p-4'
					style={[styles.checkButtonShadow, styles.greenShadow]}
					onPress={onCheckPress}
				>
					<AppText className='text-white text-2xl'>CHECK</AppText>
				</Pressable>
			</Animated.View>
			<BottomSheet
				isOpen={isResultSheetOpen}
				style={[
					styles.resultBottomSheet,
					isCorrect ? styles.correctBottomSheet : styles.incorrectBottomSheet,
				]}
			>
				<AppText
					className={twMerge(
						'text-3xl',
						isCorrect ? 'text-owl-green' : 'text-cardinal'
					)}
				>
					{isCorrect ? 'Awesome!' : 'Correct solution: '}
				</AppText>
				<AppText
					className={twMerge(
						'text-lg',
						isCorrect ? 'text-owl-green' : 'text-cardinal'
					)}
				>
					{isCorrect && 'Meaning: '}
					{quizzes[index].answerString}
				</AppText>
				<Pressable
					className={twMerge(
						' flex flex-row justify-center items-center rounded-3xl h-fit p-4 self-stretch',
						isCorrect ? 'bg-owl-green' : 'bg-cardinal'
					)}
					style={[
						styles.checkButtonShadow,
						isCorrect ? styles.greenShadow : styles.redShadow,
					]}
					onPress={onContinuePress}
				>
					<AppText className='text-white text-2xl'>CONTINUE</AppText>
				</Pressable>
			</BottomSheet>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
	},

	speakerIconButton: {
		shadowColor: Colors.whale, // Shadow color
		shadowOffset: { width: 0, height: 5 }, // Shadow offset (x, y)
		shadowOpacity: 1, // Shadow opacity
		shadowRadius: 0,
	},
	checkButtonShadow: {
		shadowOffset: { width: 0, height: 5 }, // Shadow offset (x, y)
		shadowOpacity: 1, // Shadow opacity
		shadowRadius: 0,
	},
	greenShadow: {
		shadowColor: Colors['tree-frog'], // Shadow color
	},
	redShadow: {
		shadowColor: Colors['fire-ant'],
	},
	wordButtonText: {
		fontFamily: 'DINRoundPro-Light',
	},
	resultBottomSheet: {
		paddingVertical: 25,

		alignItems: 'flex-start',
		gap: 20,
	},
	correctBottomSheet: {
		backgroundColor: Colors['sea-sponge'],
	},
	incorrectBottomSheet: {
		backgroundColor: Colors['walking-fish'],
	},
});

const wordButtonClasses = 'border-2 border-b-4 border-swan rounded-2xl p-2';

export default QuizScreen;
