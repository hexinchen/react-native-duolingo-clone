import { PixelRatio, Platform } from 'react-native';

// Dynamic function to convert rem to pixels
export function remToPx(remValue: number) {
	const baseFontSize = Platform.OS === 'web' ? 16 : 14; //based on nativewind documentation
	const newSize = remValue * baseFontSize;

	return Math.round(PixelRatio.roundToNearestPixel(newSize));
}
