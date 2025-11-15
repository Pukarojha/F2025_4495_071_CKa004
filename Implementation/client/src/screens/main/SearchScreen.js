import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, type } from "../../theme/tokens";
import { useSavedLocations } from "../../hooks/useSavedLocations";

export default function SearchScreen({ navigation }) {
  const [startLocation, setStartLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const { savedLocations, loading: loadingSavedLocations, refreshLocations } = useSavedLocations();

  // Refresh saved locations when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshLocations();
    });
    return unsubscribe;
  }, [navigation, refreshLocations]);

  // Navigate to route preview when both locations are selected
  useEffect(() => {
    if (startLocation && destination) {
      // Small delay to allow UI to update before navigating
      const timer = setTimeout(() => {
        navigation.navigate('RoutePreview', {
          origin: startLocation,
          destination: destination
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [startLocation, destination, navigation]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Pressable style={styles.voiceButton}>
          <Ionicons name="mic-outline" size={24} color={colors.text} />
        </Pressable>
      </View>

      {/* Route Inputs */}
      <View style={styles.routeInputsContainer}>
        <View style={styles.inputsBox}>
          {/* Start Location Input */}
          <Pressable
            style={styles.inputRow}
            onPress={() => navigation.navigate('ChooseStartLocation', {
              onSelectLocation: (location) => setStartLocation(location)
            })}
          >
            <View style={styles.iconContainer}>
              <View style={styles.startDot} />
            </View>
            <View style={styles.inputTextContainer}>
              <Text style={[styles.inputText, !startLocation && styles.placeholderText]}>
                {startLocation?.address || startLocation || "Choose start location"}
              </Text>
            </View>
          </Pressable>

          {/* Destination Input */}
          <Pressable
            style={[styles.inputRow, styles.lastInputRow]}
            onPress={() => navigation.navigate('ChooseDestination', {
              onSelectLocation: (location) => setDestination(location)
            })}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="location" size={20} color="#EF4444" />
            </View>
            <View style={styles.inputTextContainer}>
              <Text style={[styles.inputText, !destination && styles.placeholderText]}>
                {destination?.address || destination || "Choose destination"}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Saved Locations List */}
      <ScrollView style={styles.content}>
        {loadingSavedLocations ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Loading saved locations...</Text>
          </View>
        ) : (
          savedLocations.map((location) => (
            <Pressable
              key={location.id}
              style={[styles.locationItem, location.isPlaceholder && styles.placeholderItem]}
              onPress={() => {
                // Skip if placeholder (location not set)
                if (location.isPlaceholder) {
                  return;
                }
                // Handle location selection with coordinates if available
                const locationData = {
                  address: location.address,
                  name: location.name,
                  ...(location.coordinates && { coordinates: location.coordinates })
                };

                if (!startLocation) {
                  setStartLocation(locationData);
                } else if (!destination) {
                  setDestination(locationData);
                }
              }}
              disabled={location.isPlaceholder}
            >
              <View style={styles.locationIcon}>
                <Ionicons name={location.icon} size={20} color={location.isPlaceholder ? colors.muted : colors.text} />
              </View>
              <View style={styles.locationContent}>
                <Text style={[styles.locationName, location.isPlaceholder && styles.placeholderName]}>{location.name}</Text>
                <Text style={[styles.locationAddress, location.isPlaceholder && styles.placeholderAddress]}>{location.address}</Text>
              </View>
            </Pressable>
          ))
        )}

        {/* More from recent history */}
        <Pressable style={styles.moreButton}>
          <Text style={styles.moreButtonText}>More from recent history</Text>
        </Pressable>
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
    paddingBottom: spacing.md
  },
  backButton: {
    padding: spacing.xs
  },
  voiceButton: {
    padding: spacing.xs
  },
  routeInputsContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg
  },
  inputsBox: {
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md
  },
  lastInputRow: {
    borderBottomWidth: 0
  },
  iconContainer: {
    width: 24,
    alignItems: "center",
    justifyContent: "center"
  },
  startDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.primary
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 0
  },
  inputTextContainer: {
    flex: 1,
    justifyContent: "center"
  },
  inputText: {
    fontSize: 16,
    color: colors.text
  },
  placeholderText: {
    color: colors.muted
  },
  content: {
    flex: 1
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center"
  },
  locationContent: {
    flex: 1
  },
  locationName: {
    ...type.body,
    color: colors.text,
    fontWeight: "600",
    marginBottom: 4
  },
  locationAddress: {
    ...type.caption,
    color: colors.muted
  },
  moreButton: {
    alignItems: "center",
    paddingVertical: spacing.lg,
    marginTop: spacing.md
  },
  moreButtonText: {
    ...type.body,
    color: colors.primary,
    fontWeight: "600"
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    gap: spacing.sm
  },
  loadingText: {
    ...type.body,
    color: colors.muted
  },
  placeholderItem: {
    opacity: 0.6
  },
  placeholderName: {
    color: colors.muted
  },
  placeholderAddress: {
    fontStyle: "italic"
  }
});
