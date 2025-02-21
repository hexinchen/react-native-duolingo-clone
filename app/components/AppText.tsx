// components/AppText.tsx
import React from 'react';
import { Text, TextProps } from 'react-native';
import { useFonts } from 'expo-font';

interface AppTextProps extends TextProps {
	// Add any custom props you might need here
}

const AppText: React.FC<AppTextProps> = ({ children, style, ...props }) => {
	const [loaded, error] = useFonts({
		'DINRoundPro-Bold': require('@/assets/fonts/din-round-bold.ttf'),
	});

	if (!loaded) {
		return <Text>Loading...</Text>; // Or a better loading indicator
	}

	return (
		<Text
			{...props}
			style={[
				{ fontFamily: 'DINRoundPro-Bold' },
				style, // Merge with any passed styles
			]}
		>
			{children}
		</Text>
	);
};

export default AppText;
