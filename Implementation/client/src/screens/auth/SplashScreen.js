import React from "react";
import { View, StyleSheet, Image } from "react-native";
import WDButton from "../../components/ui/WDButton";
import { colors, spacing, shadows } from "../../theme/tokens";

export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.root}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/splash-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.buttonContainer}>
        <WDButton
          label="Sign In"
          onPress={() => navigation.navigate("SignIn")}
          style={styles.signInBtn}
        />
        <WDButton
          label="Create account"
          onPress={() => navigation.navigate("SignUp")}
          style={styles.createAccountBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    justifyContent: "space-between"
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
    width: 280,
    height: 280,
    maxWidth: '80%',
    maxHeight: '50%'
  },
  buttonContainer: {
    gap: spacing.md,
    paddingBottom: spacing.xl
  },
  signInBtn: {
    backgroundColor: colors.primary,
    ...shadows.main
  },
  createAccountBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border
  }
});
