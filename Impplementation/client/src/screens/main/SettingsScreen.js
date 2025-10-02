import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, type } from "../../theme/tokens";

export default function SettingsScreen({ navigation }) {
  const SettingItem = ({ icon, iconType = "ionicon", title, onPress }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        {iconType === "image" ? (
          <Image source={icon} style={styles.iconImage} />
        ) : (
          <Ionicons name={icon} size={24} color={colors.text} />
        )}
        <Text style={styles.settingText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* General Settings */}
        <SettingItem
          icon="settings-outline"
          title="General"
          onPress={() => console.log("General settings")}
        />
        <SettingItem
          icon="map-outline"
          title="Map display"
          onPress={() => console.log("Map display")}
        />
        <SettingItem
          icon="volume-high-outline"
          title="Voice and Sound"
          onPress={() => console.log("Voice and Sound")}
        />

        {/* Notifications Section */}
        <SectionHeader title="Notifications" />
        <SettingItem
          icon="call-outline"
          title="Phone"
          onPress={() => navigation.getParent()?.navigate("NotificationSettings")}
        />
        <SettingItem
          icon="mail-outline"
          title="Email"
          onPress={() => console.log("Email notifications")}
        />

        {/* Driving Preferences Section */}
        <SectionHeader title="Driving Preferences" />
        <SettingItem
          icon={require("../../../assets/tolls_icon.jpg")}
          iconType="image"
          title="Tolls and Express Lane Passes"
          onPress={() => console.log("Tolls settings")}
        />
        <SettingItem
          icon={require("../../../assets/gas_icon.png")}
          iconType="image"
          title="Gas stations"
          onPress={() => console.log("Gas stations")}
        />
        <SettingItem
         icon={require("../../../assets/speedometer.png")}
          iconType="image"
          title="Speedometer"
          onPress={() => console.log("Speedometer")}
        />
      </ScrollView>
    </SafeAreaView>
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
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.muted,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: "#F5F5F5",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "400",
  },
  iconImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
