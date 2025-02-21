import {
	View,
	Text,
	Pressable,
	StyleSheet,
	Platform,
	TextLayoutEventData,
	NativeSyntheticEvent,
	LayoutChangeEvent,
	Dimensions,
	ScaledSize,
	FlatList,
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
import { Layout } from '@lottiefiles/dotlottie-react';
import { useFonts } from 'expo-font';
import { debounce, List } from 'lodash';

interface Word {
	id: string;
	selected: boolean;
	displayText: string;
	buttonWidth: number;
}

interface ListItem {
	words: Word[];
	id: string;
	remainingWidth: number;
}

function QuizScreen() {
	const [loaded, error] = useFonts({
		'DINRoundPro-Light': require('@/assets/fonts/din-round-light.ttf'),
	});

	if (!loaded && !error) {
		return null;
	}

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
		].map((word) => ({
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

	const [flatListData, setFlatListData] = useState<ListItem[]>([]);
	const [singleDividerWidth, setSingleDividerWidth] = useState(
		Dimensions.get('window').width
	);

	const debouncedHandleWindowChange = debounce((window: ScaledSize) => {
		setSingleDividerWidth(window.width);
		setRowCount(window.width < 390 ? 3 : window.width < 598 ? 2 : 1);
	}, 700);

	useEffect(() => {
		const handleWindowSizeChange = ({ window }: { window: ScaledSize }) => {
			debouncedHandleWindowChange(window);
		};

		const subscription = Dimensions.addEventListener(
			'change',
			handleWindowSizeChange
		);

		return () => {
			subscription?.remove();
			debouncedHandleWindowChange.cancel(); // Cancel any pending debounced calls on cleanup
		};
	}, []);

	useEffect(() => {
		const newDataList: ListItem[] = [];
		console.log('single divider width: ', singleDividerWidth);
		for (let i = 0; i < rowCount; i++) {
			newDataList.push({
				id: i.toString(),
				words: [],
				remainingWidth: singleDividerWidth,
			});
		}
		setFlatListData([...newDataList]);
	}, [rowCount]);

	const questionElement: React.JSX.Element[] = question.map((word) => (
		<AppText
			key={nanoid()}
			className='text-eel text-2xl my-2'
			style={styles.wordButtonText}
		>
			{word}
		</AppText>
	));

	const selectedWordsElement: React.JSX.Element[] = choiceBank.map((word) => (
		<Pressable
			key={word.id}
			className={twMerge('border-2 border-b-4 border-swan rounded-2xl p-2 m-2')}
		>
			<AppText className={twMerge('text-2xl', 'text-eel')}>
				{word.displayText}
			</AppText>
		</Pressable>
	));

	function handleChoiceButtonLayout(event: LayoutChangeEvent, id: string) {
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
	const wordButtonClasses = 'border-2 border-b-4 border-swan rounded-2xl p-2';
	const choiceBankElement: React.JSX.Element[] = choiceBank.map((word) => (
		<Pressable
			key={word.id}
			onLayout={(event: LayoutChangeEvent) =>
				handleChoiceButtonLayout(event, word.id)
			}
			disabled={word.selected}
			className={twMerge(wordButtonClasses, 'm-2', word.selected && 'bg-swan')}
			onPress={() => onWordChoicePress(word.id)}
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
			let currentData = [...flatListData];
			const removeRowIndex = currentData.findIndex((item: ListItem) =>
				item.words.map((word) => word.id).includes(wordId)
			);
			currentData[removeRowIndex].words = currentData[
				removeRowIndex
			].words.filter((word) => word.id !== wordId);
			currentData[removeRowIndex].remainingWidth += deselectedWord.buttonWidth;
			setFlatListData([...currentData]);
		}
	}

	function onWordChoicePress(id: string) {
		const selectedWord = choiceBank.find((word) => word.id === id);

		if (selectedWord) {
			setChoiceBank((prev) =>
				prev.map((word) =>
					word.id === id ? { ...word, selected: true } : word
				)
			);

			//往flatlist里塞
			const currentData = [...flatListData];
			const insertRowIndex = currentData.findIndex(
				(item: ListItem) => item.remainingWidth > selectedWord.buttonWidth
			);
			currentData[insertRowIndex].words.push(selectedWord);
			currentData[insertRowIndex].remainingWidth -= selectedWord.buttonWidth;
			setFlatListData([...currentData]);
		}
	}

	function renderListItem(item: ListItem) {
		return (
			<View className='flex flex-row border-b-2 border-swan h-16'>
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

	return (
		<SafeAreaView className='bg-white h-full flex flex-col justify-between px-5'>
			<Pressable className='p-1' onPress={() => router.push('/')}>
				<CloseIcon width={28} height={28} />
			</Pressable>
			<AppText className='font-bold text-3xl'>Translate this sentence</AppText>
			<View className='flex flex-row justify-start flex-wrap'>
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

			<View className='flex flex-col'>
				<FlatList
					data={flatListData}
					renderItem={({ item }) => renderListItem(item)}
					keyExtractor={(item) => item.id}
				/>
			</View>

			<View className='flex flex-row flex-wrap justify-center'>
				{/* Section: word choices */}
				{choiceBankElement}
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
	wordButtonText: {
		fontFamily: 'DINRoundPro-Light',
	},
});

export default QuizScreen;
