import React from "react";
import { View, Text, StyleSheet } from "react-native";
import WDButton from "../../components/ui/WDButton";
import { colors, spacing, type } from "../../theme/tokens";

export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.root}>
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <Text style={styles.cloudEmoji}>☁️</Text>
          <Text style={styles.carEmoji}>🚗</Text>
          <Text style={styles.rainEmoji}>💧💧💧</Text>
        </View>
        <Text style={styles.logoText}>Weather</Text>
        <Text style={styles.logoTextSecondary}>Driver</Text>
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
    backgroundColor: "#f8f9fa",
    padding: spacing.lg,
    justifyContent: "space-between"
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  logoIcon: {
    alignItems: "center",
    marginBottom: spacing.lg
  },
  cloudEmoji: {
    fontSize: 60,
    color: colors.primary
  },
  carEmoji: {
    fontSize: 40,
    marginTop: -10
  },
  rainEmoji: {
    fontSize: 20,
    marginTop: -5
  },
  logoText: {
    ...type.h1,
    fontSize: 36,
    color: colors.primary,
    fontWeight: "700"
  },
  logoTextSecondary: {
    ...type.h1,
    fontSize: 36,
    color: "#D4A574",
    fontWeight: "700",
    marginTop: -8
  },
  buttonContainer: {
    gap: spacing.md,
    paddingBottom: spacing.xl
  },
  signInBtn: {
    backgroundColor: colors.primary
  },
  createAccountBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border
  }
});
