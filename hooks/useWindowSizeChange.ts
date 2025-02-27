import { useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

// Custom hook to handle window size changes
const useWindowSizeChange = (debouncedHandleWindowChange) => {
	useEffect(() => {
		const handleWindowSizeChange = ({ window }: { window: ScaledSize }) => {
			debouncedHandleWindowChange(window);
		};

		const subscription = Dimensions.addEventListener(
			'change',
			handleWindowSizeChange
		);

		return () => {
			subscription?.remove();
			debouncedHandleWindowChange.cancel(); // Cancel any pending debounced calls on cleanup
		};
	}, []);
};

export default useWindowSizeChange;
