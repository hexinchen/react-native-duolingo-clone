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
import BellIcon from '@/assets/icons/bell.svg';
import ProfileIcon from '@/assets/icons/profile.svg';
import AppText from './components/AppText';

type ItemProps = { title: string; icon: React.JSX.Element; router: Router };

function Item({ title, icon, router }: ItemProps) {
	function handlePress() {
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
				<AppText className='font-bold text-lg'>{title}</AppText>
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

function createData() {
	return [
		{
			id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
			title: 'Feed',
			icon: <BellIcon width={32} height={32} />,
		},
		{
			id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
			title: 'Profile',
			icon: <ProfileIcon width={32} height={32} />,
		},
	];
}

function MoreTabsSheet() {
	const router = useRouter();

	return (
		<ActionSheet>
			<FlatList
				data={createData()}
				renderItem={({ item }) => (
					<Item title={item.title} icon={item.icon} router={router} />
				)}
				keyExtractor={(item) => item.id}
			/>
		</ActionSheet>
	);
}

export default MoreTabsSheet;
