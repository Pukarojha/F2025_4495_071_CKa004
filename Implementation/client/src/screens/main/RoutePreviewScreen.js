import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, type } from "../../theme/tokens";
import { getDirections, decodePolyline } from "../../services/googleMapsService";
import { ROUTE_COLORS } from "../../config/googleMaps";

export default function RoutePreviewScreen({ navigation, route }) {
  const routeParams = route?.params || {};
  const originData = routeParams.origin;
  const destinationData = routeParams.destination;

  // Extract address and coordinates from location data
  const getLocationInfo = (data) => {
    if (!data) return null;
    if (typeof data === 'string') {
      return { address: data, coordinates: null };
    }
    return {
      address: data.address || "Unknown location",
      coordinates: data.coordinates || null
    };
  };

  const origin = getLocationInfo(originData);
  const destination = getLocationInfo(destinationData);

  const [selectedRoute, setSelectedRoute] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState({
    latitude: 43.6532,
    longitude: -79.3832,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5
  });

  useEffect(() => {
    fetchDirections();
  }, []);

  const fetchDirections = async () => {
    setLoading(true);
    try {
      // Use coordinates if available, otherwise use addresses
      const originParam = origin?.coordinates || origin?.address;
      const destParam = destination?.coordinates || destination?.address;

      if (!originParam || !destParam) {
        // Use fallback static data
        useFallbackData();
        return;
      }

      const result = await getDirections(originParam, destParam, {
        alternatives: true,
        mode: 'driving'
      });

      if (result.success && result.routes.length > 0) {
        const processedRoutes = result.routes.map((route, index) => ({
          id: index,
          duration: route.legs[0].duration.text,
          distance: route.legs[0].distance.text,
          arrivalTime: calculateArrivalTime(route.legs[0].duration.value),
          description: index === 0 ? "Fastest route, the usual traffic" : `Via ${route.summary}`,
          polyline: decodePolyline(route.overview_polyline),
          startLocation: route.legs[0].start_location,
          endLocation: route.legs[0].end_location,
          steps: route.legs[0].steps
        }));

        setRoutes(processedRoutes);

        // Set map region to fit the first route
        if (processedRoutes.length > 0 && processedRoutes[0].polyline.length > 0) {
          const coordinates = processedRoutes[0].polyline;
          const lats = coordinates.map(c => c.latitude);
          const lngs = coordinates.map(c => c.longitude);
          const minLat = Math.min(...lats);
          const maxLat = Math.max(...lats);
          const minLng = Math.min(...lngs);
          const maxLng = Math.max(...lngs);

          setMapRegion({
            latitude: (minLat + maxLat) / 2,
            longitude: (minLng + maxLng) / 2,
            latitudeDelta: (maxLat - minLat) * 1.5,
            longitudeDelta: (maxLng - minLng) * 1.5
          });
        }
      } else {
        useFallbackData();
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
      useFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const calculateArrivalTime = (durationInSeconds) => {
    const now = new Date();
    const arrivalDate = new Date(now.getTime() + durationInSeconds * 1000);
    return arrivalDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const useFallbackData = () => {
    setRoutes([
      {
        id: 0,
        duration: "12 min",
        distance: "6.2 km",
        arrivalTime: "10:15 pm",
        description: "Fastest route, the usual traffic",
        polyline: [],
        steps: []
      }
    ]);
    setLoading(false);
  };

  const handleStart = () => {
    // Navigate to active navigation screen
    navigation.navigate('ActiveNavigation', {
      routes: routes,
      selectedRoute: selectedRoute,
      origin: origin,
      destination: destination
    });
  };

  const handleAddStops = () => {
    // Navigate to add stops screen
    console.log("Add stops");
  };

  const handleShare = () => {
    // Share route functionality
    console.log("Share route");
  };

  const handleSave = () => {
    // Save route functionality
    console.log("Save route");
  };

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.locationRow}>
          <View style={styles.startDot} />
          <Text style={styles.locationText} numberOfLines={1}>
            {origin?.address || "Starting location"}
          </Text>
          <Pressable style={styles.menuButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={16} color="#EF4444" />
          <Text style={styles.locationText} numberOfLines={1}>
            {destination?.address || "Destination"}
          </Text>
          <Pressable style={styles.swapButton}>
            <Ionicons name="swap-vertical" size={20} color={colors.text} />
          </Pressable>
        </View>
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading route...</Text>
          </View>
        ) : (
          <MapView
            style={styles.map}
            region={mapRegion}
            showsUserLocation={false}
          >
            {routes.length > 0 && routes.map((route, index) => (
              route.polyline && route.polyline.length > 0 && (
                <Polyline
                  key={route.id}
                  coordinates={route.polyline}
                  strokeColor={index === selectedRoute ? ROUTE_COLORS.main : ROUTE_COLORS.alternate}
                  strokeWidth={index === selectedRoute ? 6 : 4}
                  onPress={() => setSelectedRoute(index)}
                />
              )
            ))}

            {/* Start Marker */}
            {routes.length > 0 && routes[0].startLocation && (
              <Marker
                coordinate={{
                  latitude: routes[0].startLocation.lat,
                  longitude: routes[0].startLocation.lng
                }}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={styles.startMarker} />
              </Marker>
            )}

            {/* End Marker */}
            {routes.length > 0 && routes[0].endLocation && (
              <Marker
                coordinate={{
                  latitude: routes[0].endLocation.lat,
                  longitude: routes[0].endLocation.lng
                }}
              >
                <View style={styles.endMarker}>
                  <Ionicons name="location" size={32} color="#EF4444" />
                </View>
              </Marker>
            )}
          </MapView>
        )}

        {/* Close Button */}
        <Pressable style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      {/* Bottom Route Card */}
      <View style={styles.bottomCard}>
        <View style={styles.routeHeader}>
          <View style={styles.routeTitleContainer}>
            <Ionicons name="car" size={24} color={colors.text} />
            <Text style={styles.routeTitle}>Drive</Text>
          </View>
          <Pressable style={styles.alternateButton}>
            <Ionicons name="swap-horizontal" size={20} color={colors.primary} />
          </Pressable>
        </View>

        {routes.length > 0 && (
          <>
            <View style={styles.routeInfo}>
              <Text style={styles.duration}>{routes[selectedRoute].duration}</Text>
              <Text style={styles.distance}>({routes[selectedRoute].distance})</Text>
            </View>
            <Text style={styles.arrivalTime}>Arrive {routes[selectedRoute].arrivalTime}</Text>
            <Text style={styles.routeDescription}>{routes[selectedRoute].description}</Text>
          </>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable style={styles.startButton} onPress={handleStart}>
            <Ionicons name="navigate" size={18} color="#fff" />
            <Text style={styles.startButtonText}>Start</Text>
          </Pressable>

          <Pressable style={styles.iconButton} onPress={handleAddStops}>
            <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
            <Text style={styles.iconButtonText}>Add stops</Text>
          </Pressable>

          <Pressable style={styles.iconButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color={colors.primary} />
            <Text style={styles.iconButtonText}>Share</Text>
          </Pressable>

          <Pressable style={styles.iconButton} onPress={handleSave}>
            <Ionicons name="bookmark-outline" size={24} color={colors.primary} />
            <Text style={styles.iconButtonText}>Save</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface
  },
  headerCard: {
    backgroundColor: "#fff",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + 20,
    paddingBottom: spacing.md,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    gap: spacing.sm
  },
  startDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.primary
  },
  locationText: {
    flex: 1,
    ...type.body,
    color: colors.text,
    fontWeight: "500"
  },
  menuButton: {
    padding: spacing.xs
  },
  swapButton: {
    padding: spacing.xs
  },
  mapContainer: {
    flex: 1,
    position: "relative"
  },
  map: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md
  },
  loadingText: {
    ...type.body,
    color: colors.muted
  },
  startMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: "#fff"
  },
  endMarker: {
    alignItems: "center",
    justifyContent: "center"
  },
  closeButton: {
    position: "absolute",
    top: spacing.lg,
    right: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3
  },
  bottomCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  routeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm
  },
  routeTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  routeTitle: {
    ...type.h3,
    color: colors.text,
    fontWeight: "600"
  },
  alternateButton: {
    padding: spacing.xs
  },
  routeInfo: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.xs,
    marginBottom: 4
  },
  duration: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary
  },
  distance: {
    ...type.body,
    color: colors.muted
  },
  arrivalTime: {
    ...type.body,
    color: colors.text,
    marginBottom: 4
  },
  routeDescription: {
    ...type.caption,
    color: colors.muted,
    marginBottom: spacing.lg
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  startButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    gap: spacing.xs
  },
  startButtonText: {
    ...type.body,
    color: "#fff",
    fontWeight: "600"
  },
  iconButton: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.xs
  },
  iconButtonText: {
    ...type.caption,
    color: colors.primary,
    fontWeight: "500",
    fontSize: 10
  }
});
