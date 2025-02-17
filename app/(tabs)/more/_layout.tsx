import { Tabs } from 'expo-router';

export default function MoreTabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
			}}
		></Tabs>
	);
}
