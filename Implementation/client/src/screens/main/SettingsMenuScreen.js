import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native"; // <--- ADD THIS IMPORT
import { signOut } from "aws-amplify/auth";
import { colors, spacing, type } from "../../theme/tokens";

export default function SettingsMenuScreen({ navigation }) {
  
  // --- SIGN OUT LOGIC (UPDATED) ---
  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          style: "destructive", 
          onPress: async () => {
            try {
              // 1. Global Sign Out (Attempts to clear browser session too)
              await signOut({ global: true });
              
              // 2. Force Navigation Reset (Send to SignIn and clear history)
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "SignIn" }],
                })
              );
            } catch (error) {
              console.error("Error signing out:", error);
              Alert.alert("Error", "Failed to sign out.");
            }
          }
        }
      ]
    );
  };

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
    },
    // --- ACCOUNT SECTION ---
    {
      section: "Account",
      items: [
        { 
          icon: "log-out-outline", 
          label: "Log Out", 
          action: handleSignOut, 
          isDestructive: true 
        },
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
                    // 1. Handle Custom Actions (like Sign Out)
                    if (item.action) {
                      item.action();
                      return;
                    }

                    // 2. Handle Notifications specific logic
                    if (section.section === "Notifications") {
                      if (item.label === "Phone") {
                        navigation.navigate("NotificationSettings", { initialTab: "Push" });
                        return;
                      }
                      if (item.label === "Email") {
                        navigation.navigate("NotificationSettings", { initialTab: "Email" });
                        return;
                      }
                    }

                    // 3. Handle Navigation
                    if (item.route) {
                      navigation.navigate(item.route);
                    }
                  }}
                >
                  <View style={styles.settingsItemLeft}>
                    <Ionicons 
                      name={item.icon} 
                      size={24} 
                      color={item.isDestructive ? "#FF3B30" : colors.text} 
                    />
                    <Text style={[
                      styles.settingsItemText,
                      item.isDestructive && { color: "#FF3B30" } 
                    ]}>
                      {item.label}
                    </Text>
                  </View>
                  
                  {/* Hide chevron for actions like logout */}
                  {!item.action && (
                    <Ionicons name="chevron-forward" size={20} color={colors.muted} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        ))}
        {/* Bottom padding for scrolling */}
        <View style={{ height: 40 }} /> 
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