import { HapticTab } from '@/components/HapticTab';
import { BlurView } from 'expo-blur';
import { Stack, Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function MoreTabsLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name='feed' />
			<Stack.Screen name='profile' />
		</Stack>
	);
}
