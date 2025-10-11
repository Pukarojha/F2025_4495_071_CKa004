import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WDButton from "../../components/ui/WDButton";
import { colors } from "../../theme/tokens";

export default function SplashScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          {/* Cloud Car Icon - Much smaller */}
          <Image
            source={require('../../../assets/cloudlogo.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          
          {/* Weather Driver Text - Smaller */}
          <Image
            source={require('../../../assets/letterlogo.png')}
            style={styles.logoText}
            resizeMode="contain"
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <WDButton
            label="Sign In"
            onPress={() => navigation.navigate("SignIn")}
            style={styles.signInBtn}
            textStyle={styles.signInBtnText}
          />
          <WDButton
            label="Create account"
            onPress={() => navigation.navigate("SignUp")}
            style={styles.createAccountBtn}
            textStyle={styles.createAccountBtnText}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    paddingVertical: 40,
  },
  icon: {
    width: 300,           // Smaller icon
    height: 200,
  },
  logoText: {
    width: 450,           // Smaller text logo
    height: 200,
  },
  buttonContainer: {
    gap: 16,
    paddingBottom: 40,
  },
  signInBtn: {
    backgroundColor: "#00BCD4",
    borderRadius: 12,
    paddingVertical: 10,
  },
  signInBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  createAccountBtn: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#00BCD4",
    borderRadius: 12,
    paddingVertical: 10,
  },
  createAccountBtnText: {
    color: "#00BCD4",
    fontSize: 16,
    fontWeight: "600",
  },
});