import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, type, radius } from "../../theme/tokens";

export default function PreferredBrandScreen({ navigation }) {
  const [searchText, setSearchText] = useState("");

  const gasBrands = [
    "All Stations",
    "Aloha Petroleum",
    "Alon",
    "Amoco",
    "ARCO",
    "BP",
    "Buc-ee's",
    "Casey's General Stores",
    "CENEX",
    "Certified",
    "Chevron",
    "Circle K",
    "Citgo",
    "Clark Brands",
    "Conoco",
    "Costco (Kirkland Brand gasoline)",
    "Crown",
    "Cumberland Farms",
    "DK",
    "EddieWorld",
    "Exxon",
    "Family Express - Indiana",
    "Flying J",
    "GasAmerica",
    "Gas City, Ltd.",
    "Getty",
    "Go-Mart",
    "Gulf",
    "Hele",
    "High's Diary Stores",
    "Holiday",
    "Irving Oil",
    "Jacksons Food Stores",
    "King Soopers",
    "Krist",
    "Kroger Brand Gasoline",
    "Kum & Go",
    "Kwik Trip",
    "Kwik Fill",
    "Love's",
    "Lukoil",
    "Marathon Oil",
    "Maverik",
    "Meijer",
    "Minit Mart",
    "Mobil",
    "Murphy USA",
    "OXXO Gas",
    "Pemex",
    "Petro Canada",
    "Phillips 66",
    "Pilot",
    "QuickChek",
    "QuikTrip",
    "RaceTrac/Raceway",
    "Redner's",
    "Royal Farms",
    "Rutter's Farm Stores",
    "76",
    "Sam's Club",
    "Safeway",
    "Sheetz",
    "Shell",
    "Sinclair",
    "Speedway",
    "Stewart's Shops",
    "Sunoco",
    "Tesoro",
    "Terrible Herbst",
    "Texaco",
    "Thorntons Inc.",
    "Total",
    "Travel Centers of America",
    "Turkey Hill Minit Markets",
    "Valero",
    "Wally's",
    "Walmart brand gasoline",
    "Wawa",
  ];

  const filteredBrands = searchText
    ? gasBrands.filter(brand =>
        brand.toLowerCase().includes(searchText.toLowerCase())
      )
    : gasBrands;

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
        <Text style={styles.headerTitle}>Preferred Brand</Text>
        <Pressable
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Stations"
            placeholderTextColor={colors.muted}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Brand List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredBrands.map((brand, index) => (
          <Pressable
            key={index}
            style={[
              styles.brandItem,
              index === filteredBrands.length - 1 && styles.brandItemLast
            ]}
            onPress={() => {
              // Pass selected brand back and navigate
              navigation.navigate("GasStation", { selectedBrand: brand });
            }}
          >
            <Ionicons name="business-outline" size={24} color={colors.text} />
            <Text style={styles.brandLabel}>{brand}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
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
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    ...type.body,
    color: colors.text,
    padding: 0,
  },
  scrollView: {
    flex: 1,
  },
  brandItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  brandItemLast: {
    borderBottomWidth: 0,
  },
  brandLabel: {
    ...type.body,
    color: colors.text,
    fontWeight: "400",
  },
});