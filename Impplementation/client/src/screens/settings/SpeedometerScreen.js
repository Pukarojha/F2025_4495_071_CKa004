import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Modal, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Speedometer</Text>
        <Pressable
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={28} color="#000" />
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Section Header */}
        <Text style={styles.sectionHeader}>Speed limit</Text>

        {/* Speed Unit Cards */}
        <View style={styles.cardsContainer}>
          {speedUnits.map((unit) => (
            <Pressable
              key={unit.id}
              style={[
                styles.unitCard,
                selectedUnit === unit.label && styles.unitCardSelected
              ]}
              onPress={() => handleUnitSelect(unit.label)}
            >
              <Text style={[
                styles.unitCardText,
                selectedUnit === unit.label && styles.unitCardTextSelected
              ]}>
                {unit.label}
              </Text>
              {unit.isDefault && selectedUnit === unit.label && (
                <View style={styles.defaultBadgeContainer}>
                  <Text style={styles.defaultBadgeText}>Default</Text>
                  <View style={styles.checkmarkCircle}>
                    <Ionicons name="checkmark" size={14} color="#00BCD4" />
                  </View>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Show speed limit */}
        <Pressable
          style={styles.settingCard}
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
          style={styles.settingCard}
          onPress={() => setShowThresholdModal(true)}
        >
          <Text style={styles.settingLabel}>Speeding threshold</Text>
          <View style={styles.settingValueContainer}>
            <Text style={styles.settingValue}>{threshold}</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </View>
        </Pressable>

        {/* Show on map */}
        <View style={styles.toggleCard}>
          <Text style={styles.settingLabel}>Show on map</Text>
          <Switch
            value={showOnMap}
            onValueChange={setShowOnMap}
            trackColor={{ false: "#E0E0E0", true: "#80DEEA" }}
            thumbColor={showOnMap ? "#00BCD4" : "#f4f3f4"}
            ios_backgroundColor="#E0E0E0"
          />
        </View>

        {/* Alert when speeding */}
        <View style={styles.toggleCard}>
          <Text style={styles.settingLabel}>Alert when speeding</Text>
          <Switch
            value={alertWhenSpeeding}
            onValueChange={setAlertWhenSpeeding}
            trackColor={{ false: "#E0E0E0", true: "#80DEEA" }}
            thumbColor={alertWhenSpeeding ? "#00BCD4" : "#f4f3f4"}
            ios_backgroundColor="#E0E0E0"
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
            <View style={styles.modalHeader}>
              <Pressable
                style={styles.modalBackButton}
                onPress={() => setShowSpeedLimitModal(false)}
              >
                <Ionicons name="arrow-back" size={24} color="#000" />
              </Pressable>
              <Text style={styles.modalTitle}>Show speed limit</Text>
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => setShowSpeedLimitModal(false)}
              >
                <Ionicons name="close" size={28} color="#000" />
              </Pressable>
            </View>

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
                    <Ionicons name="checkmark" size={24} color="#00BCD4" />
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
            <View style={styles.modalHeader}>
              <Pressable
                style={styles.modalBackButton}
                onPress={() => setShowThresholdModal(false)}
              >
                <Ionicons name="arrow-back" size={24} color="#000" />
              </Pressable>
              <Text style={styles.modalTitle}>Speeding threshold</Text>
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => setShowThresholdModal(false)}
              >
                <Ionicons name="close" size={28} color="#000" />
              </Pressable>
            </View>

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
                    <Ionicons name="checkmark" size={24} color="#00BCD4" />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F5F5F5",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    marginBottom: 16,
    marginLeft: 4,
  },
  cardsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  unitCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  unitCardSelected: {
    borderColor: "#00BCD4",
    backgroundColor: "#fff",
  },
  unitCardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  unitCardTextSelected: {
    color: "#000",
  },
  defaultBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  defaultBadgeText: {
    fontSize: 13,
    color: "#999",
  },
  checkmarkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#00BCD4",
  },
  settingCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  settingValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  settingValue: {
    fontSize: 15,
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "40%",
    maxHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0",
  },
  modalBackButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
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
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0",
  },
  optionItemLast: {
    borderBottomWidth: 0,
  },
  optionLabel: {
    fontSize: 16,
    color: "#000",
  },
});
