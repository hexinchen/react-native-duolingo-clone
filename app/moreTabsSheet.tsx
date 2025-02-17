import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import Entypo from '@expo/vector-icons/Entypo';
import { Colors } from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
	ExternalPathString,
	Href,
	RelativePathString,
	Router,
	useRouter,
	Link,
} from 'expo-router';

type ItemProps = { title: string; icon: React.JSX.Element; router: Router };

function Item({ title, icon, router }: ItemProps) {
	function handlePress() {
		console.log('Navigating to:', '/' + title);
		router.push(('/more/' + title.toLowerCase()) as Href);
		SheetManager.hide('more-tabs-sheet');
	}

	return (
		<View className='flex flex-1 w-full'>
			<Pressable
				className='p-5 flex flex-row w-full gap-4'
				onPress={handlePress}
			>
				<View>{icon}</View>
				<Text className='font-bold text-lg'>{title}</Text>
			</Pressable>
			<View
				style={{
					borderBottomColor: 'black',
					borderBottomWidth: StyleSheet.hairlineWidth,
				}}
			/>
		</View>
	);
}

function createData(color: string) {
	return [
		{
			id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
			title: 'Feed',
			icon: <Entypo name='notification' size={28} color={color} />,
		},
		{
			id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
			title: 'Profile',
			icon: <MaterialIcons name='account-circle' size={28} color={color} />,
		},
	];
}

function MoreTabsSheet() {
	const router = useRouter();

	return (
		<ActionSheet>
			<FlatList
				data={createData(Colors['light'].tint)}
				renderItem={({ item }) => (
					<Item title={item.title} icon={item.icon} router={router} />
				)}
				keyExtractor={(item) => item.id}
			/>
		</ActionSheet>
	);
}

export default MoreTabsSheet;
