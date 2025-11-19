import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, Pressable, ScrollView, ActivityIndicator } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import WDButton from "./ui/WDButton";
import { colors, spacing, radius, type } from "../theme/tokens";
import { getDirections, decodePolyline } from "../services/googleMapsService";
import { ROUTE_COLORS } from "../config/googleMaps";

export default function RouteModal({ visible, onClose, origin, destination }) {
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapRegion, setMapRegion] = useState(null);

  // Fetch directions when modal opens
  useEffect(() => {
    if (visible && origin && destination) {
      fetchDirections();
    }
  }, [visible, origin, destination]);

  const fetchDirections = async () => {
    setLoading(true);
    try {
      const result = await getDirections(origin, destination, {
        alternatives: true,
        mode: 'driving'
      });

      if (result.success && result.routes.length > 0) {
        const processedRoutes = result.routes.map((route, index) => ({
          id: index,
          duration: route.legs[0].duration.text,
          distance: route.legs[0].distance.text,
          description: route.summary || (index === 0 ? "Fastest route" : `Via ${route.summary}`),
          polyline: decodePolyline(route.overview_polyline),
          steps: route.legs[0].steps
        }));

        setRoutes(processedRoutes);

        // Set map region to fit the first route
        if (processedRoutes.length > 0) {
          const coordinates = processedRoutes[0].polyline;
          if (coordinates.length > 0) {
            const lats = coordinates.map(c => c.latitude);
            const lngs = coordinates.map(c => c.longitude);
            const minLat = Math.min(...lats);
            const maxLat = Math.max(...lats);
            const minLng = Math.min(...lngs);
            const maxLng = Math.max(...lngs);

            setMapRegion({
              latitude: (minLat + maxLat) / 2,
              longitude: (minLng + maxLng) / 2,
              latitudeDelta: (maxLat - minLat) * 1.3,
              longitudeDelta: (maxLng - minLng) * 1.3
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
      // Fallback to static data if API fails
      setRoutes([
        {
          id: 0,
          duration: "4 hr 48 min",
          distance: "391 mi",
          description: "Fastest route, low usual traffic",
          steps: [
            { instruction: "Head northeast on Mitchell Ct toward Heathwick Dr", distance: { text: "0.1 mi" } },
            { instruction: "Turn left onto Heathwick Dr", distance: { text: "0.3 mi" } },
            { instruction: "Turn left onto County Rd", distance: { text: "2 mi" } }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNavigation = () => {
    onClose();
    // Start navigation logic
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Map View with Routes */}
        {mapRegion && routes.length > 0 && (
          <MapView
            style={styles.map}
            initialRegion={mapRegion}
            region={mapRegion}
          >
            {/* Render all route polylines */}
            {routes.map((route, index) => (
              route.polyline && (
                <Polyline
                  key={route.id}
                  coordinates={route.polyline}
                  strokeColor={index === selectedRoute ? ROUTE_COLORS.main : ROUTE_COLORS.alternate}
                  strokeWidth={index === selectedRoute ? 6 : 4}
                  lineCap="round"
                  lineJoin="round"
                />
              )
            ))}

            {/* Origin Marker */}
            {routes[selectedRoute]?.polyline && routes[selectedRoute].polyline.length > 0 && (
              <Marker
                coordinate={routes[selectedRoute].polyline[0]}
                pinColor={colors.primary}
                title="Start"
              />
            )}

            {/* Destination Marker */}
            {routes[selectedRoute]?.polyline && routes[selectedRoute].polyline.length > 0 && (
              <Marker
                coordinate={routes[selectedRoute].polyline[routes[selectedRoute].polyline.length - 1]}
                pinColor="#EF4444"
                title="Destination"
              />
            )}
          </MapView>
        )}

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Calculating route...</Text>
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </Pressable>
          <View style={styles.routeInfo}>
            <View style={styles.routePoint}>
              <View style={styles.originDot} />
              <Text style={styles.routeText}>Phoenix</Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routePoint}>
              <View style={styles.destinationDot} />
              <Text style={styles.routeText}>Las Vegas</Text>
            </View>
          </View>
          <Pressable style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
          </Pressable>
        </View>

        {/* Route Options */}
        <ScrollView style={styles.content}>
          {routes.map((route, index) => (
            <Pressable
              key={route.id}
              style={[
                styles.routeOption,
                selectedRoute === index && styles.selectedRoute
              ]}
              onPress={() => setSelectedRoute(index)}
            >
              <View style={styles.routeHeader}>
                <Text style={styles.routeDuration}>{route.duration}</Text>
                <Text style={styles.routeDistance}>({route.distance})</Text>
              </View>
              <Text style={styles.routeDescription}>{route.description}</Text>
            </Pressable>
          ))}

          {/* Route Steps */}
          {routes[selectedRoute]?.steps && routes[selectedRoute].steps.length > 0 && (
            <View style={styles.stepsContainer}>
              <Text style={styles.stepsTitle}>Steps</Text>
              {routes[selectedRoute].steps.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.stepIcon}>
                    <Ionicons
                      name={step.maneuver ? `arrow-${step.maneuver}` : (index === 0 ? "arrow-up" : "arrow-forward")}
                      size={16}
                      color="#666"
                    />
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepInstruction}>{step.instruction}</Text>
                    <Text style={styles.stepDistance}>{step.distance?.text || step.distance}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.actionBar}>
          <WDButton
            label="Start"
            onPress={handleStartNavigation}
            style={styles.startButton}
          />
          <Pressable style={styles.actionButton}>
            <Ionicons name="add" size={20} color={colors.primary} />
            <Text style={styles.actionText}>Add stops</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Ionicons name="bookmark" size={20} color={colors.primary} />
            <Text style={styles.actionText}>Save</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "40%"
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "40%",
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm
  },
  loadingText: {
    ...type.body,
    color: colors.text,
    fontWeight: "500"
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: 50,
    paddingBottom: spacing.md,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    zIndex: 10
  },
  backButton: {
    padding: spacing.xs
  },
  routeInfo: {
    flex: 1,
    marginHorizontal: spacing.md,
    alignItems: "center"
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  originDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary
  },
  destinationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444"
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: "#ddd",
    marginVertical: 4
  },
  routeText: {
    ...type.body,
    color: "#333",
    fontWeight: "500"
  },
  moreButton: {
    padding: spacing.xs
  },
  content: {
    flex: 1,
    padding: spacing.md,
    marginTop: "40%"
  },
  routeOption: {
    backgroundColor: "#f8f9fa",
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: "transparent"
  },
  selectedRoute: {
    borderColor: colors.primary,
    backgroundColor: "#f0f9ff"
  },
  routeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: 4
  },
  routeDuration: {
    ...type.h3,
    color: "#333"
  },
  routeDistance: {
    ...type.body,
    color: "#666"
  },
  routeDescription: {
    ...type.caption,
    color: "#666"
  },
  stepsContainer: {
    marginTop: spacing.lg
  },
  stepsTitle: {
    ...type.h3,
    color: "#333",
    marginBottom: spacing.md
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
    gap: spacing.sm
  },
  stepIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center"
  },
  stepContent: {
    flex: 1
  },
  stepInstruction: {
    ...type.body,
    color: "#333",
    marginBottom: 2
  },
  stepDistance: {
    ...type.caption,
    color: "#666"
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: spacing.sm
  },
  startButton: {
    flex: 1
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 4
  },
  actionText: {
    ...type.caption,
    color: colors.primary,
    fontWeight: "500"
  }
});