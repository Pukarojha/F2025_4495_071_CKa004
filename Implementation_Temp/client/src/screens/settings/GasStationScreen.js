import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, type, radius } from "../../theme/tokens";

export default function GasStationScreen({ navigation, route }) {
  const [showGasTypeModal, setShowGasTypeModal] = useState(false);
  const [showSortByModal, setShowSortByModal] = useState(false);
  const [selectedGasType, setSelectedGasType] = useState("Regular");
  const [selectedBrand, setSelectedBrand] = useState("All stations");
  const [sortBy, setSortBy] = useState("Distance");

  // Update selected brand when returning from PreferredBrandScreen
  useEffect(() => {
    if (route.params?.selectedBrand) {
      setSelectedBrand(route.params.selectedBrand);
    }
  }, [route.params?.selectedBrand]);

  const gasTypes = [
    { id: "regular", label: "Regular", selected: true },
    { id: "midgrade", label: "Midgrade", selected: false },
    { id: "premium", label: "Premium", selected: false },
    { id: "diesel", label: "Diesel", selected: false },
    { id: "flex-fuel", label: "Flex-fuel (E85)", selected: false },
    { id: "biodiesel", label: "Biodiesel", selected: false },
  ];

  const sortOptions = [
    { id: "price", label: "Price", isDefault: false },
    { id: "distance", label: "Distance", isDefault: true },
    { id: "brand", label: "Brand", isDefault: false },
  ];

  const handleGasTypeSelect = (type) => {
    setSelectedGasType(type);
    setShowGasTypeModal(false);
  };

  const handleSortBySelect = (option) => {
    setSortBy(option);
    setShowSortByModal(false);
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
        <Text style={styles.headerTitle}>Gas Station</Text>
        <Pressable
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      {/* Settings List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Preferred gas type */}
        <Pressable
          style={styles.settingItem}
          onPress={() => setShowGasTypeModal(true)}
        >
          <Text style={styles.settingLabel}>Preferred gas type</Text>
          <View style={styles.settingValueContainer}>
            <Text style={styles.settingValue}>{selectedGasType}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </View>
        </Pressable>

        {/* Preferred brand */}
        <Pressable
          style={styles.settingItem}
          onPress={() => navigation.navigate("PreferredBrand")}
        >
          <Text style={styles.settingLabel}>Preferred brand</Text>
          <View style={styles.settingValueContainer}>
            <Text style={styles.settingValue}>{selectedBrand}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </View>
        </Pressable>

        {/* Search (placeholder) */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Search</Text>
        </View>

        {/* Sort Stations by */}
        <Pressable
          style={styles.settingItem}
          onPress={() => setShowSortByModal(true)}
        >
          <Text style={styles.settingLabel}>Sort Stations by</Text>
          <View style={styles.settingValueContainer}>
            <Text style={styles.settingValue}>{sortBy}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </View>
        </Pressable>
      </ScrollView>

      {/* Gas Type Modal */}
      <Modal
        visible={showGasTypeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGasTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Pressable
                style={styles.modalBackButton}
                onPress={() => setShowGasTypeModal(false)}
              >
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </Pressable>
              <Text style={styles.modalTitle}>Gas Station</Text>
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => setShowGasTypeModal(false)}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            {/* Gas Type List */}
            <ScrollView style={styles.modalScrollView}>
              {gasTypes.map((type, index) => (
                <Pressable
                  key={type.id}
                  style={[
                    styles.gasTypeItem,
                    index === gasTypes.length - 1 && styles.gasTypeItemLast
                  ]}
                  onPress={() => handleGasTypeSelect(type.label)}
                >
                  <Text style={styles.gasTypeLabel}>{type.label}</Text>
                  {selectedGasType === type.label && (
                    <Ionicons name="checkmark" size={24} color={colors.primary} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Sort By Modal */}
      <Modal
        visible={showSortByModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSortByModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sortByModal}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Pressable
                style={styles.modalBackButton}
                onPress={() => setShowSortByModal(false)}
              >
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </Pressable>
              <Text style={styles.modalTitle}>Sort By</Text>
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => setShowSortByModal(false)}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            {/* Sort Options */}
            <View style={styles.sortOptionsContainer}>
              {sortOptions.map((option, index) => (
                <Pressable
                  key={option.id}
                  style={[
                    styles.sortOptionItem,
                    index === sortOptions.length - 1 && styles.sortOptionItemLast
                  ]}
                  onPress={() => handleSortBySelect(option.label)}
                >
                  <View style={styles.sortOptionLeft}>
                    <View style={[
                      styles.checkbox,
                      sortBy === option.label && styles.checkboxChecked
                    ]}>
                      {sortBy === option.label && (
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      )}
                    </View>
                    <Text style={styles.sortOptionLabel}>{option.label}</Text>
                  </View>
                  {option.isDefault && (
                    <Text style={styles.defaultLabel}>Default</Text>
                  )}
                </Pressable>
              ))}
            </View>
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
    minHeight: "50%",
    maxHeight: "80%",
  },
  sortByModal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    minHeight: "40%",
    maxHeight: "50%",
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
  gasTypeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg + 4,
    backgroundColor: colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  gasTypeItemLast: {
    borderBottomWidth: 0,
  },
  gasTypeLabel: {
    ...type.body,
    color: colors.text,
    fontWeight: "400",
  },
  sortOptionsContainer: {
    padding: spacing.lg,
  },
  sortOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  sortOptionItemLast: {
    borderBottomWidth: 0,
  },
  sortOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortOptionLabel: {
    ...type.body,
    color: colors.text,
    fontWeight: "400",
  },
  defaultLabel: {
    ...type.caption,
    color: colors.muted,
  },
});