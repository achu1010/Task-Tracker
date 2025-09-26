module.exports = {
  name: "TaskTracker",
  slug: "TaskTracker",
  version: "2.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "assets/fonts/**",
    "assets/images/**"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.tasktracker.app",
    buildNumber: "3",
    infoPlist: {
      UIBackgroundModes: ["background-processing"],
      NSCameraUsageDescription: "This app uses the camera for profile photos",
      NSMicrophoneUsageDescription: "This app uses the microphone for voice input"
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.tasktracker.app",
    versionCode: 3,
    permissions: []
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  plugins: [
    // Completely remove expo-updates plugin
  ],
  updates: {
    enabled: false,
    checkAutomatically: "NEVER",
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/your-project-id" // Placeholder URL that won't be used
  },
  extra: {
    eas: {
      projectId: "5cd890f7-c1dc-4d2c-91ed-03d1c4932643"
    }
  }
};