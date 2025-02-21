import { Tabs } from 'expo-router';
import React, { useRef } from 'react';
import { Platform, View, Text, Pressable, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
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
import HomeIcon from '@/assets/icons/home.svg';
import QuestIcon from '@/assets/icons/quest.svg';
import ExerciseIcon from '@/assets/icons/exercise.svg';
import LeaderBoardIcon from '@/assets/icons/leaderboards.svg';
import SuperDuolingoIcon from '@/assets/icons/superduolingo.svg';
import MoreIcon from '@/assets/icons/more.svg';
import tw from 'twrnc'; // Import twrnc
import { BlurView } from 'expo-blur';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';

export default function TabLayout() {
	const styles = createStyles();

	return (
		<SheetProvider>
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarShowLabel: false,
					tabBarHideOnKeyboard: true,
					tabBarButton: HapticTab,
					tabBarBackground: () => <View />,
					tabBarStyle: {
						backgroundColor: 'white',
						borderTopWidth: 3,
						borderColor: Colors.swan,
						paddingTop: 15,
						paddingBottom: 15,
					},
				}}
			>
				<Tabs.Screen
					name='index'
					options={{
						title: 'index',
						tabBarIcon: ({ focused }) => (
							<View
								className='p-1'
								style={focused && styles.focusedTabContainer}
							>
								<HomeIcon width={36} height={36} />
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name='treasure'
					options={{
						title: 'treasure',
						tabBarIcon: ({ focused }) => (
							<View
								className='p-1'
								style={focused && styles.focusedTabContainer}
							>
								<QuestIcon width={36} height={36} />
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name='exercise'
					options={{
						title: 'exercise',
						tabBarIcon: ({ focused }) => (
							<View
								className='p-1'
								style={focused && styles.focusedTabContainer}
							>
								<ExerciseIcon width={36} height={36} />
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name='leaderBoard'
					options={{
						title: 'leaderboard',
						tabBarIcon: ({ focused }) => (
							<View
								className='p-1'
								style={focused && styles.focusedTabContainer}
							>
								<LeaderBoardIcon width={36} height={36} />
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name='upgrade'
					options={{
						title: 'upgrade',
						tabBarIcon: ({ focused }) => (
							<View
								className='p-1'
								style={focused && styles.focusedTabContainer}
							>
								<SuperDuolingoIcon width={36} height={36} />
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name='more'
					listeners={{
						tabPress: (e) => {
							e.preventDefault();

							SheetManager.show('more-tabs-sheet');
						},
					}}
					options={{
						headerShown: false,
						title: 'more',

						tabBarIcon: ({ focused }) => (
							<View
								className='p-1'
								style={focused && styles.focusedTabContainer}
							>
								<MoreIcon width={36} height={36} />
							</View>
						),
					}}
				/>
			</Tabs>
		</SheetProvider>
	);
}

function createStyles() {
	return StyleSheet.create({
		tabBarList: {
			backgroundColor: 'white',
		},
		focusedTabContainer: {
			borderWidth: 3,
			borderRadius: 10,
			borderColor: Colors['blue-jay'],
			transform: [{ scale: 1.1 }],
		},
	});
}
