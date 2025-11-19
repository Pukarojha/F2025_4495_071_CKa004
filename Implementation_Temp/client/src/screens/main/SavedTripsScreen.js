import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import { colors, spacing, radius, type } from "../../theme/tokens";
import { getSavedTrips, saveTripLocation } from "../../services/savedTripsStorage";
import { getNearbyPlaces, getDirections } from "../../services/googleMapsService";

export default function SavedTripsScreen({ navigation }) {
  const [savedTrips, setSavedTrips] = useState({
    home: null,
    work: null,
    gym: null,
    school: null
  });
  const [suggestedPlaces, setSuggestedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [tripInfo, setTripInfo] = useState({});

  useEffect(() => {
    loadSavedTrips();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      fetchNearbyPlaces();
      calculateTripInfo();
    }
  }, [currentLocation, savedTrips]);

  const loadSavedTrips = async () => {
    const trips = await getSavedTrips();
    setSavedTrips(trips);
    setLoading(false);
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        setLoadingSuggestions(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    } catch (error) {
      console.error('Error getting location:', error);
      setLoadingSuggestions(false);
    }
  };

  const fetchNearbyPlaces = async () => {
    if (!currentLocation) return;

    setLoadingSuggestions(true);
    try {
      const result = await getNearbyPlaces(currentLocation, 10000);
      if (result.success && result.places.length > 0) {
        // Filter for popular places with ratings
        const popularPlaces = result.places
          .filter(place => place.rating && place.rating >= 4.0)
          .slice(0, 4)
          .map(place => ({
            id: place.id,
            name: place.name,
            address: place.address
          }));
        setSuggestedPlaces(popularPlaces);
      }
    } catch (error) {
      console.error('Error fetching nearby places:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const calculateTripInfo = async () => {
    if (!currentLocation) return;

    const tripTypes = ['home', 'work', 'gym', 'school'];
    const newTripInfo = {};

    for (const type of tripTypes) {
      if (savedTrips[type] && savedTrips[type].coordinates) {
        try {
          const result = await getDirections(
            currentLocation,
            savedTrips[type].coordinates,
            { alternatives: false }
          );

          if (result.success && result.routes.length > 0) {
            const route = result.routes[0];
            const leg = route.legs[0];

            newTripInfo[type] = {
              distance: leg.distance.text,
              duration: leg.duration.text,
              traffic: getTrafficStatus(leg.duration.value)
            };
          }
        } catch (error) {
          console.error(`Error calculating trip info for ${type}:`, error);
        }
      }
    }

    setTripInfo(newTripInfo);
  };

  const getTrafficStatus = (durationSeconds) => {
    // Simple traffic estimation based on typical times
    const minutes = durationSeconds / 60;
    if (minutes < 15) return 'Light traffic';
    if (minutes < 30) return 'Low traffic';
    return 'Heavy traffic';
  };

  const handleTripPress = (type) => {
    // Always allow changing location, whether set or not
    navigation.navigate('LocationPicker', {
      title: getTripName(type),
      onSelectLocation: async (locationData) => {
        await saveTripLocation(type, locationData);
        await loadSavedTrips();
        if (currentLocation) {
          calculateTripInfo();
        }
      }
    });
  };

  const handleStartNavigation = (type) => {
    if (savedTrips[type] && savedTrips[type].coordinates && currentLocation) {
      navigation.navigate('RoutePreview', {
        origin: {
          address: 'Your location',
          coordinates: currentLocation
        },
        destination: {
          address: savedTrips[type].address,
          coordinates: savedTrips[type].coordinates
        }
      });
    }
  };

  const handleSuggestedPlacePress = (place) => {
    navigation.navigate('RoutePreview', {
      origin: {
        address: 'Your location',
        coordinates: currentLocation
      },
      destination: {
        address: place.address,
        name: place.name
      }
    });
  };

  const getTripIcon = (type) => {
    switch (type) {
      case 'home':
        return 'home';
      case 'work':
        return 'briefcase';
      case 'gym':
        return 'fitness';
      case 'school':
        return 'school';
      default:
        return 'location';
    }
  };

  const getTripName = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const isAtLocation = (type) => {
    if (!currentLocation || !savedTrips[type] || !savedTrips[type].coordinates) {
      return false;
    }

    const distance = getDistanceBetweenPoints(
      currentLocation,
      savedTrips[type].coordinates
    );

    return distance < 0.1; // Less than 100 meters
  };

  const getDistanceBetweenPoints = (point1, point2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(point2.latitude - point1.latitude);
    const dLon = toRad(point2.longitude - point1.longitude);
    const lat1 = toRad(point1.latitude);
    const lat2 = toRad(point2.latitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value) => {
    return value * Math.PI / 180;
  };

  const renderTripItem = (type) => {
    const trip = savedTrips[type];
    const info = tripInfo[type];
    const atLocation = isAtLocation(type);

    return (
      <Pressable
        key={type}
        style={styles.tripItem}
        onPress={() => handleTripPress(type)}
      >
        <View style={styles.tripIcon}>
          <Ionicons name={getTripIcon(type)} size={20} color={colors.primary} />
        </View>
        <View style={styles.tripContent}>
          <Text style={styles.tripName}>{getTripName(type)}</Text>
          <View style={styles.tripDetails}>
            {!trip ? (
              <Text style={styles.tripNote}>Tap to set location</Text>
            ) : (
              <>
                <Text style={styles.tripAddress}>{trip.address}</Text>
                {atLocation ? (
                  <Text style={styles.tripNote}>You're already here</Text>
                ) : info && (
                  <View style={styles.tripMeta}>
                    <Ionicons name="car" size={12} color={colors.muted} />
                    <Text style={styles.tripDistance}>{info.distance}</Text>
                    <Text style={styles.tripSeparator}>•</Text>
                    <Text
                      style={[
                        styles.tripTraffic,
                        info.traffic === "Heavy traffic" && styles.trafficHeavy,
                        info.traffic === "Light traffic" && styles.trafficLight
                      ]}
                    >
                      {info.traffic}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
        {trip && !atLocation && (
          <Pressable
            style={styles.startButton}
            onPress={() => handleStartNavigation(type)}
          >
            <Ionicons name="navigate" size={16} color={colors.primary} />
            <Text style={styles.startButtonText}>Start</Text>
          </Pressable>
        )}
      </Pressable>
    );
  };

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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <View style={styles.section}>
            {renderTripItem('home')}
            {renderTripItem('work')}
            {renderTripItem('gym')}
            {renderTripItem('school')}
          </View>
        )}

        {/* Suggested Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested</Text>
          <Text style={styles.sectionSubtitle}>
            Popular places near you
          </Text>
          {loadingSuggestions ? (
            <View style={styles.suggestionsLoading}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Finding popular places...</Text>
            </View>
          ) : suggestedPlaces.length > 0 ? (
            <>
              {suggestedPlaces.map((place) => (
                <Pressable
                  key={place.id}
                  style={styles.suggestedItem}
                  onPress={() => handleSuggestedPlacePress(place)}
                >
                  <Ionicons name="location-outline" size={20} color={colors.muted} />
                  <View style={styles.suggestedContent}>
                    <Text style={styles.suggestedName}>{place.name}</Text>
                    <Text style={styles.suggestedAddress}>{place.address}</Text>
                  </View>
                </Pressable>
              ))}
            </>
          ) : (
            <Text style={styles.noSuggestionsText}>
              No popular places found nearby
            </Text>
          )}
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
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center'
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
    color: colors.muted,
    fontStyle: 'italic'
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
  suggestionsLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.md
  },
  loadingText: {
    ...type.body,
    color: colors.muted
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
  noSuggestionsText: {
    ...type.body,
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: spacing.lg
  }
});