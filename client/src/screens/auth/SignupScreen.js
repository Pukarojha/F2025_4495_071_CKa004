import React from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import WDButton from "../../components/ui/WDButton";
import { colors, spacing, type, radius } from "../../theme/tokens";

export default function SignUpScreen({ navigation }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleSocialLogin = (provider) => {
    alert(`${provider} login clicked! (Not implemented yet)`);
  };

  return (
    <View style={styles.root}>
      <Text style={styles.h1}>Sign up</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="example@gmail.com"
        placeholderTextColor={colors.muted}
        style={styles.input}
      />

      <Text style={styles.label}>Create a password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="must be 8 characters"
          placeholderTextColor={colors.muted}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color={colors.muted}
          />
        </Pressable>
      </View>

      <Text style={styles.label}>Confirm password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="repeat password"
          placeholderTextColor={colors.muted}
          secureTextEntry={!showConfirmPassword}
          style={styles.passwordInput}
        />
        <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
          <Ionicons
            name={showConfirmPassword ? "eye" : "eye-off"}
            size={20}
            color={colors.muted}
          />
        </Pressable>
      </View>

      <WDButton label="Sign up" onPress={() => navigation.replace("Main")} style={styles.signUpBtn} />

      <Text style={styles.orText}>Or Register with</Text>

      <View style={styles.socialContainer}>
        <Pressable style={styles.socialBtn} onPress={() => handleSocialLogin("Facebook")}>
          <Text style={styles.socialText}>f</Text>
        </Pressable>
        <Pressable style={styles.socialBtn} onPress={() => handleSocialLogin("Google")}>
          <Text style={styles.socialText}>G</Text>
        </Pressable>
        <Pressable style={styles.socialBtn} onPress={() => handleSocialLogin("Apple")}>
          <Ionicons name="logo-apple" size={20} color="#000" />
        </Pressable>
      </View>

      <Text style={styles.loginLink}>
        Already have an account? <Text style={styles.loginLinkBold} onPress={() => navigation.navigate("SignIn")}>Log in</Text>
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
  h1: {
    ...type.h1,
    color: "#000",
    marginTop: spacing.xl,
    marginBottom: spacing.lg
  },
  label: {
    ...type.body,
    color: "#000",
    marginBottom: spacing.xs,
    marginTop: spacing.sm
  },
  input: {
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: spacing.md,
    height: 48,
    marginBottom: spacing.sm
  },
  passwordContainer: {
    position: "relative",
    marginBottom: spacing.sm
  },
  passwordInput: {
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
  signUpBtn: {
    marginTop: spacing.lg,
    marginBottom: spacing.md
  },
  orText: {
    ...type.body,
    color: colors.muted,
    textAlign: "center",
    marginVertical: spacing.md
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.md,
    marginBottom: spacing.lg
  },
  socialBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  socialText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1877F2"
  },
  loginLink: {
    ...type.body,
    color: colors.muted,
    textAlign: "center"
  },
  loginLinkBold: {
    fontWeight: "600",
    color: "#000"
  }
});
