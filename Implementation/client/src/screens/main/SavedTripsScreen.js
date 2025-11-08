import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, type } from "../../theme/tokens";

export default function SavedTripsScreen({ navigation }) {
  const savedTrips = [
    {
      id: 1,
      name: "Home",
      address: "101 Roehampton Avenue, Toronto, ON",
      type: "home",
      note: "You're already here"
    },
    {
      id: 2,
      name: "Work",
      address: "via I-75 S",
      distance: "8.11 mi",
      traffic: "Low traffic",
      time: "11 am"
    },
    {
      id: 3,
      name: "Gym",
      address: "via I-94 Gib St",
      distance: "9.07 mi",
      traffic: "Heavy traffic",
      time: "9:07 am"
    },
    {
      id: 4,
      name: "School",
      address: "via Cloverleaf St NE",
      distance: "8.33 mi",
      traffic: "Light traffic",
      time: "8:33 am"
    }
  ];

  const suggested = [
    {
      id: 5,
      name: "Planet Fitness",
      address: "874 W Peachtree St NW Ste 222, Atlanta, GA"
    },
    {
      id: 6,
      name: "60 East Beaver Creek Road",
      address: "Richmond Hill, ON"
    },
    {
      id: 7,
      name: "#2256 Costco",
      address: "2905 Carlingwood Mall"
    },
    {
      id: 8,
      name: "10 Tobermory Drive",
      address: "Toronto, ON"
    }
  ];

  const renderTripItem = (trip) => (
    <Pressable
      key={trip.id}
      style={styles.tripItem}
      onPress={() => {
        navigation.navigate("Map");
      }}
    >
      <View style={styles.tripIcon}>
        {trip.type === "home" ? (
          <Ionicons name="home" size={20} color={colors.primary} />
        ) : (
          <Ionicons name="location" size={20} color={colors.primary} />
        )}
      </View>
      <View style={styles.tripContent}>
        <Text style={styles.tripName}>{trip.name}</Text>
        <View style={styles.tripDetails}>
          {trip.note ? (
            <Text style={styles.tripNote}>{trip.note}</Text>
          ) : (
            <>
              <Text style={styles.tripAddress}>{trip.address}</Text>
              {trip.distance && (
                <View style={styles.tripMeta}>
                  <Ionicons name="car" size={12} color={colors.muted} />
                  <Text style={styles.tripDistance}>{trip.distance}</Text>
                  <Text style={styles.tripSeparator}>•</Text>
                  <Text
                    style={[
                      styles.tripTraffic,
                      trip.traffic === "Heavy traffic" && styles.trafficHeavy,
                      trip.traffic === "Light traffic" && styles.trafficLight
                    ]}
                  >
                    {trip.traffic}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>
      {trip.time && (
        <Pressable style={styles.startButton}>
          <Ionicons name="navigate" size={16} color={colors.primary} />
          <Text style={styles.startButtonText}>Start</Text>
        </Pressable>
      )}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Saved Trips</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Saved Trips Section */}
        <View style={styles.section}>
          {savedTrips.map(renderTripItem)}
        </View>

        {/* Suggested Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested</Text>
          <Text style={styles.sectionSubtitle}>
            Driving trips based on your past activity
          </Text>
          {suggested.map((item) => (
            <Pressable
              key={item.id}
              style={styles.suggestedItem}
              onPress={() => {
                navigation.navigate("Map");
              }}
            >
              <Ionicons name="time-outline" size={20} color={colors.muted} />
              <View style={styles.suggestedContent}>
                <Text style={styles.suggestedName}>{item.name}</Text>
                <Text style={styles.suggestedAddress}>{item.address}</Text>
              </View>
            </Pressable>
          ))}
          <Pressable style={styles.moreButton}>
            <Text style={styles.moreButtonText}>More from recent history</Text>
          </Pressable>
        </View>
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
    justifyContent: "space-between",
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  backButton: {
    padding: spacing.xs
  },
  headerTitle: {
    ...type.h2,
    color: colors.text,
    fontWeight: "600"
  },
  placeholder: {
    width: 40
  },
  content: {
    flex: 1
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  sectionTitle: {
    ...type.h3,
    color: colors.text,
    fontWeight: "600",
    marginBottom: spacing.xs
  },
  sectionSubtitle: {
    ...type.caption,
    color: colors.muted,
    marginBottom: spacing.md
  },
  tripItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md
  },
  tripIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center"
  },
  tripContent: {
    flex: 1
  },
  tripName: {
    ...type.body,
    color: colors.text,
    fontWeight: "600",
    marginBottom: 4
  },
  tripDetails: {
    gap: 4
  },
  tripNote: {
    ...type.caption,
    color: colors.muted
  },
  tripAddress: {
    ...type.caption,
    color: colors.muted
  },
  tripMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  tripDistance: {
    ...type.caption,
    color: colors.muted
  },
  tripSeparator: {
    ...type.caption,
    color: colors.muted
  },
  tripTraffic: {
    ...type.caption,
    color: colors.muted
  },
  trafficHeavy: {
    color: "#EF4444"
  },
  trafficLight: {
    color: "#10B981"
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    gap: 4
  },
  startButtonText: {
    ...type.caption,
    color: colors.primary,
    fontWeight: "600"
  },
  suggestedItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  suggestedContent: {
    flex: 1
  },
  suggestedName: {
    ...type.body,
    color: colors.text,
    fontWeight: "500",
    marginBottom: 4
  },
  suggestedAddress: {
    ...type.caption,
    color: colors.muted
  },
  moreButton: {
    alignItems: "center",
    paddingVertical: spacing.md,
    marginTop: spacing.sm
  },
  moreButtonText: {
    ...type.body,
    color: colors.primary,
    fontWeight: "600"
  }
});