/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../tailwind.config';
import { DefaultColors } from 'tailwindcss/types/generated/colors';

interface AppColors extends DefaultColors {
	'owl-green': string;
	'blue-jay': string;
	swan: string;
	macaw: string;
	whale: string;
	'black-text': string;
	eel: string;
	'tree-frog': string;
}

const fullConfig = resolveConfig(tailwindConfig);

export const Colors = fullConfig.theme.colors as AppColors;
