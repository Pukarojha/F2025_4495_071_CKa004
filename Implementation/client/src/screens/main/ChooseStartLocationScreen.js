import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { colors, spacing, radius, type } from "../../theme/tokens";
import { reverseGeocode, getPlaceAutocomplete, getPlaceDetails } from "../../services/googleMapsService";
import { useSavedLocations } from "../../hooks/useSavedLocations";

export default function ChooseStartLocationScreen({ navigation, route }) {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { onSelectLocation } = route.params || {};
  const { savedLocations, loading: loadingSavedLocations, refreshLocations } = useSavedLocations();

  // Refresh saved locations when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshLocations();
    });
    return unsubscribe;
  }, [navigation, refreshLocations]);

  // Debounced search for autocomplete
  useEffect(() => {
    if (searchText.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    const delaySearch = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await getPlaceAutocomplete(searchText);
        if (response.success && response.predictions) {
          // Map the predictions to match the expected format
          const formattedResults = response.predictions.map(pred => ({
            place_id: pred.id,
            description: pred.description,
            structured_formatting: {
              main_text: pred.mainText,
              secondary_text: pred.secondaryText
            }
          }));
          setSearchResults(formattedResults);
        } else {
          console.log("Autocomplete API error:", response.error, response.message);
          setSearchResults([]);
        }
      } catch (error) {
        console.log("Error fetching autocomplete:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delaySearch);
  }, [searchText]);

  const handleSelectLocation = (location) => {
    // Skip if placeholder (location not set)
    if (location.isPlaceholder) {
      return;
    }

    if (onSelectLocation) {
      // Pass full location data with coordinates if available
      const locationData = {
        address: location.address,
        name: location.name,
        ...(location.coordinates && { coordinates: location.coordinates })
      };
      onSelectLocation(locationData);
    }
    navigation.goBack();
  };

  const handleSelectCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Get address from coordinates using reverse geocoding
      const response = await reverseGeocode({ latitude, longitude });

      if (response.success && response.address) {
        // Use the actual address from reverse geocoding
        if (onSelectLocation) {
          onSelectLocation({
            address: response.address,
            coordinates: { latitude, longitude }
          });
        }
      } else {
        // Fallback if reverse geocoding fails
        console.log("Reverse geocoding failed:", response.error, response.message);
        if (onSelectLocation) {
          onSelectLocation({
            address: "Your location",
            coordinates: { latitude, longitude }
          });
        }
      }

      navigation.goBack();
    } catch (error) {
      console.log("Error getting location:", error);
      // Fallback for any unexpected errors
      if (onSelectLocation) {
        onSelectLocation({
          address: "Your location",
          coordinates: { latitude, longitude }
        });
      }
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleChooseOnMap = () => {
    navigation.navigate('MapPicker', {
      onSelectLocation: (locationData) => {
        if (onSelectLocation) {
          onSelectLocation(locationData);
        }
      }
    });
  };

  const handleSelectSearchResult = async (place) => {
    setLoading(true);
    try {
      // Get detailed place information including coordinates
      const placeDetails = await getPlaceDetails(place.place_id);

      if (onSelectLocation) {
        onSelectLocation({
          address: placeDetails.formatted_address,
          coordinates: {
            latitude: placeDetails.geometry.location.lat,
            longitude: placeDetails.geometry.location.lng
          }
        });
      }
      navigation.goBack();
    } catch (error) {
      console.log("Error getting place details:", error);
      // Fallback to just using the place description
      if (onSelectLocation) {
        onSelectLocation({
          address: place.description
        });
      }
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Choose start location</Text>
        <Pressable style={styles.voiceButton}>
          <Ionicons name="mic-outline" size={24} color={colors.text} />
        </Pressable>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a location"
            placeholderTextColor={colors.muted}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus={true}
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => setSearchText("")}>
              <Ionicons name="close-circle" size={20} color={colors.muted} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Search Results */}
        {searchText.trim().length >= 3 && (
          <View style={styles.searchResultsContainer}>
            {isSearching ? (
              <View style={styles.searchingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.searchingText}>Searching...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <>
                <Text style={styles.sectionTitle}>Search results</Text>
                {searchResults.map((place) => (
                  <Pressable
                    key={place.place_id}
                    style={styles.locationItem}
                    onPress={() => handleSelectSearchResult(place)}
                  >
                    <View style={styles.locationIcon}>
                      <Ionicons name="location-outline" size={20} color={colors.text} />
                    </View>
                    <View style={styles.locationContent}>
                      <Text style={styles.locationName}>{place.structured_formatting.main_text}</Text>
                      <Text style={styles.locationAddress}>{place.structured_formatting.secondary_text}</Text>
                    </View>
                  </Pressable>
                ))}
              </>
            ) : (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search-outline" size={32} color={colors.muted} />
                <Text style={styles.noResultsText}>No results found</Text>
              </View>
            )}
          </View>
        )}

        {/* Quick Options */}
        {searchText.trim().length < 3 && (
          <View style={styles.quickOptions}>
          <Pressable style={styles.quickOption} onPress={handleSelectCurrentLocation} disabled={loading}>
            <View style={styles.quickOptionIcon}>
              {loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons name="navigate" size={20} color={colors.primary} />
              )}
            </View>
            <Text style={styles.quickOptionText}>Your location</Text>
          </Pressable>

          <Pressable style={styles.quickOption} onPress={handleChooseOnMap}>
            <View style={styles.quickOptionIcon}>
              <Ionicons name="map" size={20} color={colors.primary} />
            </View>
            <Text style={styles.quickOptionText}>Choose on map</Text>
          </Pressable>
        </View>
        )}

        {/* Saved Locations */}
        {searchText.trim().length < 3 && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Saved locations</Text>
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
                    onPress={() => handleSelectLocation(location)}
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
            </View>

            {/* More from recent history */}
            <Pressable style={styles.moreButton}>
              <Text style={styles.moreButtonText}>More from recent history</Text>
            </Pressable>
          </>
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
    justifyContent: "space-between",
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md
  },
  backButton: {
    padding: spacing.xs
  },
  headerTitle: {
    ...type.title3,
    color: colors.text,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: spacing.md
  },
  voiceButton: {
    padding: spacing.xs
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 0
  },
  content: {
    flex: 1
  },
  quickOptions: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm
  },
  quickOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.md
  },
  quickOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center"
  },
  quickOptionText: {
    ...type.body,
    color: colors.text,
    fontWeight: "600"
  },
  section: {
    marginTop: spacing.md
  },
  sectionTitle: {
    ...type.caption,
    color: colors.muted,
    fontWeight: "600",
    textTransform: "uppercase",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    letterSpacing: 0.5
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
    marginTop: spacing.md,
    marginBottom: spacing.xl
  },
  moreButtonText: {
    ...type.body,
    color: colors.primary,
    fontWeight: "600"
  },
  searchResultsContainer: {
    marginTop: spacing.sm
  },
  searchingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    gap: spacing.sm
  },
  searchingText: {
    ...type.body,
    color: colors.muted
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    gap: spacing.sm
  },
  noResultsText: {
    ...type.body,
    color: colors.muted
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
