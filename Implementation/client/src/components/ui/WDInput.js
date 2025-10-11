import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, type, radius, spacing } from "../../theme/tokens";

export default function WDInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  showPasswordToggle = false,
  keyboardType = "default",
  autoCapitalize = "none",
  showValidation = false,
  isValid = false,
  style,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        showValidation && isValid && styles.inputContainerValid
      ]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Right side icons */}
        <View style={styles.iconContainer}>
          {showValidation && isValid && (
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.success}
              style={styles.icon}
            />
          )}

          {showPasswordToggle && (
            <Pressable onPress={togglePasswordVisibility} style={styles.iconButton}>
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color={colors.muted}
              />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm
  },
  label: {
    ...type.body,
    color: colors.text,
    marginBottom: spacing.xs
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 48
  },
  inputContainerFocused: {
    borderColor: colors.primary,
    borderWidth: 2
  },
  inputContainerValid: {
    borderColor: colors.success
  },
  input: {
    flex: 1,
    ...type.body,
    color: colors.text,
    paddingVertical: spacing.xs
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  icon: {
    marginLeft: spacing.xs
  },
  iconButton: {
    padding: 2,
    marginLeft: spacing.xs
  }
});