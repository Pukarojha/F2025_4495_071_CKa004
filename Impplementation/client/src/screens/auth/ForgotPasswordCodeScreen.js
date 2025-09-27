import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import WDButton from "../../components/ui/WDButton";
import { colors, spacing, type, radius } from "../../theme/tokens";

export default function ForgotPasswordCodeScreen({ navigation, route }) {
  const { email } = route.params || {};
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(20);
  const inputRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = () => {
    if (code.length === 4) {
      navigation.navigate("ResetPassword", { email, code });
    }
  };

  const handleResendCode = () => {
    setTimer(20);
    setCode("");
  };

  const displayCode = () => {
    const digits = code.split("");
    const result = ["", "", "", ""];
    for (let i = 0; i < digits.length && i < 4; i++) {
      result[i] = digits[i];
    }
    return result;
  };

  return (
    <View style={styles.root}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={24} color="#000" />
      </Pressable>

      <Text style={styles.h1}>Please check your email</Text>
      <Text style={styles.desc}>
        We've sent a code to {email}
      </Text>

      <View style={styles.codeContainer}>
        {displayCode().map((digit, index) => (
          <Pressable
            key={index}
            style={styles.codeInput}
            onPress={() => inputRef.current?.focus()}
          >
            <Text style={styles.codeText}>{digit}</Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={code}
        onChangeText={(text) => setCode(text.replace(/[^0-9]/g, "").slice(0, 4))}
        keyboardType="numeric"
        maxLength={4}
        autoFocus={true}
        onSubmitEditing={handleVerify}
      />

      <WDButton
        label="Verify"
        onPress={handleVerify}
        style={styles.verifyBtn}
      />

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
          Send code again{" "}
          <Text style={styles.timer}>
            {timer > 0 ? `00:${timer.toString().padStart(2, "0")}` : ""}
          </Text>
        </Text>
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
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.md,
    marginBottom: spacing.lg
  },
  codeInput: {
    width: 60,
    height: 60,
    backgroundColor: "#fff",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  codeText: {
    ...type.h2,
    color: "#000"
  },
  verifyBtn: {
    marginBottom: spacing.lg
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: spacing.xl
  },
  resendText: {
    ...type.body,
    color: colors.muted
  },
  timer: {
    color: colors.primary
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    height: 0,
    width: 0
  }
});