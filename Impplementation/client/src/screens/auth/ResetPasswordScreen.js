import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import WDButton from "../../components/ui/WDButton";
import WDInput from "../../components/ui/WDInput";
import { colors, spacing, type, radius, shadows } from "../../theme/tokens";

export default function ResetPasswordScreen({ navigation, route }) {
  const { email, code } = route.params || {};
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = () => {
    if (newPassword.length >= 8 && newPassword === confirmPassword) {
      navigation.navigate("PasswordChanged");
    }
  };

  const isValidPassword = newPassword.length >= 8;
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const isFormValid = isValidPassword && passwordsMatch;

  return (
    <View style={styles.root}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </Pressable>

      <Text style={styles.h1}>Reset password</Text>
      <Text style={styles.desc}>
        Please type something you'll remember
      </Text>

      <WDInput
        label="New password"
        placeholder="must be 8 characters"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry={true}
        showPasswordToggle={true}
        style={styles.inputField}
      />

      <WDInput
        label="Confirm new password"
        placeholder="repeat password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
        showPasswordToggle={true}
        style={styles.inputField}
      />

      <WDButton
        label="Reset password"
        onPress={handleResetPassword}
        style={[
          styles.resetBtn,
          !isFormValid && styles.disabledBtn
        ]}
      />

      <Pressable onPress={() => navigation.navigate("SignIn")}>
        <Text style={styles.loginLink}>
          Already have an account? <Text style={styles.loginLinkBold}>Log in</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl
  },
  backBtn: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    alignSelf: "flex-start",
    padding: spacing.xs
  },
  h1: {
    ...type.h1,
    color: colors.text,
    marginBottom: spacing.sm
  },
  desc: {
    ...type.body,
    color: colors.muted,
    marginBottom: spacing.xl
  },
  inputField: {
    marginBottom: spacing.md
  },
  resetBtn: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.main
  },
  disabledBtn: {
    opacity: 0.5
  },
  loginLink: {
    ...type.body,
    color: colors.muted,
    textAlign: "center"
  },
  loginLinkBold: {
    fontWeight: "600",
    color: colors.text
  }
});