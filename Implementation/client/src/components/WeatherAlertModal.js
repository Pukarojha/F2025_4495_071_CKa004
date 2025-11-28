import React from "react";
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, type } from "../theme/tokens";
import WDButton from "./ui/WDButton";

export default function WeatherAlertModal({ visible, alert, onReroute, onStayOnRoute, onClose }) {
  if (!alert) return null;

  const getSeverityColor = (severity) => {
    const severityMap = {
      "Extreme": "#DC2626",
      "Severe": "#EA580C",
      "Moderate": "#F59E0B",
      "Minor": "#3B82F6"
    };
    return severityMap[severity] || "#6B7280";
  };

  const getSeverityIcon = (severity) => {
    const iconMap = {
      "Extreme": "warning",
      "Severe": "alert-circle",
      "Moderate": "information-circle",
      "Minor": "information-circle"
    };
    return iconMap[severity] || "information-circle";
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Alert Icon and Title */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: getSeverityColor(alert.severity) + "20" }]}>
              <Ionicons
                name={getSeverityIcon(alert.severity)}
                size={32}
                color={getSeverityColor(alert.severity)}
              />
            </View>
            <Text style={styles.title}>{alert.headline || alert.event || alert.title}</Text>
          </View>

          {/* Scrollable Alert Content */}
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.message}>
              {alert.description || alert.headline || alert.message || "Weather conditions may affect your route."}
            </Text>

            {/* Severity Badge */}
            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(alert.severity) }]}>
              <Text style={styles.severityText}>{alert.severity} Alert</Text>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Pressable
              style={[styles.button, styles.primaryButton]}
              onPress={onReroute}
            >
              <Ionicons name="git-branch-outline" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Reroute</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={onStayOnRoute}
            >
              <Text style={styles.secondaryButtonText}>Stay on route</Text>
            </Pressable>

            <Pressable onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: radius.xl,
    padding: spacing.xl,
    width: "100%",
    maxWidth: 400,
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.lg
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md
  },
  title: {
    ...type.h2,
    color: colors.text,
    textAlign: "center",
    fontWeight: "600"
  },
  scrollContainer: {
    maxHeight: 300,
    marginBottom: spacing.lg
  },
  scrollContent: {
    paddingVertical: spacing.xs
  },
  message: {
    ...type.body,
    color: colors.text,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.md
  },
  severityBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    alignSelf: "center"
  },
  severityText: {
    ...type.caption,
    color: "#fff",
    fontWeight: "600",
    fontSize: 12
  },
  actions: {
    gap: spacing.sm
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    gap: spacing.xs
  },
  primaryButton: {
    backgroundColor: colors.primary
  },
  primaryButtonText: {
    ...type.body,
    color: "#fff",
    fontWeight: "600"
  },
  secondaryButton: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border
  },
  secondaryButtonText: {
    ...type.body,
    color: colors.text,
    fontWeight: "600"
  },
  cancelButton: {
    paddingVertical: spacing.sm,
    alignItems: "center"
  },
  cancelButtonText: {
    ...type.body,
    color: colors.primary,
    fontWeight: "500"
  }
});