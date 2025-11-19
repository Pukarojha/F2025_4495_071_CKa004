import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, type } from "../../theme/tokens";

export default function Logo({ size = "large", showText = true }) {
  const logoStyles = size === "large" ? styles.logoLarge : styles.logoSmall;
  const textStyles = size === "large" ? styles.textLarge : styles.textSmall;

  return (
    <View style={styles.container}>
      {/* Weather Driver Logo Icon */}
      <View style={[styles.logoIcon, logoStyles]}>
        <View style={styles.cloud}>
          <Text style={[styles.cloudIcon, logoStyles]}>☁️</Text>
        </View>
        <View style={styles.car}>
          <Text style={[styles.carIcon, logoStyles]}>🚗</Text>
        </View>
        <View style={styles.rainDrops}>
          <Text style={[styles.rainIcon, logoStyles]}>💧</Text>
          <Text style={[styles.rainIcon, logoStyles]}>💧</Text>
          <Text style={[styles.rainIcon, logoStyles]}>💧</Text>
        </View>
      </View>

      {/* Logo Text */}
      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.logoTextPrimary, textStyles]}>Weather</Text>
          <Text style={[styles.logoTextSecondary, textStyles]}>Driver</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  },
  logoIcon: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  cloud: {
    alignItems: "center"
  },
  car: {
    alignItems: "center",
    marginTop: -15
  },
  rainDrops: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -8
  },

  // Large size styles
  logoLarge: {
    fontSize: 60
  },
  cloudIcon: {
    color: colors.logoBlue
  },
  carIcon: {
    color: "#000"
  },
  rainIcon: {
    color: colors.logoBlue,
    marginHorizontal: 2
  },

  // Small size styles
  logoSmall: {
    fontSize: 30
  },

  // Text styles
  textContainer: {
    alignItems: "center",
    marginTop: 16
  },
  logoTextPrimary: {
    ...type.logo,
    color: colors.logoBlue,
    textAlign: "center"
  },
  logoTextSecondary: {
    ...type.logo,
    color: colors.logoGold,
    textAlign: "center",
    marginTop: -8
  },
  textLarge: {
    fontSize: 36
  },
  textSmall: {
    fontSize: 24
  }
});