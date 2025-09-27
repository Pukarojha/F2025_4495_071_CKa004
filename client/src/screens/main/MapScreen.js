import React, { useEffect, useState } from "react";
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
          style={StyleSheet.absoluteFill}
          initialRegion={region}
          customMapStyle={lightMapStyle}
          showsUserLocation={true}
          followsUserLocation={true}>
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
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search here"
            placeholderTextColor="#666"
            value={searchText}
            onChangeText={setSearchText}
          />
          <Pressable style={styles.voiceButton}>
            <Ionicons name="mic" size={20} color="#666" />
          </Pressable>
          <Pressable style={styles.filterButton} onPress={() => setShowFilters(!showFilters)}>
            <Ionicons name="options" size={20} color="#666" />
          </Pressable>
        </View>

        {/* Filter Pills */}
        {showFilters && (
          <View style={styles.filterContainer}>
            <Pressable style={styles.filterPill}>
              <Ionicons name="bookmark" size={16} color={colors.primary} />
              <Text style={styles.filterText}>Saved</Text>
            </Pressable>
            <Pressable style={styles.filterPill}>
              <Ionicons name="car" size={16} color={colors.primary} />
              <Text style={styles.filterText}>Gas</Text>
            </Pressable>
            <Pressable style={styles.filterPill}>
              <Ionicons name="restaurant" size={16} color={colors.primary} />
              <Text style={styles.filterText}>Food</Text>
            </Pressable>
            <Pressable style={styles.filterPill}>
              <Ionicons name="bed" size={16} color={colors.primary} />
              <Text style={styles.filterText}>Hotels</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Profile Avatar */}
      <Pressable
        style={styles.profileButton}
        onPress={() => setShowProfileMenu(true)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>CH</Text>
        </View>
      </Pressable>

      {/* Floating Route Button */}
      <Pressable
        style={styles.routeButton}
        onPress={() => setShowRouteModal(true)}
      >
        <Ionicons name="navigate" size={24} color="#fff" />
      </Pressable>

      {/* Profile Menu Modal */}
      <Modal
        visible={showProfileMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowProfileMenu(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowProfileMenu(false)}
        >
          <View style={styles.profileMenu}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>CH</Text>
              </View>
              <View>
                <Text style={styles.profileName}>Cheguevaran</Text>
                <Text style={styles.profileEmail}>Cheguevaran2@gmail.com</Text>
              </View>
            </View>

            <View style={styles.menuItems}>
              <Pressable style={styles.menuItem} onPress={() => handleProfileMenuPress("Plan a drive")}>
                <Ionicons name="map" size={20} color="#666" />
                <Text style={styles.menuText}>Plan a drive</Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </Pressable>

              <Pressable style={styles.menuItem} onPress={() => handleProfileMenuPress("Inbox")}>
                <Ionicons name="mail" size={20} color="#666" />
                <Text style={styles.menuText}>Inbox</Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </Pressable>

              <Pressable style={styles.menuItem} onPress={() => handleProfileMenuPress("Settings")}>
                <Ionicons name="settings" size={20} color="#666" />
                <Text style={styles.menuText}>Settings</Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </Pressable>

              <Pressable style={styles.menuItem} onPress={() => handleProfileMenuPress("Notification")}>
                <Ionicons name="notifications" size={20} color="#666" />
                <Text style={styles.menuText}>Notification</Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </Pressable>

              <Pressable style={styles.menuItem} onPress={() => handleProfileMenuPress("Help and Support")}>
                <Ionicons name="help-circle" size={20} color="#666" />
                <Text style={styles.menuText}>Help and Support</Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </Pressable>

              <Pressable style={styles.menuItem} onPress={() => handleProfileMenuPress("Logout")}>
                <Ionicons name="log-out" size={20} color="#666" />
                <Text style={styles.menuText}>Logout</Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </Pressable>
            </View>
          </View>
        </Pressable>
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
    elevation: 3
  },
  searchIcon: {
    marginRight: spacing.sm
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333"
  },
  voiceButton: {
    marginLeft: spacing.sm,
    padding: 4
  },
  filterButton: {
    marginLeft: spacing.sm,
    padding: 4
  },
  filterContainer: {
    flexDirection: "row",
    marginTop: spacing.sm,
    gap: spacing.sm
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    gap: 4
  },
  filterText: {
    fontSize: 14,
    color: "#333"
  },
  profileButton: {
    position: "absolute",
    top: 50,
    right: spacing.md
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  profileMenu: {
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    padding: spacing.lg,
    margin: spacing.lg,
    minWidth: 300
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
    gap: spacing.md
  },
  profileName: {
    ...type.h3,
    color: "#333"
  },
  profileEmail: {
    ...type.caption,
    color: "#666"
  },
  menuItems: {
    gap: spacing.sm
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.md
  },
  menuText: {
    flex: 1,
    ...type.body,
    color: "#333"
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
