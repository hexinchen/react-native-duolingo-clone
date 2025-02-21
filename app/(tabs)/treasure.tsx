import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../components/AppText';

const treasure = () => {
	return (
		<SafeAreaView className='bg-owl-green h-screen'>
			<View>
				<AppText>treasure</AppText>
			</View>
		</SafeAreaView>
	);
};

export default treasure;
