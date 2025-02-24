interface Word {
	id: string;
	selected: boolean;
	displayText: string;
	buttonWidth: number;
}

interface Row {
	words: Word[];
	id: string;
	remainingWidth: number;
	isWidthLocked: boolean;
}

interface QuestionSegment {
	isWord: boolean;
	display: string;
	wordMeaning?: string;
}

interface Quiz {
	question: QuestionSegment[];
	answer: string[];
	choiceBank: string[];
}

export { Word, Row, QuestionSegment, Quiz };
