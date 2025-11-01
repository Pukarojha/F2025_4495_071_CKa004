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
    { id: "dont-show", label: "Don't Show" },
    { id: "above", label: "When above limit" },
    { id: "always", label: "Always" },
  ];

  const thresholdOptions = [
    { id: "at-limit", label: "At speed limit" },
    { id: "5-above", label: "5 above limit" },
    { id: "10-above", label: "10 above limit" },
    { id: "15-above", label: "15 above limit" },
    { id: "20-above", label: "20 above limit" },
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

        {/* Speed Unit Selector Card */}
        <View style={styles.card}>
          <View style={styles.unitSelectorContainer}>
            {speedUnits.map((unit, index) => (
              <Pressable
                key={unit.id}
                style={[
                  styles.unitButton,
                  selectedUnit === unit.label && styles.unitButtonActive,
                  index === speedUnits.length - 1 && styles.unitButtonLast
                ]}
                onPress={() => handleUnitSelect(unit.label)}
              >
                <View style={styles.unitButtonContent}>
                  <Text style={[
                    styles.unitButtonText,
                    selectedUnit === unit.label && styles.unitButtonTextActive
                  ]}>
                    {unit.label}
                  </Text>
                  {unit.isDefault && selectedUnit === unit.label && (
                    <Text style={styles.defaultLabel}>Default</Text>
                  )}
                </View>
                {selectedUnit === unit.label && (
                  <Ionicons name="checkmark" size={20} color="#32B8C6" />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Settings Card */}
        <View style={styles.card}>
          {/* Show speed limit */}
          <Pressable
            style={[styles.settingItem, styles.settingItemFirst]}
            onPress={() => setShowSpeedLimitModal(true)}
          >
            <Text style={styles.settingLabel}>Show speed limit</Text>
            <View style={styles.settingValueContainer}>
              <Text style={styles.settingValue}>{speedLimit}</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
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
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </Pressable>
        </View>

        {/* Toggle Settings Card */}
        <View style={styles.card}>
          {/* Show on map */}
          <View style={[styles.settingItem, styles.settingItemFirst]}>
            <Text style={styles.settingLabel}>Show on map</Text>
            <Switch
              value={showOnMap}
              onValueChange={setShowOnMap}
              trackColor={{ false: "#E5E5E5", true: "#32B8C6" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E5E5"
            />
          </View>

          {/* Alert when speeding */}
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Alert when speeding</Text>
            <Switch
              value={alertWhenSpeeding}
              onValueChange={setAlertWhenSpeeding}
              trackColor={{ false: "#E5E5E5", true: "#32B8C6" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E5E5"
            />
          </View>
        </View>
      </ScrollView>

      {/* Speed Limit Modal */}
      <Modal
        visible={showSpeedLimitModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSpeedLimitModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowSpeedLimitModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Pressable
                style={styles.modalBackButton}
                onPress={() => setShowSpeedLimitModal(false)}
              >
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </Pressable>
              <Text style={styles.modalTitle}>Show Speed Limit</Text>
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => setShowSpeedLimitModal(false)}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            {/* Speed Limit Options */}
            <ScrollView 
              style={styles.modalScrollView}
              contentContainerStyle={styles.modalScrollContent}
            >
              <View style={styles.modalOptionsCard}>
                {speedLimitOptions.map((option, index) => (
                  <Pressable
                    key={option.id}
                    style={[
                      styles.modalOptionItem,
                      index === 0 && styles.modalOptionItemFirst,
                      index === speedLimitOptions.length - 1 && styles.modalOptionItemLast
                    ]}
                    onPress={() => handleSpeedLimitSelect(option.label)}
                  >
                    <View style={styles.modalOptionCheckContainer}>
                      {speedLimit === option.label && (
                        <Ionicons name="checkmark" size={24} color="#32B8C6" />
                      )}
                    </View>
                    <Text style={styles.modalOptionLabel}>{option.label}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Threshold Modal */}
      <Modal
        visible={showThresholdModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowThresholdModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowThresholdModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Pressable
                style={styles.modalBackButton}
                onPress={() => setShowThresholdModal(false)}
              >
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </Pressable>
              <Text style={styles.modalTitle}>Speeding Threshold</Text>
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => setShowThresholdModal(false)}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            {/* Threshold Options */}
            <ScrollView 
              style={styles.modalScrollView}
              contentContainerStyle={styles.modalScrollContent}
            >
              <View style={styles.modalOptionsCard}>
                {thresholdOptions.map((option, index) => (
                  <Pressable
                    key={option.id}
                    style={[
                      styles.modalOptionItem,
                      index === 0 && styles.modalOptionItemFirst,
                      index === thresholdOptions.length - 1 && styles.modalOptionItemLast
                    ]}
                    onPress={() => handleThresholdSelect(option.label)}
                  >
                    <View style={styles.modalOptionCheckContainer}>
                      {threshold === option.label && (
                        <Ionicons name="checkmark" size={24} color="#32B8C6" />
                      )}
                    </View>
                    <Text style={styles.modalOptionLabel}>{option.label}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + 20,
    paddingBottom: spacing.lg,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    color: colors.text,
    fontWeight: "600",
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
    fontSize: 13,
    color: "#999",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: "#F5F5F5",
    textTransform: "capitalize",
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  unitSelectorContainer: {
    flexDirection: "column",
    padding: 0,
  },
  unitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  unitButtonActive: {
    borderLeftColor: "#32B8C6",
    borderLeftWidth: 3,
    backgroundColor: "#E8F7F9",
  },
  unitButtonLast: {
    borderBottomWidth: 0,
  },
  unitButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  unitButtonText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "400",
  },
  unitButtonTextActive: {
    color: colors.text,
    fontWeight: "500",
  },
  defaultLabel: {
    fontSize: 14,
    color: "#999",
    fontWeight: "400",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0.5,
    borderTopColor: "#F0F0F0",
  },
  settingItemFirst: {
    borderTopWidth: 0,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "700",
  },
  settingValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  settingValue: {
    fontSize: 16,
    color: "#999",
    fontWeight: "400",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "40%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg + 4,
    paddingBottom: spacing.lg,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalBackButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 18,
    color: colors.text,
    fontWeight: "600",
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
  modalScrollContent: {
    padding: spacing.lg,
  },
  modalOptionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  modalOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  modalOptionItemFirst: {
    // First item styling if needed
  },
  modalOptionItemLast: {
    borderBottomWidth: 0,
  },
  modalOptionCheckContainer: {
    width: 30,
    alignItems: "flex-start",
    marginRight: spacing.sm,
  },
  modalOptionLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "400",
    flex: 1,
  },
});
