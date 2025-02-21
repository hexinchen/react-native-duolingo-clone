import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '@/app/components/AppText';

const feed = () => {
	return (
		<SafeAreaView className='bg-owl-green h-screen'>
			<View>
				<AppText>feed</AppText>
			</View>
		</SafeAreaView>
	);
};

export default feed;
