import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';

function useSoundManager() {
	const [sounds, setSounds] = useState<{ [key: string]: Audio.Sound }>({});

	useEffect(() => {
		const loadSounds = async () => {
			const soundFiles = {
				correct: require('@/assets/sounds/correct.mp3'),
				incorrect: require('@/assets/sounds/incorrect.mp3'),
			};

			const loadedSounds: { [key: string]: Audio.Sound } = {};
			for (const [key, soundFile] of Object.entries(soundFiles)) {
				const { sound } = await Audio.Sound.createAsync(soundFile);
				loadedSounds[key] = sound;
			}

			setSounds(loadedSounds);
		};

		loadSounds();

		return () => {
			Object.values(sounds).forEach((sound) => {
				sound.unloadAsync();
			});
		};
	}, []);

	const playSound = async (soundKey) => {
		const sound = sounds[soundKey];
		if (sound) {
			await sound.replayAsync();
		}
	};

	return { sounds, playSound };
}

export default useSoundManager;
