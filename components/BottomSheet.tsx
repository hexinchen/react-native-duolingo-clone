import React, { ReactNode } from 'react';
import {
	Pressable,
	SafeAreaView,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	useDerivedValue,
	withDelay,
	withTiming,
	SharedValue,
} from 'react-native-reanimated';

interface BottomSheetProps {
	isOpen: SharedValue<boolean>;
	toggleSheet?: () => void;
	duration?: number;
	style?: any;
	children: ReactNode;
}

export function BottomSheet({
	isOpen,
	toggleSheet,
	duration = 500,
	style,
	children,
}: BottomSheetProps) {
	const height = useSharedValue(0);
	const progress = useDerivedValue(() =>
		withTiming(isOpen.value ? 0 : 1, { duration })
	);

	const sheetStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: progress.value * 2 * height.value }],
	}));

	const backgroundColorSheetStyle = {
		backgroundColor: '#f8f9ff',
	};

	const backdropStyle = useAnimatedStyle(() => ({
		opacity: 1 - progress.value,
		zIndex: isOpen.value
			? 1
			: withDelay(duration, withTiming(-1, { duration: 0 })),
	}));

	return (
		<>
			<Animated.View style={[sheetStyles.backdrop, backdropStyle]}>
				<TouchableOpacity style={{ flex: 1 }} onPress={toggleSheet} />
			</Animated.View>
			<Animated.View
				onLayout={(e) => {
					height.value = e.nativeEvent.layout.height;
				}}
				style={[
					sheetStyles.sheet,
					sheetStyle,
					backgroundColorSheetStyle,
					style,
				]}
			>
				{children}
			</Animated.View>
		</>
	);
}

const sheetStyles = StyleSheet.create({
	sheet: {
		padding: 16,
		flex: 1,
		width: '100%',
		position: 'absolute',
		bottom: 0,
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,
		zIndex: 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
	},
});
