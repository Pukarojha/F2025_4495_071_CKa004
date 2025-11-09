import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import WDButton from "../../components/ui/WDButton";
import WDInput from "../../components/ui/WDInput";
import { colors, spacing, type, radius, shadows } from "../../theme/tokens";

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSocialLogin = (provider) => {
    alert(`${provider} login clicked! (Not implemented yet)`);
  };

  const isEmailValid = email.includes("@") && email.includes(".");
  const isPasswordValid = password.length >= 8;
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  return (
    <View style={styles.root}>
      <Text style={styles.h1}>Sign up</Text>

      <WDInput
        label="Email"
        placeholder="example@gmail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        showValidation={email.length > 0}
        isValid={isEmailValid}
        style={styles.inputField}
      />

      <WDInput
        label="Create a password"
        placeholder="must be 8 characters"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        showPasswordToggle
        showValidation={password.length > 0}
        isValid={isPasswordValid}
        style={styles.inputField}
      />

      <WDInput
        label="Confirm password"
        placeholder="repeat password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        showPasswordToggle
        showValidation={confirmPassword.length > 0}
        isValid={doPasswordsMatch}
        style={styles.inputField}
      />

      <WDButton
        label="Sign up"
        onPress={() => navigation.replace("Main")}
        style={styles.signUpBtn}
      />

      <Text style={styles.orText}>Or Register with</Text>

      <View style={styles.socialContainer}>
        <Pressable
          style={styles.socialBtn}
          onPress={() => handleSocialLogin("Facebook")}
        >
          <Ionicons name="logo-facebook" size={20} color="#1877F2" />
        </Pressable>

        <Pressable
          style={styles.socialBtn}
          onPress={() => handleSocialLogin("Google")}
        >
          <Text style={styles.googleText}>G</Text>
        </Pressable>

        <Pressable
          style={styles.socialBtn}
          onPress={() => handleSocialLogin("Apple")}
        >
          <Ionicons name="logo-apple" size={20} color="#000" />
        </Pressable>
      </View>

      <Text style={styles.loginLink}>
        Already have an account?{" "}
        <Text
          style={styles.loginLinkBold}
          onPress={() => navigation.navigate("SignIn")}
        >
          Log in
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg,
    paddingTop: spacing.xxl,
  },
  h1: {
    ...type.h1,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  inputField: {
    marginBottom: spacing.md,
  },
  signUpBtn: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.main,
  },
  orText: {
    ...type.body,
    color: colors.muted,
    textAlign: "center",
    marginVertical: spacing.lg,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  socialBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    ...shadows.main,
  },
  googleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#DB4437",
  },
  loginLink: {
    ...type.body,
    color: colors.muted,
    textAlign: "center",
  },
  loginLinkBold: {
    fontWeight: "600",
    color: colors.text,
  },
});
