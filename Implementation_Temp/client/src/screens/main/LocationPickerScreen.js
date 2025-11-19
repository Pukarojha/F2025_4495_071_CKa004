import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { colors, spacing, radius, type } from "../../theme/tokens";
import { reverseGeocode, getPlaceAutocomplete, getPlaceDetails } from "../../services/googleMapsService";

export default function LocationPickerScreen({ navigation, route }) {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { onSelectLocation, title } = route.params || {};

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
          setSearchResults([]);
        }
      } catch (error) {
        console.log("Error fetching autocomplete:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchText]);

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

      try {
        const addressResult = await reverseGeocode({ latitude, longitude });
        if (onSelectLocation) {
          onSelectLocation({
            address: addressResult.address || "Your location",
            coordinates: { latitude, longitude }
          });
        }
      } catch (error) {
        console.log("Error getting address:", error);
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
        navigation.goBack();
      }
    });
  };

  const handleSelectSearchResult = async (place) => {
    setLoading(true);
    try {
      const result = await getPlaceDetails(place.place_id);

      if (result.success && result.place) {
        const placeData = result.place;
        if (onSelectLocation) {
          onSelectLocation({
            address: placeData.address || place.description,
            name: placeData.name,
            coordinates: {
              latitude: placeData.location.lat,
              longitude: placeData.location.lng
            }
          });
        }
        navigation.goBack();
      } else {
        // If place details failed, try to add with just address (no coordinates)
        if (onSelectLocation) {
          onSelectLocation({
            address: place.description,
            name: place.structured_formatting.main_text
          });
        }
        navigation.goBack();
      }
    } catch (error) {
      console.log("Error getting place details:", error);
      if (onSelectLocation) {
        onSelectLocation({
          address: place.description,
          name: place.structured_formatting.main_text
        });
      }
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Search */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <TextInput
            style={styles.searchInput}
            placeholder={title ? `Search for ${title}` : "Search for a location"}
            placeholderTextColor={colors.muted}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus={false}
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => setSearchText("")} style={styles.clearButton}>
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
                <Text style={styles.noResultsSubtext}>Try searching with different keywords</Text>
              </View>
            )}
          </View>
        )}

        {/* Quick Options */}
        {searchText.trim().length < 3 && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick options</Text>

              <Pressable style={styles.quickOption} onPress={handleSelectCurrentLocation} disabled={loading}>
                <View style={styles.quickOptionIconContainer}>
                  {loading ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Ionicons name="navigate" size={24} color={colors.primary} />
                  )}
                </View>
                <View style={styles.quickOptionContent}>
                  <Text style={styles.quickOptionText}>Your location</Text>
                  <Text style={styles.quickOptionSubtext}>Use current location</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.muted} />
              </Pressable>

              <Pressable style={styles.quickOption} onPress={handleChooseOnMap}>
                <View style={styles.quickOptionIconContainer}>
                  <Ionicons name="map-outline" size={24} color={colors.primary} />
                </View>
                <View style={styles.quickOptionContent}>
                  <Text style={styles.quickOptionText}>Choose on map</Text>
                  <Text style={styles.quickOptionSubtext}>Select location from map</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.muted} />
              </Pressable>
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
              <Ionicons name="information-circle-outline" size={20} color={colors.muted} />
              <Text style={styles.infoText}>
                Search for a place, use your current location, or pick a location on the map
              </Text>
            </View>
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
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  backButton: {
    padding: spacing.xs
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: spacing.xs
  },
  clearButton: {
    padding: spacing.xs
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
    marginBottom: spacing.md
  },
  quickOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: "#fff",
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  quickOptionIconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceAlt,
    borderRadius: 20
  },
  quickOptionContent: {
    flex: 1
  },
  quickOptionText: {
    ...type.body,
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2
  },
  quickOptionSubtext: {
    ...type.caption,
    color: colors.muted,
    fontSize: 13
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
    marginBottom: 2
  },
  locationAddress: {
    ...type.caption,
    color: colors.muted,
    fontSize: 13
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
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm
  },
  noResultsText: {
    ...type.body,
    color: colors.text,
    fontWeight: "600"
  },
  noResultsSubtext: {
    ...type.caption,
    color: colors.muted,
    textAlign: 'center'
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    gap: spacing.sm
  },
  infoText: {
    flex: 1,
    ...type.caption,
    color: colors.muted,
    lineHeight: 18
  }
});