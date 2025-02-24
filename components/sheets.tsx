import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';
import MoreTabsSheet from '@/components/moreTabsSheet';
import QuizResultSheet from '@/components/quizResultSheet';

registerSheet('more-tabs-sheet', MoreTabsSheet);
registerSheet('quiz-result-sheet', QuizResultSheet);

declare module 'react-native-actions-sheet' {
	interface Sheets {
		'more-tabs-sheet': SheetDefinition;
		'quiz-result-sheet': SheetDefinition;
	}
}

export default {};
