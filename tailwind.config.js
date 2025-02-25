/** @type {import('tailwindcss').Config} */
module.exports = {
	// NOTE: Update this to include the paths to all of your component files.
	content: ['./app/**/*.{js,jsx,ts,tsx}'],
	presets: [require('nativewind/preset')],
	theme: {
		extend: {
			colors: {
				'owl-green': 'rgb(88, 204, 2)',
				'blue-jay': 'rgb(132, 216, 255)',
				swan: 'rgb(229, 229, 229)',
				macaw: 'rgb(28, 176, 246)',
				whale: 'rgb(24, 153, 214)',
				'black-text': 'rgb(60, 60, 60)',
				eel: 'rgb(75, 75, 75)',
				'tree-frog': 'rgb(88, 167, 0)',
				'sea-sponge': 'rgb(215, 255, 184)',
				'walking-fish': 'rgb(255, 223, 224)',
				'fire-ant': 'rgb(234, 43, 43)',
				cardinal: 'rgb(255, 75, 75)',
			},
			fontFamily: {
				'din-round-bold': 'din-round-bold',
				'din-round-light': 'din-round-light',
			},
		},
	},
	plugins: [],
};
