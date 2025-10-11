import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { colors, type, radius } from "../../theme/tokens";

export default function WDButton({ label, onPress, style, textStyle, variant = "primary" }) {
  const isTransparent = style?.backgroundColor === "transparent";

  const getButtonStyle = () => {
    if (variant === "secondary" || isTransparent) {
      return [styles.btn, styles.btnSecondary, style];
    }
    return [styles.btn, styles.btnPrimary, style];
  };

  const getTextStyle = () => {
    if (variant === "secondary" || isTransparent) {
      return [styles.txt, styles.txtSecondary, textStyle];
    }
    return [styles.txt, styles.txtPrimary, textStyle];
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        ...getButtonStyle(),
        pressed && styles.pressed
      ]}
    >
      <Text style={getTextStyle()}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24
  },
  btnPrimary: {
    backgroundColor: colors.primary
  },
  btnSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border
  },
  txt: {
    ...type.buttonLabel
  },
  txtPrimary: {
    color: "#FFFFFF"
  },
  txtSecondary: {
    color: colors.text
  },
  pressed: {
    opacity: 0.8
  }
});
