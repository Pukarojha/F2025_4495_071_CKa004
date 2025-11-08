import React, { useEffect, useState, useRef } from "react";
import { View, ActivityIndicator, StyleSheet, Text, Pressable, TextInput, Modal, ScrollView } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import RouteModal from "../../components/RouteModal";
import PreferencesScreen from "./PreferencesScreen";
import SavedTripsScreen from "./SavedTripsScreen";
import { colors, spacing, radius, type } from "../../theme/tokens";

const SAMPLE = {
  zones: [{ id: "z1", polygon: [{ lat: 47.6, lon: -122.4 }, { lat: 47.7, lon: -122.4 }, { lat: 47.7, lon: -122.3 }] }],
  alerts: [{ id: "a1", title: "Severe Thunderstorm", center: { lat: 47.62, lon: -122.33 } }]
};

export default function MapScreen({ navigation }) {
  const [region, setRegion] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [activeMapTab, setActiveMapTab] = useState("Explore");
  const [mapType, setMapType] = useState("standard");
  const [showMapTypeSelector, setShowMapTypeSelector] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showSavedTrips, setShowSavedTrips] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Saved");
  const [showTraffic, setShowTraffic] = useState(false);
  const [showTransit, setShowTransit] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.25,
        longitudeDelta: 0.25
      });
    })();
  }, []);

  const handleProfileMenuPress = (option) => {
    setShowProfileMenu(false);
    if (option === "Logout") {
      navigation.replace("SignIn");
    } else if (option === "Plan a drive") {
      setShowRouteModal(true);
    } else if (option === "Settings") {
      navigation.navigate("Settings");
    }
    // Handle other menu options
  };

  const handleMarkerPress = (alert) => {
    // Show route when user taps on a marker
    setShowRouteModal(true);
  };

  return (
    <View style={styles.container}>
      {region ? (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={region}
          mapType={mapType}
          customMapStyle={mapType === "standard" ? lightMapStyle : []}
          showsUserLocation={true}
          followsUserLocation={false}
          showsMyLocationButton={false}>
          {SAMPLE.zones.map(z => (
            <Polygon key={z.id}
              coordinates={z.polygon.map(p => ({ latitude: p.lat, longitude: p.lon }))}
              strokeColor="#4ADE80" fillColor="rgba(74,222,128,0.12)" />
          ))}
          {SAMPLE.alerts.map(a => (
            <Marker
              key={a.id}
              coordinate={{ latitude: a.center.lat, longitude: a.center.lon }}
              title={a.title}
              onPress={() => handleMarkerPress(a)}
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
          <Text style={{ color: "#9CA3AF", marginTop: 8 }}>Fetching your location…</Text>
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Pressable style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <View style={styles.searchContent}>
            <Text style={styles.searchPlaceholder}>Search here</Text>
          </View>
          <Pressable style={styles.voiceButton}>
            <Ionicons name="mic" size={20} color="#666" />
          </Pressable>
          <Pressable style={styles.profileAvatarButton} onPress={() => setShowProfileMenu(true)}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>CH</Text>
            </View>
          </Pressable>
        </Pressable>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterChipsContainer}
          contentContainerStyle={styles.filterChipsContent}
        >
          <Pressable
            style={[styles.filterChip, activeFilter === "Saved" && styles.activeFilterChip]}
            onPress={() => setActiveFilter("Saved")}
          >
            <Ionicons name="bookmark" size={16} color={activeFilter === "Saved" ? "#fff" : colors.text} />
            <Text style={[styles.filterChipText, activeFilter === "Saved" && styles.activeFilterChipText]}>
              Saved
            </Text>
          </Pressable>

          <Pressable
            style={[styles.filterChip, activeFilter === "Gas" && styles.activeFilterChip]}
            onPress={() => setActiveFilter("Gas")}
          >
            <Ionicons name="water" size={16} color={activeFilter === "Gas" ? "#fff" : colors.text} />
            <Text style={[styles.filterChipText, activeFilter === "Gas" && styles.activeFilterChipText]}>
              Gas
            </Text>
          </Pressable>

          <Pressable
            style={[styles.filterChip, activeFilter === "Food" && styles.activeFilterChip]}
            onPress={() => setActiveFilter("Food")}
          >
            <Ionicons name="restaurant" size={16} color={activeFilter === "Food" ? "#fff" : colors.text} />
            <Text style={[styles.filterChipText, activeFilter === "Food" && styles.activeFilterChipText]}>
              Food
            </Text>
          </Pressable>

          <Pressable
            style={[styles.filterChip, activeFilter === "Hotels" && styles.activeFilterChip]}
            onPress={() => setActiveFilter("Hotels")}
          >
            <Ionicons name="bed" size={16} color={activeFilter === "Hotels" ? "#fff" : colors.text} />
            <Text style={[styles.filterChipText, activeFilter === "Hotels" && styles.activeFilterChipText]}>
              Hotels
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Custom Location Button */}
      <Pressable
        style={styles.customLocationButton}
        onPress={async () => {
          try {
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.High,
            });

            const newRegion = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            };

            // Update state
            setRegion(newRegion);

            // Animate map to new location
            if (mapRef.current) {
              mapRef.current.animateToRegion(newRegion, 1000);
            }
          } catch (error) {
            console.log('Error getting location:', error);
            // Request permission if denied
            try {
              const { status } = await Location.requestForegroundPermissionsAsync();
              if (status === 'granted') {
                // Retry getting location
                const location = await Location.getCurrentPositionAsync({
                  accuracy: Location.Accuracy.High,
                });

                const newRegion = {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01
                };

                setRegion(newRegion);
                if (mapRef.current) {
                  mapRef.current.animateToRegion(newRegion, 1000);
                }
              }
            } catch (permissionError) {
              console.log('Permission error:', permissionError);
            }
          }
        }}
      >
        <Ionicons name="locate" size={18} color="#666" />
      </Pressable>


      {/* Profile Menu Modal */}
      <Modal
        visible={showProfileMenu}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProfileMenu(false)}
      >
        <View style={styles.profileModalContainer}>
          <View style={styles.profileModal}>
            {/* Close Button */}
            <Pressable
              style={styles.closeButton}
              onPress={() => setShowProfileMenu(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </Pressable>

            {/* Profile Header */}
            <View style={styles.profileModalHeader}>
              <View style={styles.profileImageContainer}>
                <View style={styles.profileImage}>
                  <Text style={styles.profileImageText}>CH</Text>
                </View>
              </View>
              <Text style={styles.profileModalName}>Cheguevaran</Text>
              <Text style={styles.profileModalEmail}>Cheguevaran2@gmail.com</Text>
            </View>

            {/* Menu Items */}
            <View style={styles.profileMenuItems}>
              <Pressable style={styles.profileMenuItem} onPress={() => handleProfileMenuPress("Plan a drive")}>
                <Ionicons name="car" size={24} color="#666" />
                <Text style={styles.profileMenuText}>Plan a drive</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </Pressable>

              <Pressable style={styles.profileMenuItem} onPress={() => handleProfileMenuPress("Inbox")}>
                <Ionicons name="mail" size={24} color="#666" />
                <Text style={styles.profileMenuText}>Inbox</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </Pressable>

              <Pressable style={styles.profileMenuItem} onPress={() => handleProfileMenuPress("Settings")}>
                <Ionicons name="settings" size={24} color="#666" />
                <Text style={styles.profileMenuText}>Settings</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </Pressable>

              <Pressable style={styles.profileMenuItem} onPress={() => handleProfileMenuPress("Notification")}>
                <Ionicons name="notifications" size={24} color="#666" />
                <Text style={styles.profileMenuText}>Notification</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </Pressable>

              <Pressable style={styles.profileMenuItem} onPress={() => handleProfileMenuPress("Help and Support")}>
                <Ionicons name="help-circle" size={24} color="#666" />
                <Text style={styles.profileMenuText}>Help and Support</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </Pressable>

              <Pressable style={styles.profileMenuItem} onPress={() => handleProfileMenuPress("Logout")}>
                <Ionicons name="log-out" size={24} color="#666" />
                <Text style={styles.profileMenuText}>Logout</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Map Tab Navigation */}
      <View style={styles.mapTabContainer}>
        <View style={styles.mapTabBar}>
          <Pressable
            style={[styles.mapTab, activeMapTab === "Explore" && styles.activeMapTab]}
            onPress={() => {
              if (activeMapTab === "Explore") {
                setShowMapTypeSelector(!showMapTypeSelector);
              } else {
                setActiveMapTab("Explore");
              }
            }}
          >
            <Ionicons
              name="compass"
              size={20}
              color={activeMapTab === "Explore" ? colors.primary : "#666"}
            />
            <Text
              style={[styles.mapTabText, activeMapTab === "Explore" && styles.activeMapTabText]}
            >
              Explore
            </Text>
          </Pressable>

          <Pressable
            style={[styles.mapTab, activeMapTab === "Saved" && styles.activeMapTab]}
            onPress={() => {
              setActiveMapTab("Saved");
              setShowSavedTrips(true);
            }}
          >
            <Ionicons
              name="bookmark"
              size={20}
              color={activeMapTab === "Saved" ? colors.primary : "#666"}
            />
            <Text
              style={[styles.mapTabText, activeMapTab === "Saved" && styles.activeMapTabText]}
            >
              Saved
            </Text>
          </Pressable>

          <Pressable
            style={[styles.mapTab, activeMapTab === "Preferences" && styles.activeMapTab]}
            onPress={() => {
              setActiveMapTab("Preferences");
              setShowPreferences(true);
            }}
          >
            <Ionicons
              name="options"
              size={20}
              color={activeMapTab === "Preferences" ? colors.primary : "#666"}
            />
            <Text
              style={[styles.mapTabText, activeMapTab === "Preferences" && styles.activeMapTabText]}
            >
              Preferences
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Explore Panel - Map Type & Map Details */}
      <Modal
        visible={activeMapTab === "Explore" && showMapTypeSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMapTypeSelector(false)}
      >
        <View style={styles.exploreModalContainer}>
          <Pressable
            style={styles.exploreModalBackdrop}
            onPress={() => setShowMapTypeSelector(false)}
          />
          <View style={styles.explorePanel}>
            <View style={styles.explorePanelHeader}>
              <Text style={styles.explorePanelTitle}>Midtown, Atlanta</Text>
              <Text style={styles.explorePanelTemp}>98°21'</Text>
            </View>

            {/* Map Type Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Map Type</Text>
              <View style={styles.mapTypeGrid}>
                <Pressable
                  style={[styles.mapTypeCard, mapType === "standard" && styles.selectedMapTypeCard]}
                  onPress={() => setMapType("standard")}
                >
                  <View style={[styles.mapTypeIconContainer, mapType === "standard" && styles.selectedMapTypeIcon]}>
                    <Ionicons name="map" size={32} color={mapType === "standard" ? colors.primary : "#666"} />
                  </View>
                  <Text style={styles.mapTypeCardLabel}>Default</Text>
                </Pressable>

                <Pressable
                  style={[styles.mapTypeCard, mapType === "satellite" && styles.selectedMapTypeCard]}
                  onPress={() => setMapType("satellite")}
                >
                  <View style={[styles.mapTypeIconContainer, mapType === "satellite" && styles.selectedMapTypeIcon]}>
                    <Ionicons name="earth" size={32} color={mapType === "satellite" ? colors.primary : "#666"} />
                  </View>
                  <Text style={styles.mapTypeCardLabel}>Satellite</Text>
                </Pressable>

                <Pressable
                  style={[styles.mapTypeCard, mapType === "hybrid" && styles.selectedMapTypeCard]}
                  onPress={() => setMapType("hybrid")}
                >
                  <View style={[styles.mapTypeIconContainer, mapType === "hybrid" && styles.selectedMapTypeIcon]}>
                    <Ionicons name="trail-sign" size={32} color={mapType === "hybrid" ? colors.primary : "#666"} />
                  </View>
                  <Text style={styles.mapTypeCardLabel}>Terrain</Text>
                </Pressable>
              </View>
            </View>

            {/* Map Details Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Map Details</Text>
              <View style={styles.mapDetailsGrid}>
                <Pressable
                  style={[styles.mapDetailCard, showTraffic && styles.selectedMapDetailCard]}
                  onPress={() => setShowTraffic(!showTraffic)}
                >
                  <View style={[styles.mapDetailIconContainer]}>
                    <Ionicons name="car" size={24} color={showTraffic ? colors.primary : "#666"} />
                  </View>
                  <Text style={styles.mapDetailCardLabel}>Traffic</Text>
                </Pressable>

                <Pressable
                  style={[styles.mapDetailCard, showTransit && styles.selectedMapDetailCard]}
                  onPress={() => setShowTransit(!showTransit)}
                >
                  <View style={[styles.mapDetailIconContainer]}>
                    <Ionicons name="bus" size={24} color={showTransit ? colors.primary : "#666"} />
                  </View>
                  <Text style={styles.mapDetailCardLabel}>Transit</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Preferences Modal */}
      <Modal
        visible={showPreferences}
        animationType="slide"
        onRequestClose={() => {
          setShowPreferences(false);
          setActiveMapTab("Explore");
        }}
      >
        <PreferencesScreen
          navigation={{
            goBack: () => {
              setShowPreferences(false);
              setActiveMapTab("Explore");
            }
          }}
        />
      </Modal>

      {/* Saved Trips Modal */}
      <Modal
        visible={showSavedTrips}
        animationType="slide"
        onRequestClose={() => {
          setShowSavedTrips(false);
          setActiveMapTab("Explore");
        }}
      >
        <SavedTripsScreen
          navigation={{
            goBack: () => {
              setShowSavedTrips(false);
              setActiveMapTab("Explore");
            },
            navigate: navigation.navigate
          }}
        />
      </Modal>

      {/* Route Modal */}
      <RouteModal
        visible={showRouteModal}
        onClose={() => setShowRouteModal(false)}
        origin="Phoenix"
        destination="Las Vegas"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  searchContainer: {
    position: "absolute",
    top: 50,
    left: spacing.md,
    right: spacing.md,
    zIndex: 100
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: spacing.sm
  },
  searchIcon: {
    marginRight: spacing.xs
  },
  searchContent: {
    flex: 1,
    justifyContent: "center"
  },
  searchPlaceholder: {
    fontSize: 16,
    color: "#666"
  },
  voiceButton: {
    padding: 4
  },
  profileAvatarButton: {
    padding: 2
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center"
  },
  profileAvatarText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600"
  },
  filterChipsContainer: {
    marginTop: spacing.sm
  },
  filterChipsContent: {
    paddingRight: spacing.md,
    gap: spacing.sm
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  activeFilterChip: {
    backgroundColor: colors.text,
    borderColor: colors.text
  },
  filterChipText: {
    ...type.caption,
    color: colors.text,
    fontWeight: "500"
  },
  activeFilterChipText: {
    color: "#fff"
  },
  customLocationButton: {
    position: "absolute",
    bottom: 30,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },
  profileModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end"
  },
  profileModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
    minHeight: "60%"
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: spacing.xs,
    marginBottom: spacing.md
  },
  profileModalHeader: {
    alignItems: "center",
    marginBottom: spacing.xl
  },
  profileImageContainer: {
    marginBottom: spacing.md
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center"
  },
  profileImageText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "600"
  },
  profileModalName: {
    ...type.h2,
    color: colors.text,
    marginBottom: spacing.xs
  },
  profileModalEmail: {
    ...type.body,
    color: colors.muted
  },
  profileMenuItems: {
    gap: spacing.xs
  },
  profileMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.lg,
    gap: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border
  },
  profileMenuText: {
    flex: 1,
    ...type.body,
    color: colors.text,
    fontWeight: "500"
  },
  mapTabContainer: {
    position: "absolute",
    bottom: 90,
    left: 0,
    right: 0,
    alignItems: "center"
  },
  mapTabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: radius.pill,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4
  },
  mapTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 6,
    borderRadius: radius.pill
  },
  activeMapTab: {
    backgroundColor: colors.surfaceAlt
  },
  mapTabText: {
    ...type.caption,
    color: "#666",
    fontWeight: "500"
  },
  activeMapTabText: {
    color: colors.primary,
    fontWeight: "600"
  },
  mapTypeSelectorContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    justifyContent: "flex-end"
  },
  mapTypeBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)"
  },
  mapTypeSelector: {
    backgroundColor: "#fff",
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 100
  },
  mapTypeOption: {
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.xs
  },
  selectedMapType: {
    backgroundColor: colors.surfaceAlt
  },
  mapTypeLabel: {
    ...type.caption,
    color: colors.text,
    fontWeight: "500"
  },
  exploreModalContainer: {
    flex: 1,
    justifyContent: "flex-end"
  },
  exploreModalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)"
  },
  explorePanel: {
    backgroundColor: "#fff",
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.lg,
    paddingBottom: 120,
    paddingHorizontal: spacing.lg
  },
  explorePanelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xl
  },
  explorePanelTitle: {
    ...type.h2,
    color: colors.text,
    fontWeight: "600"
  },
  explorePanelTemp: {
    ...type.body,
    color: colors.muted
  },
  section: {
    marginBottom: spacing.xl
  },
  sectionLabel: {
    ...type.body,
    color: colors.text,
    fontWeight: "600",
    marginBottom: spacing.md
  },
  mapTypeGrid: {
    flexDirection: "row",
    gap: spacing.md
  },
  mapTypeCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 2,
    borderColor: "transparent"
  },
  selectedMapTypeCard: {
    borderColor: colors.primary,
    backgroundColor: "#f0f9ff"
  },
  mapTypeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm
  },
  selectedMapTypeIcon: {
    backgroundColor: "#DBEAFE"
  },
  mapTypeCardLabel: {
    ...type.caption,
    color: colors.text,
    fontWeight: "500"
  },
  mapDetailsGrid: {
    flexDirection: "row",
    gap: spacing.md
  },
  mapDetailCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 2,
    borderColor: "transparent",
    gap: spacing.xs
  },
  selectedMapDetailCard: {
    borderColor: colors.primary,
    backgroundColor: "#f0f9ff"
  },
  mapDetailIconContainer: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center"
  },
  mapDetailCardLabel: {
    ...type.caption,
    color: colors.text,
    fontWeight: "500"
  }
});

const lightMapStyle = [
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }]
  }
];
