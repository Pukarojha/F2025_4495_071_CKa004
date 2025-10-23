import 'dotenv/config';

export default {
  expo: {
    name: "Weather Driver",
    slug: "weather-driver",
    scheme: "weatherdriver",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: { image: "./assets/splash-icon.png", resizeMode: "contain", backgroundColor: "#0B0B10" },
    updates: { fallbackToCacheTimeout: 0 },
    assetBundlePatterns: ["**/*"],

    ios: {
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "This app uses your location to show your position on the map and nearby routes.",
      },
      config: {
        googleMapsApiKey: process.env.MAPS_API_KEY,   // ✅ real key injected
      },
    },

    android: {
      adaptiveIcon: { foregroundImage: "./assets/adaptive-icon.png", backgroundColor: "#0B0B10" },
      permissions: ["ACCESS_FINE_LOCATION","ACCESS_COARSE_LOCATION"],
      config: {
        googleMaps: { apiKey: process.env.MAPS_API_KEY }, // ✅ real key injected
      },
      package: "com.anonymous.weatherdriver",
    },

    web: { bundler: "metro", favicon: "./assets/favicon.png" },
    plugins: ["expo-font"], // ⬅️ no react-native-maps here
  },
};
