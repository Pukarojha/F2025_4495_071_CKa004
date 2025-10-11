import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Modal, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, type, radius } from "../../theme/tokens";

export default function SpeedometerScreen({ navigation }) {
  const [showSpeedLimitModal, setShowSpeedLimitModal] = useState(false);
  const [showThresholdModal, setShowThresholdModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("Miles/hr");
  const [speedLimit, setSpeedLimit] = useState("When above limit");
  const [threshold, setThreshold] = useState("At speed limit");
  const [showOnMap, setShowOnMap] = useState(true);
  const [alertWhenSpeeding, setAlertWhenSpeeding] = useState(true);

  const speedUnits = [
    { id: "miles", label: "Miles/hr", isDefault: true },
    { id: "kilometers", label: "Kilometers/hr", isDefault: false },
  ];

  const speedLimitOptions = [
    { id: "above", label: "When above limit" },
    { id: "always", label: "Always" },
    { id: "never", label: "Never" },
  ];

  const thresholdOptions = [
    { id: "at-limit", label: "At speed limit" },
    { id: "5-over", label: "5 over" },
    { id: "10-over", label: "10 over" },
    { id: "15-over", label: "15 over" },
  ];

  const handleUnitSelect = (unit) => {
    setSelectedUnit(unit);
  };

  const handleSpeedLimitSelect = (option) => {
    setSpeedLimit(option);
    setShowSpeedLimitModal(false);
  };

  const handleThresholdSelect = (option) => {
    setThreshold(option);
    setShowThresholdModal(false);
  };

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
        <Text style={styles.headerTitle}>Speedometer</Text>
        <Pressable
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      {/* Settings List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Speed Limit Section Header */}
        <Text style={styles.sectionHeader}>Speed limit</Text>

        {/* Speed Unit Selector */}
        <View style={styles.unitSelectorContainer}>
          {speedUnits.map((unit) => (
            <Pressable
              key={unit.id}
              style={[
                styles.unitButton,
                selectedUnit === unit.label && styles.unitButtonActive
              ]}
              onPress={() => handleUnitSelect(unit.label)}
            >
              <Text style={[
                styles.unitButtonText,
                selectedUnit === unit.label && styles.unitButtonTextActive
              ]}>
                {unit.label}
              </Text>
              {unit.isDefault && selectedUnit === unit.label && (
                <View style={styles.defaultBadge}>
                  <Ionicons name="checkmark" size={16} color={colors.primary} />
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Show speed limit */}
        <Pressable
          style={styles.settingItem}
          onPress={() => setShowSpeedLimitModal(true)}
        >
          <Text style={styles.settingLabel}>Show speed limit</Text>
          <View style={styles.settingValueContainer}>
            <Text style={styles.settingValue}>{speedLimit}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </View>
        </Pressable>

        {/* Speeding threshold */}
        <Pressable
          style={styles.settingItem}
          onPress={() => setShowThresholdModal(true)}
        >
          <Text style={styles.settingLabel}>Speeding threshold</Text>
          <View style={styles.settingValueContainer}>
            <Text style={styles.settingValue}>{threshold}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </View>
        </Pressable>

        {/* Show on map */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Show on map</Text>
          <Switch
            value={showOnMap}
            onValueChange={setShowOnMap}
            trackColor={{ false: colors.border, true: colors.primary + "80" }}
            thumbColor={showOnMap ? colors.primary : colors.muted}
          />
        </View>

        {/* Alert when speeding */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Alert when speeding</Text>
          <Switch
            value={alertWhenSpeeding}
            onValueChange={setAlertWhenSpeeding}
            trackColor={{ false: colors.border, true: colors.primary + "80" }}
            thumbColor={alertWhenSpeeding ? colors.primary : colors.muted}
          />
        </View>
      </ScrollView>

      {/* Speed Limit Modal */}
      <Modal
        visible={showSpeedLimitModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSpeedLimitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Pressable
                style={styles.modalBackButton}
                onPress={() => setShowSpeedLimitModal(false)}
              >
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </Pressable>
              <Text style={styles.modalTitle}>Show speed limit</Text>
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => setShowSpeedLimitModal(false)}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            {/* Speed Limit Options */}
            <ScrollView style={styles.modalScrollView}>
              {speedLimitOptions.map((option, index) => (
                <Pressable
                  key={option.id}
                  style={[
                    styles.optionItem,
                    index === speedLimitOptions.length - 1 && styles.optionItemLast
                  ]}
                  onPress={() => handleSpeedLimitSelect(option.label)}
                >
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  {speedLimit === option.label && (
                    <Ionicons name="checkmark" size={24} color={colors.primary} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Threshold Modal */}
      <Modal
        visible={showThresholdModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowThresholdModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Pressable
                style={styles.modalBackButton}
                onPress={() => setShowThresholdModal(false)}
              >
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </Pressable>
              <Text style={styles.modalTitle}>Speeding threshold</Text>
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => setShowThresholdModal(false)}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            {/* Threshold Options */}
            <ScrollView style={styles.modalScrollView}>
              {thresholdOptions.map((option, index) => (
                <Pressable
                  key={option.id}
                  style={[
                    styles.optionItem,
                    index === thresholdOptions.length - 1 && styles.optionItemLast
                  ]}
                  onPress={() => handleThresholdSelect(option.label)}
                >
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  {threshold === option.label && (
                    <Ionicons name="checkmark" size={24} color={colors.primary} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
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
  sectionHeader: {
    ...type.caption,
    color: colors.muted,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.bg,
  },
  unitSelectorContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    gap: spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  unitButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  unitButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "10",
  },
  unitButtonText: {
    ...type.body,
    color: colors.text,
    fontWeight: "400",
  },
  unitButtonTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  defaultBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg + 4,
    backgroundColor: colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  settingLabel: {
    ...type.body,
    color: colors.text,
    fontWeight: "400",
  },
  settingValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  settingValue: {
    ...type.body,
    color: colors.muted,
    fontWeight: "400",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    minHeight: "40%",
    maxHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  modalBackButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    ...type.h2,
    color: colors.text,
    fontWeight: "700",
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  modalScrollView: {
    flex: 1,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg + 4,
    backgroundColor: colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  optionItemLast: {
    borderBottomWidth: 0,
  },
  optionLabel: {
    ...type.body,
    color: colors.text,
    fontWeight: "400",
  },
});
