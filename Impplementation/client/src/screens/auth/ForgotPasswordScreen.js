import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import WDButton from "../../components/ui/WDButton";
import { colors, spacing, type, radius } from "../../theme/tokens";

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
        <Ionicons name="chevron-back" size={24} color="#000" />
      </Pressable>

      <Text style={styles.h1}>Forgot password?</Text>
      <Text style={styles.desc}>
        Don't worry! It happens. Please enter the email associated with your account.
      </Text>

      <Text style={styles.label}>Email address</Text>
      <TextInput
        placeholder="Enter your email address"
        placeholderTextColor={colors.muted}
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <WDButton
        label="Send code"
        onPress={handleSendCode}
        style={styles.sendBtn}
      />

      <Text style={styles.remember} onPress={() => navigation.navigate("SignIn")}>
        Remember password? <Text style={styles.loginLink}>Log in</Text>
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
    marginBottom: spacing.xl,
    lineHeight: 22
  },
  label: {
    ...type.body,
    color: "#000",
    marginBottom: spacing.xs
  },
  input: {
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: spacing.md,
    height: 48,
    marginBottom: spacing.lg
  },
  sendBtn: {
    marginBottom: spacing.lg
  },
  remember: {
    ...type.body,
    color: colors.muted,
    textAlign: "center"
  },
  loginLink: {
    fontWeight: "600",
    color: "#000"
  }
});