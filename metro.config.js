const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const {
	wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

let config = getDefaultConfig(__dirname);

config.transformer = {
	...config.transformer,
	babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
	...config.resolver,
	assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
	sourceExts: [...config.resolver.sourceExts, 'svg'],
};

config = withNativeWind(config, { input: './global.css' });
config = wrapWithReanimatedMetroConfig(config);

module.exports = config;
