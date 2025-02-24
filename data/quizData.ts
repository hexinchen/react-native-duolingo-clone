import { QuestionSegment, Quiz } from '@/interfaces/quiz';

export const quizzes: Quiz[] = [
	{
		question: [
			{ isWord: true, display: 'Hallo', wordMeaning: 'hello' },
			{ isWord: false, display: ', ' },
			{ isWord: true, display: 'kommst', wordMeaning: 'come' },
			{ isWord: false, display: ' ' },
			{ isWord: true, display: 'du', wordMeaning: 'you' },
			{ isWord: false, display: ' ' },
			{ isWord: true, display: 'aus', wordMeaning: 'from' },
			{ isWord: false, display: ' ' },
			{ isWord: true, display: 'Frankreich', wordMeaning: 'France' },
			{ isWord: false, display: '?' },
		],
		answer: ['Hello', 'do', 'you', 'come', 'from', 'France'],
		choiceBank: [
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
		],
	},
	{
		question: [
			{ isWord: true, display: 'Hallo', wordMeaning: 'hello' },
			{ isWord: false, display: ', ' },
			{ isWord: true, display: 'Julia', wordMeaning: 'Julia' },
			{ isWord: false, display: '.' },
		],
		answer: ['hello', 'Julia'],
		choiceBank: ['coffee', 'Hello', 'beer', 'water', 'Julia', 'please'],
	},
];
