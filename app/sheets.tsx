import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';
import MoreTabsSheet from '@/app/moreTabsSheet';

registerSheet('more-tabs-sheet', MoreTabsSheet);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module 'react-native-actions-sheet' {
	interface Sheets {
		'more-tabs-sheet': SheetDefinition;
	}
}

export {};
