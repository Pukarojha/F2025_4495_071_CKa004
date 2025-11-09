import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import WDButton from "../../components/ui/WDButton";
import WDInput from "../../components/ui/WDInput";
import { colors, spacing, type, radius, shadows } from "../../theme/tokens";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSocialLogin = (provider) => {
    alert(`${provider} login clicked! (Not implemented yet)`);
  };

  const isEmailValid = email.includes("@") && email.includes(".");

  return (
    <View style={styles.root}>
      <Text style={styles.h1}>Log in</Text>

      <WDInput
        label="Email address"
        placeholder="helloworld@gmail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        showValidation={email.length > 0}
        isValid={isEmailValid}
        style={styles.inputField}
      />

      <WDInput
        label="Password"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        showPasswordToggle
        style={styles.inputField}
      />

      <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </Pressable>

      <WDButton
        label="Log in"
        onPress={() => navigation.replace("Main")}
        style={styles.loginBtn}
      />

      <Text style={styles.orText}>Or Login with</Text>

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

      <Text style={styles.signUpLink}>
        Don’t have an account?{" "}
        <Text
          style={styles.signUpLinkBold}
          onPress={() => navigation.navigate("SignUp")}
        >
          Sign up
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
  forgotPassword: {
    ...type.body,
    color: colors.primary,
    textAlign: "right",
    marginBottom: spacing.xxl,
    marginTop: spacing.sm,
  },
  loginBtn: {
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
  signUpLink: {
    ...type.body,
    color: colors.muted,
    textAlign: "center",
  },
  signUpLinkBold: {
    fontWeight: "600",
    color: colors.text,
  },
});
