import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

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

import { colors } from "./src/theme/tokens";

const queryClient = new QueryClient();
const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={navTheme}>
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
        </RootStack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
