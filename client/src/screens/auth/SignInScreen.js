import React from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import WDButton from "../../components/ui/WDButton";
import { colors, spacing, type, radius } from "../../theme/tokens";

export default function SignInScreen({ navigation }) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSocialLogin = (provider) => {
    alert(`${provider} login clicked! (Not implemented yet)`);
  };

  return (
    <View style={styles.root}>
      <Text style={styles.h1}>Log in</Text>

      <Text style={styles.label}>Email address</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="helloworld@gmail.com"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.checkIcon} />
      </View>

      <Text style={styles.label}>Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="••••••••"
          placeholderTextColor={colors.muted}
          secureTextEntry={!showPassword}
          style={styles.input}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color={colors.muted}
          />
        </Pressable>
      </View>

      <Text style={styles.forgotPassword} onPress={() => navigation.navigate("ForgotPassword")}>
        Forgot password?
      </Text>

      <WDButton label="Log in" onPress={() => navigation.replace("Main")} style={styles.loginBtn} />

      <Text style={styles.orText}>Or Login with</Text>

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

      <Text style={styles.signUpLink}>
        Don't have an account? <Text style={styles.signUpLinkBold} onPress={() => navigation.navigate("SignUp")}>Sign up</Text>
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
  inputContainer: {
    position: "relative",
    marginBottom: spacing.sm
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
  checkIcon: {
    position: "absolute",
    right: spacing.md,
    top: 14
  },
  eyeIcon: {
    position: "absolute",
    right: spacing.md,
    top: 14
  },
  forgotPassword: {
    ...type.body,
    color: colors.primary,
    textAlign: "right",
    marginBottom: spacing.lg
  },
  loginBtn: {
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
  signUpLink: {
    ...type.body,
    color: colors.muted,
    textAlign: "center"
  },
  signUpLinkBold: {
    fontWeight: "600",
    color: "#000"
  }
});
