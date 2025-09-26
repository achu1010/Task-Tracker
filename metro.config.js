const { getDefaultConfig } = require('expo/metro-config');

// Use unmodified Expo Metro config (SDK 54) to resolve previous asset plugin error.
module.exports = getDefaultConfig(__dirname);