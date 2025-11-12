import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { colors, spacing, radius, type } from "../../theme/tokens";
import { reverseGeocode, getPlaceAutocomplete, getPlaceDetails } from "../../services/googleMapsService";

export default function AddStopsScreen({ navigation, route }) {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { onAddStop } = route.params || {};

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
          console.log("Autocomplete API error:", response.error, response.message);
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

  const savedLocations = [
    {
      id: 1,
      name: "Home",
      address: "101 Roehampton Avenue, Toronto, ON",
      icon: "home"
    },
    {
      id: 2,
      name: "Work",
      address: "Set once and go",
      icon: "briefcase"
    },
    {
      id: 3,
      name: "60 East Beaver Creek Road",
      address: "Richmond Hill, ON",
      icon: "time-outline"
    },
    {
      id: 4,
      name: "Humber College Blvd",
      address: "Etobicoke, ON",
      icon: "time-outline"
    },
    {
      id: 5,
      name: "#2256 Costco",
      address: "Islington, Etobicoke, ON",
      icon: "time-outline"
    },
    {
      id: 6,
      name: "10 Tobermory Drive",
      address: "Toronto, ON",
      icon: "time-outline"
    }
  ];

  const filterCategories = ["Saved", "Gas", "Food", "Hotels", "Parking"];

  const handleSelectLocation = (location) => {
    if (onAddStop) {
      onAddStop({
        address: location.address || location.name,
        name: location.name
      });
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

      try {
        const address = await reverseGeocode({ latitude, longitude });
        if (onAddStop) {
          onAddStop({
            address: address.formatted_address || "Your location",
            coordinates: { latitude, longitude }
          });
        }
      } catch (error) {
        console.log("Error getting address:", error);
        if (onAddStop) {
          onAddStop({
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
        if (onAddStop) {
          onAddStop(locationData);
        }
        // Navigate back to ActiveNavigationScreen after adding the stop
        navigation.goBack();
      }
    });
  };

  const handleSelectSearchResult = async (place) => {
    setLoading(true);
    try {
      const result = await getPlaceDetails(place.place_id);

      console.log("Place details result:", result);

      if (result.success && result.place) {
        const placeData = result.place;
        if (onAddStop) {
          onAddStop({
            address: placeData.address || place.description,
            coordinates: {
              latitude: placeData.location.lat,
              longitude: placeData.location.lng
            }
          });
        }
        navigation.goBack();
      } else {
        // If place details failed, try to add with just address (no coordinates)
        console.log("Failed to get place details, adding without coordinates");
        if (onAddStop) {
          onAddStop({
            address: place.description
          });
        }
        navigation.goBack();
      }
    } catch (error) {
      console.log("Error getting place details:", error);
      if (onAddStop) {
        onAddStop({
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
      {/* Header with Search */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <TextInput
            style={styles.searchInput}
            placeholder="Search along route"
            placeholderTextColor={colors.muted}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus={false}
          />
          <Pressable style={styles.voiceButton}>
            <Ionicons name="mic-outline" size={24} color={colors.text} />
          </Pressable>
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
              </View>
            )}
          </View>
        )}

        {/* Quick Options */}
        {searchText.trim().length < 3 && (
          <>
            <View style={styles.quickOptions}>
              <Pressable style={styles.quickOption} onPress={handleSelectCurrentLocation} disabled={loading}>
                <View style={styles.quickOptionIconContainer}>
                  {loading ? (
                    <ActivityIndicator size="small" color={colors.text} />
                  ) : (
                    <Ionicons name="navigate" size={24} color={colors.text} />
                  )}
                </View>
                <Text style={styles.quickOptionText}>Your location</Text>
              </Pressable>

              <Pressable style={styles.quickOption} onPress={handleChooseOnMap}>
                <View style={styles.quickOptionIconContainer}>
                  <Ionicons name="location-outline" size={24} color={colors.text} />
                </View>
                <Text style={styles.quickOptionText}>Choose on map</Text>
              </Pressable>
            </View>

            {/* Filter Categories */}
            <View style={styles.filterContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                {filterCategories.map((category) => (
                  <Pressable
                    key={category}
                    style={[styles.filterChip, category === "Saved" && styles.activeFilterChip]}
                  >
                    {category === "Gas" && <Ionicons name="water" size={16} color={colors.text} />}
                    {category === "Food" && <Ionicons name="restaurant" size={16} color={colors.text} />}
                    {category === "Hotels" && <Ionicons name="bed" size={16} color={colors.text} />}
                    {category === "Parking" && <Ionicons name="car" size={16} color={colors.text} />}
                    {category === "Saved" && <Ionicons name="bookmark" size={16} color={colors.text} />}
                    <Text style={[styles.filterText, category === "Saved" && styles.activeFilterText]}>
                      {category}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Saved Locations */}
            <View style={styles.section}>
              {savedLocations.map((location) => (
                <Pressable
                  key={location.id}
                  style={styles.locationItem}
                  onPress={() => handleSelectLocation(location)}
                >
                  <View style={styles.locationIcon}>
                    <Ionicons name={location.icon} size={20} color={colors.text} />
                  </View>
                  <View style={styles.locationContent}>
                    <Text style={styles.locationName}>{location.name}</Text>
                    <Text style={styles.locationAddress}>{location.address}</Text>
                  </View>
                </Pressable>
              ))}
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
  voiceButton: {
    padding: spacing.xs
  },
  content: {
    flex: 1
  },
  quickOptions: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  quickOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.md
  },
  quickOptionIconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  quickOptionText: {
    ...type.body,
    color: colors.text,
    fontSize: 16
  },
  filterContainer: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  filterScroll: {
    paddingHorizontal: spacing.lg
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6
  },
  activeFilterChip: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border
  },
  filterText: {
    ...type.body,
    color: colors.text,
    fontWeight: "500",
    fontSize: 14
  },
  activeFilterText: {
    color: colors.text
  },
  section: {
    marginTop: spacing.xs
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
  }
});
