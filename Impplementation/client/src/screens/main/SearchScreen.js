import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, type, shadows } from "../../theme/tokens";

export default function SearchScreen({ navigation }) {
  const [q, setQ] = useState("");
  const [activeTab, setActiveTab] = useState("Saved");

  const recentSearches = [
    "10 Vineyard Drive",
    "Ross dress for less"
  ];

  const tabs = ["Saved", "Gas", "Food", "Hotels"];

  const results = q ? [{ name: "Seattle, WA", lat: 47.6062, lon: -122.3321 }] : [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search here"
            placeholderTextColor="#666"
            value={q}
            onChangeText={setQ}
            autoFocus={true}
          />
          <Pressable style={styles.voiceButton}>
            <Ionicons name="mic" size={20} color="#666" />
          </Pressable>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {tabs.map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {/* Home, Work, Connect Calendar Options */}
        <View style={styles.optionsSection}>
          <Pressable style={styles.option}>
            <Ionicons name="home" size={20} color={colors.text} />
            <Text style={styles.optionText}>Home</Text>
            <Text style={styles.optionSubtext}>Set your end up</Text>
          </Pressable>

          <Pressable style={styles.option}>
            <Ionicons name="briefcase" size={20} color={colors.text} />
            <Text style={styles.optionText}>Work</Text>
            <Text style={styles.optionSubtext}>Set your end up</Text>
          </Pressable>

          <Pressable style={styles.option}>
            <Ionicons name="calendar" size={20} color={colors.text} />
            <Text style={styles.optionText}>Connect Calendar</Text>
            <Text style={styles.optionSubtext}>Go to events on time</Text>
          </Pressable>
        </View>

        {/* Recent Searches */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent</Text>
          {recentSearches.map((search, index) => (
            <Pressable key={index} style={styles.recentItem}>
              <Ionicons name="time" size={18} color={colors.muted} />
              <Text style={styles.recentText}>{search}</Text>
              <Text style={styles.recentSubtext}>10 minutes ago</Text>
            </Pressable>
          ))}
        </View>

        {/* Search Results */}
        {q.length > 0 && (
          <View style={styles.resultsSection}>
            <FlatList
              data={results}
              keyExtractor={(i, idx) => i.name + idx}
              renderItem={({ item }) => (
                <View style={styles.resultCard}>
                  <Text style={styles.resultName}>{item.name}</Text>
                  <Text style={styles.resultSub}>{item.lat.toFixed(3)}, {item.lon.toFixed(3)}</Text>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.empty}>No results found</Text>
              }
            />
          </View>
        )}
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
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md
  },
  backButton: {
    padding: spacing.xs
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.main
  },
  searchIcon: {
    marginRight: spacing.sm
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text
  },
  voiceButton: {
    padding: 4
  },
  tabContainer: {
    paddingBottom: spacing.md
  },
  tabScroll: {
    paddingHorizontal: spacing.lg
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  activeTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  tabText: {
    ...type.body,
    color: colors.text,
    fontWeight: "500"
  },
  activeTabText: {
    color: colors.surface,
    fontWeight: "600"
  },
  content: {
    flex: 1
  },
  optionsSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md
  },
  optionText: {
    flex: 1,
    ...type.body,
    color: colors.text,
    fontWeight: "500"
  },
  optionSubtext: {
    ...type.caption,
    color: colors.muted
  },
  recentSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl
  },
  sectionTitle: {
    ...type.h3,
    color: colors.text,
    marginBottom: spacing.md
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    gap: spacing.sm
  },
  recentText: {
    flex: 1,
    ...type.body,
    color: colors.text
  },
  recentSubtext: {
    ...type.caption,
    color: colors.muted
  },
  resultsSection: {
    paddingHorizontal: spacing.lg
  },
  resultCard: {
    backgroundColor: colors.surfaceAlt,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  resultName: {
    ...type.body,
    color: colors.text,
    fontWeight: "500"
  },
  resultSub: {
    ...type.caption,
    color: colors.muted,
    marginTop: 2
  },
  empty: {
    ...type.caption,
    color: colors.muted,
    textAlign: "center",
    marginTop: spacing.lg
  }
});
