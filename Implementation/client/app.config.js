// app.config.js
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
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#0B0B10"
    },
    updates: { fallbackToCacheTimeout: 0 },
    assetBundlePatterns: ["**/*"],

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.weatherdriver",
      config: { googleMapsApiKey: process.env.MAPS_KEY },
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "This app needs your location to show nearby gas stations and weather."
      }
    },

    android: {
      package: "com.anonymous.weatherdriver",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#0B0B10"
      },
      permissions: ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
      config: { googleMaps: { apiKey: process.env.MAPS_KEY } }
    },

    web: { bundler: "metro", favicon: "./assets/favicon.png" },

    plugins: ["expo-font"],

    extra: {
      // runtime key for JS libraries (e.g. Places)
      PLACES_KEY: process.env.PLACES_KEY ?? process.env.MAPS_KEY,

      // ✅ EAS project linkage goes HERE
      eas: {
        projectId: "fc43e4df-11a2-4001-9902-97c4b6b2550e"
      }
    }
  }
};
