import { Tabs } from 'expo-router';
import React, { useRef } from 'react';
import { Platform, View, Text } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import ActionSheet, {
	ActionSheetRef,
	SheetManager,
	SheetProvider,
} from 'react-native-actions-sheet';
import '@/app/sheets';

export default function TabLayout() {
	return (
		<SheetProvider>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: Colors['light'].tint,
					headerShown: false,
					tabBarButton: HapticTab,
					tabBarBackground: TabBarBackground,
					tabBarStyle: Platform.select({
						ios: {
							// Use a transparent background on iOS to show the blur effect
							position: 'absolute',
						},
						default: {},
					}),
				}}
			>
				<Tabs.Screen
					name='index'
					options={{
						title: '',
						tabBarIcon: ({ color }) => (
							<IconSymbol size={28} name='house.fill' color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name='treasure'
					options={{
						title: '',
						tabBarIcon: ({ color }) => (
							<MaterialCommunityIcons
								name='treasure-chest'
								size={28}
								color={color}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name='exercise'
					options={{
						title: '',
						tabBarIcon: ({ color }) => (
							<MaterialCommunityIcons
								name='weight-lifter'
								size={28}
								color={color}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name='leaderBoard'
					options={{
						title: '',
						tabBarIcon: ({ color }) => (
							<FontAwesome5 name='trophy' size={28} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name='upgrade'
					options={{
						title: '',
						tabBarIcon: ({ color }) => (
							<FontAwesome5 name='earlybirds' size={28} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name='more'
					options={{
						headerShown: false,
						title: '',
						tabBarIcon: ({ color }) => (
							<MaterialCommunityIcons
								onPress={() => SheetManager.show('more-tabs-sheet')}
								name='dots-horizontal-circle'
								size={28}
								color={color}
							/>
						),
					}}
				/>
			</Tabs>
		</SheetProvider>
	);
}
