import React, { useEffect } from "react";
import { NavigationContainer, DefaultTheme, useNavigationContainerRef } from "@react-navigation/native"; // <--- CHANGED (Added useNavigationContainerRef)
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

// 1. IMPORT DEEP LINKING UTILS (NEW)
import * as Linking from 'expo-linking'; 

// 2. IMPORT AMPLIFY & CONFIG (NEW)
import { Amplify } from 'aws-amplify';
import { Hub } from 'aws-amplify/utils';
import awsExports from './src/aws-exports';

import SplashScreen from "./src/screens/auth/SplashScreen";
import OnboardingScreen from "./src/screens/auth/OnboardingScreen";
import SignInScreen from "./src/screens/auth/SignInScreen";
import SignUpScreen from "./src/screens/auth/SignupScreen";
import ForgotPasswordScreen from "./src/screens/auth/ForgotPasswordScreen";
import ForgotPasswordCodeScreen from "./src/screens/auth/ForgotPasswordCodeScreen";
import ResetPasswordScreen from "./src/screens/auth/ResetPasswordScreen";
import PasswordChangedScreen from "./src/screens/auth/PasswordChangedScreen";

import MapScreen from "./src/screens/main/MapScreen";
import AlertsScreen from "./src/screens/main/AlertScreen";
import SearchScreen from "./src/screens/main/SearchScreen";
import SettingsMenuScreen from "./src/screens/main/SettingsMenuScreen";
import RoutePreviewScreen from "./src/screens/main/RoutePreviewScreen";
import ActiveNavigationScreen from "./src/screens/main/ActiveNavigationScreen";
import ChooseStartLocationScreen from "./src/screens/main/ChooseStartLocationScreen";
import ChooseDestinationScreen from "./src/screens/main/ChooseDestinationScreen";
import MapPickerScreen from "./src/screens/main/MapPickerScreen";
import AddStopsScreen from "./src/screens/main/AddStopsScreen";
import LocationPickerScreen from "./src/screens/main/LocationPickerScreen";
import GasStationScreen from "./src/screens/settings/GasStationScreen";
import PreferredBrandScreen from "./src/screens/settings/PreferredBrandScreen";
import SpeedometerScreen from "./src/screens/settings/SpeedometerScreen";
import NotificationSettingsScreen from "./src/screens/settings/NotificationSettingsScreen";
import TollPassScreen from './src/screens/settings/TollPassScreen';
import EditProfileScreen from './src/screens/main/EditProfileScreen';

import { colors } from "./src/theme/tokens";

// 3. CONFIGURE AMPLIFY (NEW)
Amplify.configure(awsExports);

const queryClient = new QueryClient();
const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 4. DEFINE LINKING CONFIGURATION (NEW)
// This tells the app how to handle the "weatherdriver://" redirect from Google
const linking = {
  prefixes: [
    Linking.createURL('/'), // Handles "exp://" for local development
    'weatherdriver://'      // Handles production builds
  ],
  config: {
    screens: {
      // You can map paths here if needed, but not strictly required for Auth
    }
  }
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ color, size }) => {
          const m = { Map: "map", Alerts: "warning", Search: "search", Settings: "settings" };
          return <Ionicons name={m[route.name]} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Settings" component={SettingsMenuScreen} />
    </Tab.Navigator>
  );
}

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    text: colors.text,
    border: colors.border,
    card: colors.surface,
    primary: colors.primary
  }
};

export default function App() {
  // 5. CREATE NAVIGATION REFERENCE (NEW)
  // We need this to navigate *programmatically* when the Hub listener fires
  const navigationRef = useNavigationContainerRef();

  // 6. LISTEN FOR AUTH EVENTS (NEW)
  useEffect(() => {
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      // This event fires when Google successfully redirects back to the app
      if (payload.event === 'signedIn') {
        console.log('Social Login Successful via Hub, navigating to Main...');
        
        // If navigation is ready, force the user to the Main screen
        if (navigationRef.isReady()) {
          navigationRef.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        }
      }
    });

    return unsubscribe;
  }, [navigationRef]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* 7. PASS LINKING AND REF TO NAVIGATION CONTAINER (CHANGED) */}
      <NavigationContainer 
        theme={navTheme} 
        linking={linking} 
        ref={navigationRef}
      >
        <StatusBar style="light" />
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Splash" component={SplashScreen} />
          <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
          <RootStack.Screen name="SignIn" component={SignInScreen} />
          <RootStack.Screen name="SignUp" component={SignUpScreen} />
          <RootStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <RootStack.Screen name="ForgotPasswordCode" component={ForgotPasswordCodeScreen} />
          <RootStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <RootStack.Screen name="PasswordChanged" component={PasswordChangedScreen} />
          <RootStack.Screen name="Main" component={MainTabs} />
          <RootStack.Screen name="RoutePreview" component={RoutePreviewScreen} />
          <RootStack.Screen name="ActiveNavigation" component={ActiveNavigationScreen} />
          <RootStack.Screen name="ChooseStartLocation" component={ChooseStartLocationScreen} />
          <RootStack.Screen name="ChooseDestination" component={ChooseDestinationScreen} />
          <RootStack.Screen name="MapPicker" component={MapPickerScreen} />
          <RootStack.Screen name="AddStops" component={AddStopsScreen} />
          <RootStack.Screen name="LocationPicker" component={LocationPickerScreen} />
          <RootStack.Screen name="GasStation" component={GasStationScreen} />
          <RootStack.Screen name="PreferredBrand" component={PreferredBrandScreen} />
          <RootStack.Screen name="Speedometer" component={SpeedometerScreen} />
          <RootStack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
          <RootStack.Screen name="TollPasses" component={TollPassScreen} />
          <RootStack.Screen name="EditProfile" component={EditProfileScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}