import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import WDButton from "../../components/ui/WDButton";
import WDInput from "../../components/ui/WDInput";
import { colors, spacing, type, radius, shadows } from "../../theme/tokens";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const handleSendCode = () => {
    if (email.trim()) {
      navigation.navigate("ForgotPasswordCode", { email });
    }
  };

  return (
    <View style={styles.root}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </Pressable>

      <Text style={styles.h1}>Forgot password?</Text>
      <Text style={styles.desc}>
        Don't worry! It happens. Please enter the email associated with your account.
      </Text>

      <WDInput
        label="Email address"
        placeholder="Enter your email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.inputField}
      />

      <WDButton
        label="Send code"
        onPress={handleSendCode}
        style={styles.sendBtn}
      />

      <Pressable onPress={() => navigation.navigate("SignIn")}>
        <Text style={styles.remember}>
          Remember password? <Text style={styles.loginLink}>Log in</Text>
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
    marginBottom: spacing.xl,
    lineHeight: 22
  },
  inputField: {
    marginBottom: spacing.lg
  },
  sendBtn: {
    marginBottom: spacing.xl,
    ...shadows.main
  },
  remember: {
    ...type.body,
    color: colors.muted,
    textAlign: "center"
  },
  loginLink: {
    fontWeight: "600",
    color: colors.text
  }
});