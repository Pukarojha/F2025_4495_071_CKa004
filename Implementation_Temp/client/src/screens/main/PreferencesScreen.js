import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, type } from "../../theme/tokens";

export default function PreferencesScreen({ navigation }) {
  const [avoidToll, setAvoidToll] = useState(false);
  const [avoidHighways, setAvoidHighways] = useState(false);
  const [avoidFerries, setAvoidFerries] = useState(false);
  const [fuelEfficient, setFuelEfficient] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Preferences</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Avoid Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avoid</Text>

          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Avoid toll</Text>
            <Switch
              value={avoidToll}
              onValueChange={setAvoidToll}
              trackColor={{ false: "#D1D5DB", true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Avoid highways</Text>
            <Switch
              value={avoidHighways}
              onValueChange={setAvoidHighways}
              trackColor={{ false: "#D1D5DB", true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Avoid ferries</Text>
            <Switch
              value={avoidFerries}
              onValueChange={setAvoidFerries}
              trackColor={{ false: "#D1D5DB", true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Route Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Route Preferences</Text>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceTextContainer}>
              <Text style={styles.preferenceLabel}>Prefer fuel-efficient routes</Text>
              <Text style={styles.preferenceDescription}>
                When available, suggest fuel-efficient routes
              </Text>
            </View>
            <Switch
              value={fuelEfficient}
              onValueChange={setFuelEfficient}
              trackColor={{ false: "#D1D5DB", true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  backButton: {
    padding: spacing.xs
  },
  headerTitle: {
    ...type.h2,
    color: colors.text,
    fontWeight: "600"
  },
  placeholder: {
    width: 40
  },
  content: {
    flex: 1
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  sectionTitle: {
    ...type.h3,
    color: colors.text,
    fontWeight: "600",
    marginBottom: spacing.md
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md
  },
  preferenceTextContainer: {
    flex: 1,
    marginRight: spacing.md
  },
  preferenceLabel: {
    ...type.body,
    color: colors.text,
    fontWeight: "500",
    marginBottom: 2
  },
  preferenceDescription: {
    ...type.caption,
    color: colors.muted,
    marginTop: 4
  }
});