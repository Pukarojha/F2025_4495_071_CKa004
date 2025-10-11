import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, type, radius } from "../../theme/tokens";

export default function SettingsMenuScreen({ navigation }) {
  const settingsOptions = [
    {
      section: "Settings",
      items: [
        { icon: "settings-outline", label: "General", route: "General" },
        { icon: "map-outline", label: "Map display", route: "MapDisplay" },
        { icon: "volume-high-outline", label: "Voice and Sound", route: "VoiceSound" },
      ]
    },
    {
      section: "Notifications",
      items: [
        { icon: "call-outline", label: "Phone", route: "PhoneNotifications" },
        { icon: "mail-outline", label: "Email", route: "EmailNotifications" },
      ]
    },
    {
      section: "Driving Preferences",
      items: [
        { icon: "car-outline", label: "Tolls and Express Lane Passes", route: "TollPasses" },
        { icon: "water-outline", label: "Gas Stations", route: "GasStation" },
        { icon: "speedometer-outline", label: "Speedometer", route: "Speedometer" },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <Pressable
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      {/* Settings List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {settingsOptions.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            {section.section && (
              <Text style={styles.sectionHeader}>{section.section}</Text>
            )}
            <View style={styles.sectionItems}>
              {section.items.map((item, itemIndex) => (
                <Pressable
                  key={itemIndex}
                  style={[
                    styles.settingsItem,
                    itemIndex === section.items.length - 1 && styles.settingsItemLast
                  ]}
                  onPress={() => {
                    // Navigate to specific settings screen
                    if (item.route) {
                      navigation.navigate(item.route);
                    }
                  }}
                >
                  <View style={styles.settingsItemLeft}>
                    <Ionicons name={item.icon} size={24} color={colors.text} />
                    <Text style={styles.settingsItemText}>{item.label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.muted} />
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + 20,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    ...type.h2,
    color: colors.text,
    fontWeight: "700",
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionHeader: {
    ...type.body,
    color: colors.muted,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bg,
    fontWeight: "400",
  },
  sectionItems: {
    backgroundColor: colors.surface,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  settingsItemLast: {
    borderBottomWidth: 0,
  },
  settingsItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  settingsItemText: {
    ...type.body,
    color: colors.text,
    fontWeight: "400",
  },
});