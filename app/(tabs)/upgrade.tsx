import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../components/AppText';

const upgrade = () => {
	return (
		<SafeAreaView className='bg-owl-green h-screen'>
			<View>
				<AppText>upgrade</AppText>
			</View>
		</SafeAreaView>
	);
};

export default upgrade;
