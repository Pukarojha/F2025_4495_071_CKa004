import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, PanResponder, Dimensions, ActivityIndicator } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, type } from "../../theme/tokens";
import { ROUTE_COLORS } from "../../config/googleMaps";
import { getDirections, decodePolyline } from "../../services/googleMapsService";

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MAX_SHEET_HEIGHT = SCREEN_HEIGHT * 0.7; // 70% of screen
const MIN_SHEET_HEIGHT = SCREEN_HEIGHT * 0.35; // 35% of screen

export default function ActiveNavigationScreen({ navigation, route }) {
  const routeParams = route?.params || {};
  const { routes, selectedRoute = 0, origin, destination } = routeParams;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stops, setStops] = useState([]);
  const [recalculatedRoutes, setRecalculatedRoutes] = useState(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isStepsExpanded, setIsStepsExpanded] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 43.6532,
    longitude: -79.3832,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  });

  // Use recalculated routes if available, otherwise use original routes
  const activeRoutes = recalculatedRoutes || routes;
  const currentRoute = activeRoutes?.[selectedRoute];
  const steps = currentRoute?.steps || [];
  const currentStep = steps[currentStepIndex];

  // Animation for draggable bottom sheet
  const sheetHeight = useRef(new Animated.Value(MAX_SHEET_HEIGHT)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newHeight = MAX_SHEET_HEIGHT - gestureState.dy;
        if (newHeight >= MIN_SHEET_HEIGHT && newHeight <= MAX_SHEET_HEIGHT) {
          sheetHeight.setValue(newHeight);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const targetHeight = gestureState.dy > 50 ? MIN_SHEET_HEIGHT : MAX_SHEET_HEIGHT;
        Animated.spring(sheetHeight, {
          toValue: targetHeight,
          useNativeDriver: false,
          tension: 50,
          friction: 8
        }).start();
      }
    })
  ).current;

  useEffect(() => {
    // Set initial map region to focus on current location/first step
    if (currentRoute && currentRoute.startLocation) {
      setMapRegion({
        latitude: currentRoute.startLocation.lat,
        longitude: currentRoute.startLocation.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      });
    }
  }, []);

  // Recalculate route when stops are added
  useEffect(() => {
    if (stops.length === 0 || !origin || !destination) {
      setRecalculatedRoutes(null);
      return;
    }

    const recalculateRoute = async () => {
      setIsRecalculating(true);
      try {
        // Convert stops to waypoints format
        const waypoints = stops
          .filter(stop => stop.coordinates)
          .map(stop => ({
            latitude: stop.coordinates.latitude,
            longitude: stop.coordinates.longitude
          }));

        // Determine origin and destination parameters
        const originParam = origin.coordinates || origin.address;
        const destParam = destination.coordinates || destination.address;

        console.log('Recalculating route with waypoints:', waypoints);
        console.log('Origin:', originParam, 'Destination:', destParam);

        const directionsResponse = await getDirections(
          originParam,
          destParam,
          {
            waypoints,
            alternatives: true
          }
        );

        if (directionsResponse.success && directionsResponse.routes.length > 0) {
          console.log('Directions API response:', directionsResponse);

          // Transform routes to match the expected format
          const transformedRoutes = directionsResponse.routes.map((route, index) => {
            // Decode the polyline
            const polylineCoords = decodePolyline(route.overview_polyline);

            // Flatten all steps from all legs
            const allSteps = route.legs.flatMap(leg =>
              leg.steps.map(step => ({
                html_instructions: step.instruction || step.html_instructions || 'Continue straight',
                distance: step.distance,
                duration: step.duration,
                maneuver: step.maneuver || 'straight',
                start_location: step.start_location,
                end_location: step.end_location
              }))
            );

            // Calculate total distance and duration
            const totalDistance = route.legs.reduce((sum, leg) => sum + leg.distance.value, 0);
            const totalDuration = route.legs.reduce((sum, leg) => sum + leg.duration.value, 0);

            // Calculate arrival time
            const calculateArrivalTime = (durationInSeconds) => {
              const now = new Date();
              const arrival = new Date(now.getTime() + durationInSeconds * 1000);
              return arrival.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              });
            };

            return {
              id: index,
              polyline: polylineCoords,
              steps: allSteps,
              distance: `${(totalDistance / 1000).toFixed(1)} km`,
              duration: `${Math.round(totalDuration / 60)} min`,
              arrivalTime: calculateArrivalTime(totalDuration),
              startLocation: route.legs[0].start_location,
              endLocation: route.legs[route.legs.length - 1].end_location,
              description: `Route with ${stops.length} stop${stops.length > 1 ? 's' : ''} - ${route.summary || 'fastest route'}`
            };
          });

          setRecalculatedRoutes(transformedRoutes);
          console.log('Route recalculated with', stops.length, 'stop(s)', transformedRoutes);
        }
      } catch (error) {
        console.error('Error recalculating route:', error);
      } finally {
        setIsRecalculating(false);
      }
    };

    recalculateRoute();
  }, [stops, origin, destination]);

  const handleStop = () => {
    // Go back to previous screen
    navigation.goBack();
  };

  const handleAddStops = () => {
    // Navigate to add stops screen
    navigation.navigate('AddStops', {
      onAddStop: (stopLocation) => {
        console.log('Stop added:', stopLocation);
        // Add stop to the stops array
        setStops(prevStops => [...prevStops, stopLocation]);
      }
    });
  };

  const getManeuverIcon = (maneuver) => {
    const iconMap = {
      'turn-left': 'arrow-back',
      'turn-right': 'arrow-forward',
      'turn-slight-left': 'arrow-back',
      'turn-slight-right': 'arrow-forward',
      'turn-sharp-left': 'arrow-back',
      'turn-sharp-right': 'arrow-forward',
      'straight': 'arrow-up',
      'ramp-left': 'arrow-back',
      'ramp-right': 'arrow-forward',
      'merge': 'git-merge-outline',
      'fork-left': 'arrow-back',
      'fork-right': 'arrow-forward',
      'roundabout-left': 'reload',
      'roundabout-right': 'reload',
    };
    return iconMap[maneuver] || 'arrow-up';
  };

  const stripHtmlTags = (html) => {
    if (!html) return 'Continue on route';
    return html.replace(/<[^>]*>/g, '');
  };

  // Fallback steps if no route data
  const displaySteps = steps.length > 0 ? steps : [
    {
      html_instructions: "Head west toward Silver Reign Dr",
      distance: { text: "70 m" },
      maneuver: "straight"
    },
    {
      html_instructions: "Turn left onto Silver Reign Dr",
      distance: { text: "100 m" },
      maneuver: "turn-left"
    },
    {
      html_instructions: "Turn right onto Rexdale Blvd",
      distance: { text: "1.9 mi" },
      maneuver: "turn-right"
    }
  ];

  return (
    <View style={styles.container}>
      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={mapRegion}
          showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton={false}
        >
          {currentRoute?.polyline && currentRoute.polyline.length > 0 && (
            <Polyline
              coordinates={currentRoute.polyline}
              strokeColor={ROUTE_COLORS.active}
              strokeWidth={6}
            />
          )}

          {/* Stop Markers */}
          {stops.map((stop, index) => (
            stop.coordinates && (
              <Marker
                key={index}
                coordinate={{
                  latitude: stop.coordinates.latitude,
                  longitude: stop.coordinates.longitude
                }}
              >
                <View style={styles.stopMarker}>
                  <View style={styles.stopMarkerInner}>
                    <Text style={styles.stopMarkerText}>{index + 1}</Text>
                  </View>
                </View>
              </Marker>
            )
          ))}

          {/* Destination Marker */}
          {currentRoute?.endLocation && (
            <Marker
              coordinate={{
                latitude: currentRoute.endLocation.lat,
                longitude: currentRoute.endLocation.lng
              }}
            >
              <View style={styles.endMarker}>
                <Ionicons name="location" size={32} color="#EF4444" />
              </View>
            </Marker>
          )}
        </MapView>

        {/* Header Card with Start/Destination */}
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

          {/* Display added stops */}
          {stops.map((stop, index) => (
            <View key={index} style={styles.locationRow}>
              <View style={styles.stopDot} />
              <Text style={styles.locationText} numberOfLines={1}>
                {stop.address || stop.name || "Added stop"}
              </Text>
              <Pressable
                style={styles.removeButton}
                onPress={() => setStops(prevStops => prevStops.filter((_, i) => i !== index))}
              >
                <Ionicons name="close-circle" size={20} color={colors.muted} />
              </Pressable>
            </View>
          ))}

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

        {/* Close Button */}
        <Pressable style={styles.closeButton} onPress={handleStop}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      {/* Bottom Sheet with Steps */}
      <Animated.View style={[styles.bottomSheet, { height: sheetHeight }]}>
        {/* Drag Handle */}
        <View {...panResponder.panHandlers} style={styles.dragHandleContainer}>
          <View style={styles.dragHandle} />
        </View>

        {/* Close Button */}
        <Pressable style={styles.sheetCloseButton} onPress={handleStop}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>

        {/* Route Header */}
        <View style={styles.routeHeader}>
          <View style={styles.routeTitleContainer}>
            <Ionicons name="car" size={24} color={colors.text} />
            <Text style={styles.routeTitle}>Drive</Text>
          </View>
          <Pressable style={styles.alternateButton}>
            <Ionicons name="swap-horizontal" size={20} color={colors.primary} />
          </Pressable>
        </View>

        {/* Route Info */}
        <View style={styles.routeInfoContainer}>
          {isRecalculating ? (
            <View style={styles.recalculatingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.recalculatingText}>Recalculating route with stops...</Text>
            </View>
          ) : (
            <>
              <View style={styles.routeInfo}>
                <Text style={styles.duration}>{currentRoute?.duration || "12 min"}</Text>
                <Text style={styles.distance}>({currentRoute?.distance || "6.2 km"})</Text>
              </View>
              <Text style={styles.arrivalTime}>Arrive {currentRoute?.arrivalTime || "10:15 pm"}</Text>
              <Text style={styles.routeDescription}>
                {currentRoute?.description || "Fastest route, the usual traffic"}
              </Text>
            </>
          )}
        </View>

        {/* Steps Section Header - Collapsible */}
        <Pressable
          style={styles.stepsHeader}
          onPress={() => setIsStepsExpanded(!isStepsExpanded)}
        >
          <Ionicons name="location" size={20} color="#EF4444" />
          <Text style={styles.stepsHeaderText}>
            {stops.length > 0
              ? `Next stop: ${stops[0].address || stops[0].name || 'Added stop'}`
              : destination?.address || "School (Humber college)"}
          </Text>
          <Ionicons
            name={isStepsExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={colors.text}
          />
        </Pressable>

        {/* Steps List - Collapsible */}
        {isStepsExpanded && (
          <ScrollView style={styles.stepsList} showsVerticalScrollIndicator={false}>
            {/* Origin Item */}
            <View style={styles.originItem}>
              <View style={styles.originIconContainer}>
                <View style={styles.originDot} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.originText}>
                  {origin?.address || "Starting location"}
                </Text>
                <Text style={styles.originSubtext}>Your starting point</Text>
              </View>
            </View>

{(() => {
              // When there are stops, we need to insert stop markers at the right positions
              if (stops.length > 0 && recalculatedRoutes && currentRoute?.legs) {
                const legs = currentRoute.legs;
                let stepIndex = 0;
                const stepsWithStops = [];

                legs.forEach((leg, legIndex) => {
                  // Add all steps from this leg
                  leg.steps.forEach((step, i) => {
                    const globalIndex = stepIndex++;
                    stepsWithStops.push(
                      <View key={`step-${globalIndex}`} style={styles.stepItem}>
                        <View style={styles.stepIconContainer}>
                          <Ionicons
                            name={getManeuverIcon(step.maneuver)}
                            size={24}
                            color={colors.text}
                          />
                        </View>
                        <View style={styles.stepContent}>
                          <Text style={styles.stepInstruction}>
                            {stripHtmlTags(step.html_instructions || step.instruction)}
                          </Text>
                          <Text style={styles.stepDistance}>{step.distance?.text || "0 m"}</Text>
                        </View>
                      </View>
                    );
                  });

                  // Add stop marker after each leg (except the last one)
                  if (legIndex < legs.length - 1 && stops[legIndex]) {
                    stepsWithStops.push(
                      <View key={`stop-${legIndex}`} style={styles.stopStepItem}>
                        <View style={styles.stopStepIconContainer}>
                          <View style={styles.stopStepMarker}>
                            <Text style={styles.stopStepNumber}>{legIndex + 1}</Text>
                          </View>
                        </View>
                        <View style={styles.stepContent}>
                          <Text style={styles.stopStepText}>
                            Stop {legIndex + 1}: {stops[legIndex].address || stops[legIndex].name}
                          </Text>
                          <Text style={styles.stopStepSubtext}>Waypoint on your route</Text>
                        </View>
                      </View>
                    );
                  }
                });

                return stepsWithStops;
              } else {
                // No stops, just render regular steps
                return displaySteps.map((step, index) => (
                  <View key={index} style={styles.stepItem}>
                    <View style={styles.stepIconContainer}>
                      <Ionicons
                        name={getManeuverIcon(step.maneuver)}
                        size={24}
                        color={colors.text}
                      />
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={styles.stepInstruction}>
                        {stripHtmlTags(step.html_instructions)}
                      </Text>
                      <Text style={styles.stepDistance}>{step.distance?.text || "0 m"}</Text>
                    </View>
                  </View>
                ));
              }
            })()}

            {/* Destination Item */}
            <View style={styles.destinationItem}>
              <View style={styles.destinationIconContainer}>
                <Ionicons name="location" size={24} color="#EF4444" />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.destinationText}>
                  {destination?.address || "Home (101 Roehampton Ave)"}
                </Text>
                <Text style={styles.destinationSubtext}>Destination will be on the left</Text>
              </View>
            </View>
          </ScrollView>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable style={styles.stopButton} onPress={handleStop}>
            <Ionicons name="stop" size={18} color="#fff" />
            <Text style={styles.stopButtonText}>Stop</Text>
          </Pressable>

          <Pressable style={styles.iconButton} onPress={handleAddStops}>
            <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
            <Text style={styles.iconButtonText}>Add stops</Text>
          </Pressable>

          <Pressable style={styles.iconButton}>
            <Ionicons name="share-outline" size={24} color={colors.primary} />
            <Text style={styles.iconButtonText}>Share</Text>
          </Pressable>

          <Pressable style={styles.iconButton}>
            <Ionicons name="bookmark-outline" size={24} color={colors.primary} />
            <Text style={styles.iconButtonText}>Save</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface
  },
  mapContainer: {
    flex: 1,
    position: "relative"
  },
  map: {
    flex: 1
  },
  headerCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
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
  stopDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: colors.primary
  },
  locationText: {
    flex: 1,
    ...type.body,
    color: colors.text,
    fontWeight: "500",
    fontSize: 14
  },
  menuButton: {
    padding: spacing.xs
  },
  removeButton: {
    padding: spacing.xs
  },
  swapButton: {
    padding: spacing.xs
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
    elevation: 3,
    zIndex: 11
  },
  endMarker: {
    alignItems: "center",
    justifyContent: "center"
  },
  stopMarker: {
    alignItems: "center",
    justifyContent: "center"
  },
  stopMarkerInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  stopMarkerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  dragHandleContainer: {
    alignItems: "center",
    paddingVertical: spacing.sm
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border
  },
  sheetCloseButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.lg,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10
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
  routeInfoContainer: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
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
    color: colors.muted
  },
  recalculatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm
  },
  recalculatingText: {
    ...type.body,
    color: colors.primary,
    fontStyle: "italic"
  },
  stepsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs
  },
  stepsHeaderText: {
    ...type.body,
    color: colors.text,
    fontWeight: "600",
    flex: 1
  },
  stepsList: {
    maxHeight: 200,
    marginBottom: spacing.md
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md
  },
  stepIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center"
  },
  stepContent: {
    flex: 1
  },
  stepInstruction: {
    ...type.body,
    color: colors.text,
    fontWeight: "500",
    marginBottom: 4
  },
  stepDistance: {
    ...type.caption,
    color: colors.muted
  },
  originItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  originIconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  originDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.primary
  },
  originText: {
    ...type.body,
    color: colors.text,
    fontWeight: "600",
    marginBottom: 4
  },
  originSubtext: {
    ...type.caption,
    color: colors.muted,
    fontStyle: "italic"
  },
  stopStepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: spacing.md,
    gap: spacing.md,
    backgroundColor: "#E0F2FE",
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary
  },
  stopStepIconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  stopStepMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff"
  },
  stopStepNumber: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14
  },
  stopStepText: {
    ...type.body,
    color: colors.text,
    fontWeight: "600",
    marginBottom: 4
  },
  stopStepSubtext: {
    ...type.caption,
    color: colors.primary,
    fontStyle: "italic"
  },
  destinationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: spacing.md,
    gap: spacing.md
  },
  destinationIconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  destinationText: {
    ...type.body,
    color: colors.text,
    fontWeight: "600",
    marginBottom: 4
  },
  destinationSubtext: {
    ...type.caption,
    color: colors.muted,
    fontStyle: "italic"
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  stopButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444",
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    gap: spacing.xs
  },
  stopButtonText: {
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
