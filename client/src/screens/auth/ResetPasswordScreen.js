import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import WDButton from "../../components/ui/WDButton";
import { colors, spacing, type, radius } from "../../theme/tokens";

export default function ResetPasswordScreen({ navigation, route }) {
  const { email, code } = route.params || {};
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = () => {
    if (newPassword.length >= 8 && newPassword === confirmPassword) {
      navigation.navigate("PasswordChanged");
    }
  };

  const isValidPassword = newPassword.length >= 8;
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  return (
    <View style={styles.root}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={24} color="#000" />
      </Pressable>

      <Text style={styles.h1}>Reset password</Text>
      <Text style={styles.desc}>
        Please type something you'll remember
      </Text>

      <Text style={styles.label}>New password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="must be 8 characters"
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showNewPassword}
        />
        <Pressable
          onPress={() => setShowNewPassword(!showNewPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showNewPassword ? "eye-off" : "eye"}
            size={20}
            color={colors.muted}
          />
        </Pressable>
      </View>

      <Text style={styles.label}>Confirm new password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="repeat password"
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <Pressable
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showConfirmPassword ? "eye-off" : "eye"}
            size={20}
            color={colors.muted}
          />
        </Pressable>
      </View>

      <WDButton
        label="Reset password"
        onPress={handleResetPassword}
        style={[
          styles.resetBtn,
          (!isValidPassword || !passwordsMatch) && styles.disabledBtn
        ]}
      />

      <Text style={styles.loginLink} onPress={() => navigation.navigate("SignIn")}>
        Already have an account? Log in
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
    padding: spacing.lg
  },
  backBtn: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    alignSelf: "flex-start"
  },
  h1: {
    ...type.h1,
    color: "#000",
    marginBottom: spacing.sm
  },
  desc: {
    ...type.body,
    color: colors.muted,
    marginBottom: spacing.xl
  },
  label: {
    ...type.body,
    color: "#000",
    marginBottom: spacing.xs
  },
  inputContainer: {
    position: "relative",
    marginBottom: spacing.md
  },
  input: {
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: spacing.md,
    paddingRight: 50,
    height: 48
  },
  eyeIcon: {
    position: "absolute",
    right: spacing.md,
    top: 14
  },
  resetBtn: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg
  },
  disabledBtn: {
    opacity: 0.5
  },
  loginLink: {
    ...type.body,
    color: colors.muted,
    textAlign: "center"
  }
});