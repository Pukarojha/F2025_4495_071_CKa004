import React, { useEffect, useState, useRef } from "react";
import { View, ActivityIndicator, StyleSheet, Text, Pressable, TextInput, Modal } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import RouteModal from "../../components/RouteModal";
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
          customMapStyle={lightMapStyle}
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
      </View>


      {/* Floating Route Button */}
      <Pressable
        style={styles.routeButton}
        onPress={() => setShowRouteModal(true)}
      >
        <Ionicons name="navigate" size={24} color="#fff" />
      </Pressable>

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
    right: spacing.md
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
  routeButton: {
    position: "absolute",
    bottom: 100,
    right: spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4
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
