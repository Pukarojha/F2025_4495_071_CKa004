import React from "react";
import { View, Text, StyleSheet } from "react-native";
import WDButton from "../../components/ui/WDButton";
import { colors, spacing, type } from "../../theme/tokens";

export default function PasswordChangedScreen({ navigation }) {
  const handleBackToLogin = () => {
    navigation.navigate("SignIn");
  };

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <View style={styles.successContainer}>
          <View style={styles.checkmarkCircle}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>

        <Text style={styles.h1}>Password changed</Text>
        <Text style={styles.desc}>
          Your password has been changed successfully
        </Text>

        <WDButton
          label="Back to login"
          onPress={handleBackToLogin}
          style={styles.loginBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
    padding: spacing.lg
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  successContainer: {
    marginBottom: spacing.xl,
    alignItems: "center"
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center"
  },
  checkmark: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold"
  },
  h1: {
    ...type.h1,
    color: "#000",
    textAlign: "center",
    marginBottom: spacing.sm
  },
  desc: {
    ...type.body,
    color: colors.muted,
    textAlign: "center",
    marginBottom: spacing.xxl
  },
  loginBtn: {
    width: "100%"
  }
});