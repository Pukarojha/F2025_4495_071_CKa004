import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { colors, spacing, radius, type } from "../../theme/tokens";
import { reverseGeocode } from "../../services/googleMapsService";

export default function MapPickerScreen({ navigation, route }) {
  const { onSelectLocation } = route.params || {};
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationAddress, setLocationAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState({
    latitude: 43.6532,
    longitude: -79.3832,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      };
      setRegion(newRegion);
    } catch (error) {
      console.log("Error getting location:", error);
    }
  };

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    setLoading(true);

    try {
      // Get address from coordinates using reverse geocoding
      const response = await reverseGeocode({ latitude, longitude });

      if (response.success && response.address) {
        // Use the actual address from reverse geocoding
        setLocationAddress(response.address);
      } else {
        // Fallback to coordinates if reverse geocoding fails
        console.log("Reverse geocoding failed:", response.error, response.message);
        setLocationAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }
    } catch (error) {
      console.log("Error getting address:", error);
      // Fallback to coordinates for any unexpected errors
      setLocationAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation && onSelectLocation) {
      onSelectLocation({
        address: locationAddress,
        coordinates: selectedLocation
      });
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Choose on map</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        region={region}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} pinColor={colors.primary} />
        )}
      </MapView>

      {/* Location Info Card */}
      {selectedLocation && (
        <View style={styles.locationCard}>
          <View style={styles.locationInfo}>
            <Ionicons name="location" size={24} color={colors.primary} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationTitle}>Selected location</Text>
              {loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={styles.locationAddress}>{locationAddress}</Text>
              )}
            </View>
          </View>
          <Pressable style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </Pressable>
        </View>
      )}

      {/* Instructions */}
      {!selectedLocation && (
        <View style={styles.instructionCard}>
          <Ionicons name="information-circle" size={24} color={colors.muted} />
          <Text style={styles.instructionText}>Tap on the map to select a location</Text>
        </View>
      )}

      {/* My Location Button */}
      <Pressable style={styles.myLocationButton} onPress={getCurrentLocation}>
        <Ionicons name="navigate" size={24} color={colors.primary} />
      </Pressable>
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
    backgroundColor: colors.surface,
    zIndex: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  backButton: {
    padding: spacing.xs
  },
  headerTitle: {
    ...type.title3,
    color: colors.text,
    fontWeight: "600"
  },
  placeholder: {
    width: 40
  },
  map: {
    flex: 1
  },
  locationCard: {
    position: "absolute",
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
    gap: spacing.md
  },
  locationTextContainer: {
    flex: 1
  },
  locationTitle: {
    ...type.caption,
    color: colors.muted,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4
  },
  locationAddress: {
    ...type.body,
    color: colors.text,
    fontWeight: "500"
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center"
  },
  confirmButtonText: {
    ...type.body,
    color: "#fff",
    fontWeight: "600"
  },
  instructionCard: {
    position: "absolute",
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5
  },
  instructionText: {
    ...type.body,
    color: colors.muted,
    flex: 1
  },
  myLocationButton: {
    position: "absolute",
    bottom: 180,
    right: spacing.lg,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3
  }
});
