import React, { useEffect, useState, useRef } from "react";
import { View, ActivityIndicator, StyleSheet, Text, Pressable, Modal, ScrollView, Image, Alert } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native"; 

// --- AWS IMPORTS ---
import { getCurrentUser, fetchUserAttributes, signOut } from 'aws-amplify/auth'; 

import RouteModal from "../../components/RouteModal";
import PreferencesScreen from "./PreferencesScreen";
import SavedTripsScreen from "./SavedTripsScreen";
import { colors, spacing, radius, type } from "../../theme/tokens";

// --- MOVED TO TOP TO PREVENT ERRORS ---
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

const SAMPLE = {
  zones: [{ id: "z1", polygon: [{ lat: 47.6, lon: -122.4 }, { lat: 47.7, lon: -122.4 }, { lat: 47.7, lon: -122.3 }] }],
  alerts: [{ id: "a1", title: "Severe Thunderstorm", center: { lat: 47.62, lon: -122.33 } }]
};

export default function MapScreen({ navigation }) {
  const [region, setRegion] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [activeMapTab, setActiveMapTab] = useState("Explore");
  const [mapType, setMapType] = useState("standard");
  const [showMapTypeSelector, setShowMapTypeSelector] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showSavedTrips, setShowSavedTrips] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Saved");
  const [showTraffic, setShowTraffic] = useState(false);
  const [showTransit, setShowTransit] = useState(false);
  
  // --- PROFILE STATE ---
  const [profileImage, setProfileImage] = useState(require('../../../assets/profile_avatar.jpg')); 
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [profileName, setProfileName] = useState("Guest"); 
  const [profileEmail, setProfileEmail] = useState(""); 

  const mapRef = useRef(null);

  // --- 1. FETCH USER DATA & LOCATION ON LOAD ---
  useEffect(() => {
    (async () => {
      // A. Get Location
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          setRegion({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.25,
            longitudeDelta: 0.25
          });
        }
      } catch (e) {
        console.log("Location Error", e);
      }

      // B. Get User Data from AWS
      try {
        const user = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        
        if (attributes.email) setProfileEmail(attributes.email);
        
        const name = attributes.name || attributes.given_name || "User";
        setProfileName(name);

        if (attributes.picture) {
          setProfileImage({ uri: attributes.picture });
        }
      } catch (err) {
        console.log("Error fetching user data:", err);
      }
    })();
  }, []);

  // --- 2. LOGOUT LOGIC ---
  const handleProfileMenuPress = async (option) => {
    setShowProfileMenu(false);
    
    if (option === "Logout") {
      Alert.alert(
        "Sign Out", 
        "Are you sure?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Logout", 
            style: "destructive",
            onPress: async () => {
              try {
                await signOut({ global: true }); 
                navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: "SignIn" }],
                    })
                  );
              } catch (error) {
                console.error("Error signing out: ", error);
                Alert.alert("Error", "Could not sign out. Please try again.");
              }
            }
          }
        ]
      );
    } else if (option === "Plan a drive") {
      setShowRouteModal(true);
    } else if (option === "Settings") {
      navigation.navigate("Settings");
    }
  };

  const handleMarkerPress = (alert) => {
    setShowRouteModal(true);
  };

  // Image Picker Logic
  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
    }
    setShowImagePickerModal(false);
  };

  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
    }
    setShowImagePickerModal(false);
  };

  const handleImagePickerOption = (option) => {
    if (option === 'gallery') pickImageFromGallery();
    else if (option === 'camera') takePhotoWithCamera();
    else setShowImagePickerModal(false);
  };

  const handleProfileUpdate = (updatedProfile) => {
    if (updatedProfile.fullName) setProfileName(updatedProfile.fullName);
    if (updatedProfile.email) setProfileEmail(updatedProfile.email);
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
            <Image source={profileImage} style={styles.profileAvatarImage} />
          </Pressable>
        </Pressable>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterChipsContainer}
          contentContainerStyle={styles.filterChipsContent}
        >
          {["Saved", "Gas", "Food", "Hotels"].map((filter) => (
             <Pressable
             key={filter}
             style={[styles.filterChip, activeFilter === filter && styles.activeFilterChip]}
             onPress={() => setActiveFilter(filter)}
           >
             <Ionicons 
                name={filter === "Saved" ? "bookmark" : filter === "Gas" ? "water" : filter === "Food" ? "restaurant" : "bed"} 
                size={16} 
                color={activeFilter === filter ? "#fff" : colors.text} 
             />
             <Text style={[styles.filterChipText, activeFilter === filter && styles.activeFilterChipText]}>
               {filter}
             </Text>
           </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Custom Location Button */}
      <Pressable
        style={styles.customLocationButton}
        onPress={async () => {
          try {
            const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const newRegion = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            };
            setRegion(newRegion);
            if (mapRef.current) mapRef.current.animateToRegion(newRegion, 1000);
          } catch (error) {
            console.log('Error getting location:', error);
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
            <Pressable style={styles.closeButton} onPress={() => setShowProfileMenu(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </Pressable>

            <View style={styles.profileModalHeader}>
              <View style={styles.profileImageContainer}>
                <View style={styles.profileImageWrapper}>
                  <Image source={profileImage} style={styles.profileImageLarge} />
                  <Pressable style={styles.cameraIconButton} onPress={() => setShowImagePickerModal(true)}>
                    <Ionicons name="camera" size={16} color="#fff" />
                  </Pressable>
                  <Pressable style={styles.editIconButton} onPress={() => {
                      setShowProfileMenu(false);
                      navigation.navigate("EditProfile", { onProfileUpdate: handleProfileUpdate });
                    }}>
                    <Ionicons name="pencil" size={14} color="#fff" />
                  </Pressable>
                </View>
              </View>
              <Text style={styles.profileModalName}>{profileName}</Text>
              <Text style={styles.profileModalEmail}>{profileEmail}</Text>
            </View>

            <View style={styles.profileMenuItems}>
              {["Plan a drive", "Inbox", "Settings", "Notification", "Help and Support"].map((item) => (
                <Pressable key={item} style={styles.profileMenuItem} onPress={() => handleProfileMenuPress(item)}>
                    <Ionicons 
                        name={item === "Plan a drive" ? "car" : item === "Inbox" ? "mail" : item === "Settings" ? "settings" : item === "Notification" ? "notifications" : "help-circle"} 
                        size={24} color="#666" 
                    />
                    <Text style={styles.profileMenuText}>{item}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </Pressable>
              ))}
              
              <Pressable style={styles.profileMenuItem} onPress={() => handleProfileMenuPress("Logout")}>
                <Ionicons name="log-out" size={24} color="#FF3B30" />
                <Text style={[styles.profileMenuText, {color: "#FF3B30"}]}>Logout</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Map Tab Navigation */}
      <View style={styles.mapTabContainer}>
        <View style={styles.mapTabBar}>
          {[
              {id: "Explore", icon: "compass"}, 
              {id: "Saved", icon: "bookmark"}, 
              {id: "Preferences", icon: "options"}
           ].map((tab) => (
            <Pressable
                key={tab.id}
                style={[styles.mapTab, activeMapTab === tab.id && styles.activeMapTab]}
                onPress={() => {
                    if (tab.id === "Explore" && activeMapTab === "Explore") setShowMapTypeSelector(!showMapTypeSelector);
                    else if (tab.id === "Preferences") { setActiveMapTab("Preferences"); setShowPreferences(true); }
                    else if (tab.id === "Saved") { setActiveMapTab("Saved"); setShowSavedTrips(true); }
                    else setActiveMapTab(tab.id);
                }}
            >
                <Ionicons name={tab.icon} size={20} color={activeMapTab === tab.id ? colors.primary : "#666"} />
                <Text style={[styles.mapTabText, activeMapTab === tab.id && styles.activeMapTabText]}>{tab.id}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Explore Panel */}
      <Modal
        visible={activeMapTab === "Explore" && showMapTypeSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMapTypeSelector(false)}
      >
        <View style={styles.exploreModalContainer}>
          <Pressable style={styles.exploreModalBackdrop} onPress={() => setShowMapTypeSelector(false)} />
          <View style={styles.explorePanel}>
            <View style={styles.explorePanelHeader}>
              <Text style={styles.explorePanelTitle}>Map Options</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Map Type</Text>
              <View style={styles.mapTypeGrid}>
                {[{id: "standard", label: "Default", icon: "map"}, {id: "satellite", label: "Satellite", icon: "earth"}, {id: "hybrid", label: "Terrain", icon: "trail-sign"}].map((t) => (
                    <Pressable
                    key={t.id}
                    style={[styles.mapTypeCard, mapType === t.id && styles.selectedMapTypeCard]}
                    onPress={() => setMapType(t.id)}
                  >
                    <View style={[styles.mapTypeIconContainer, mapType === t.id && styles.selectedMapTypeIcon]}>
                      <Ionicons name={t.icon} size={32} color={mapType === t.id ? colors.primary : "#666"} />
                    </View>
                    <Text style={styles.mapTypeCardLabel}>{t.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            
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
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Other Modals */}
      <Modal visible={showPreferences} animationType="slide" onRequestClose={() => { setShowPreferences(false); setActiveMapTab("Explore"); }}>
        <PreferencesScreen navigation={{ goBack: () => { setShowPreferences(false); setActiveMapTab("Explore"); } }} />
      </Modal>

      <Modal visible={showSavedTrips} animationType="slide" onRequestClose={() => { setShowSavedTrips(false); setActiveMapTab("Explore"); }}>
        <SavedTripsScreen navigation={{ goBack: () => { setShowSavedTrips(false); setActiveMapTab("Explore"); }, navigate: navigation.navigate }} />
      </Modal>

      <RouteModal visible={showRouteModal} onClose={() => setShowRouteModal(false)} origin="Phoenix" destination="Las Vegas" />

      <Modal visible={showImagePickerModal} transparent={true} animationType="fade" onRequestClose={() => setShowImagePickerModal(false)}>
        <View style={styles.imagePickerModalContainer}>
          <View style={styles.imagePickerModal}>
            <Text style={styles.imagePickerTitle}>Change Profile Photo</Text>
            <Pressable style={styles.imagePickerOption} onPress={() => handleImagePickerOption('gallery')}>
              <Ionicons name="images" size={24} color={colors.primary} />
              <Text style={styles.imagePickerOptionText}>Choose from Gallery</Text>
            </Pressable>
            <Pressable style={styles.imagePickerOption} onPress={() => handleImagePickerOption('camera')}>
              <Ionicons name="camera" size={24} color={colors.primary} />
              <Text style={styles.imagePickerOptionText}>Take Photo</Text>
            </Pressable>
            <Pressable style={styles.imagePickerCancelButton} onPress={() => setShowImagePickerModal(false)}>
              <Text style={styles.imagePickerCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  searchContainer: { position: "absolute", top: 50, left: spacing.md, right: spacing.md, zIndex: 100 },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, gap: spacing.sm },
  searchIcon: { marginRight: spacing.xs },
  searchContent: { flex: 1, justifyContent: "center" },
  searchPlaceholder: { fontSize: 16, color: "#666" },
  voiceButton: { padding: 4 },
  profileAvatarButton: { padding: 2 },
  profileAvatarImage: { width: 32, height: 32, borderRadius: 16 },
  filterChipsContainer: { marginTop: spacing.sm },
  filterChipsContent: { paddingRight: spacing.md, gap: spacing.sm },
  filterChip: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.border, gap: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  activeFilterChip: { backgroundColor: colors.text, borderColor: colors.text },
  filterChipText: { ...type.caption, color: colors.text, fontWeight: "500" },
  activeFilterChipText: { color: "#fff" },
  customLocationButton: { position: "absolute", bottom: 30, right: spacing.md, width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
  profileModalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  profileModal: { backgroundColor: "#fff", borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, paddingTop: spacing.lg, paddingBottom: spacing.xxl, paddingHorizontal: spacing.lg, minHeight: "60%" },
  closeButton: { alignSelf: "flex-end", padding: spacing.xs, marginBottom: spacing.md },
  profileModalHeader: { alignItems: "center", marginBottom: spacing.xl },
  profileImageContainer: { marginBottom: spacing.md },
  profileImageWrapper: { position: "relative", width: 80, height: 80 },
  profileImageLarge: { width: 80, height: 80, borderRadius: 40 },
  cameraIconButton: { position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#fff" },
  editIconButton: { position: "absolute", top: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: "#666", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#fff" },
  profileModalName: { ...type.h2, color: colors.text, marginBottom: spacing.xs },
  profileModalEmail: { ...type.body, color: colors.muted },
  profileMenuItems: { gap: spacing.xs },
  profileMenuItem: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.lg, gap: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  profileMenuText: { flex: 1, ...type.body, color: colors.text, fontWeight: "500" },
  mapTabContainer: { position: "absolute", bottom: 90, left: 0, right: 0, alignItems: "center" },
  mapTabBar: { flexDirection: "row", backgroundColor: "#fff", borderRadius: radius.pill, padding: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  mapTab: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: 6, borderRadius: radius.pill },
  activeMapTab: { backgroundColor: colors.surfaceAlt },
  mapTabText: { ...type.caption, color: "#666", fontWeight: "500" },
  activeMapTabText: { color: colors.primary, fontWeight: "600" },
  exploreModalContainer: { flex: 1, justifyContent: "flex-end" },
  exploreModalBackdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.3)" },
  explorePanel: { backgroundColor: "#fff", borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, paddingTop: spacing.lg, paddingBottom: 120, paddingHorizontal: spacing.lg },
  explorePanelHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.xl },
  explorePanelTitle: { ...type.h2, color: colors.text, fontWeight: "600" },
  section: { marginBottom: spacing.xl },
  sectionLabel: { ...type.body, color: colors.text, fontWeight: "600", marginBottom: spacing.md },
  mapTypeGrid: { flexDirection: "row", gap: spacing.md },
  mapTypeCard: { flex: 1, alignItems: "center", paddingVertical: spacing.md, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, borderWidth: 2, borderColor: "transparent" },
  selectedMapTypeCard: { borderColor: colors.primary, backgroundColor: "#f0f9ff" },
  mapTypeIconContainer: { width: 60, height: 60, borderRadius: radius.md, backgroundColor: "#E5E7EB", alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  selectedMapTypeIcon: { backgroundColor: "#DBEAFE" },
  mapTypeCardLabel: { ...type.caption, color: colors.text, fontWeight: "500" },
  mapDetailsGrid: { flexDirection: "row", gap: spacing.md },
  mapDetailCard: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: spacing.md, paddingHorizontal: spacing.sm, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, borderWidth: 2, borderColor: "transparent", gap: spacing.xs },
  selectedMapDetailCard: { borderColor: colors.primary, backgroundColor: "#f0f9ff" },
  mapDetailIconContainer: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  mapDetailCardLabel: { ...type.caption, color: colors.text, fontWeight: "500" },
  imagePickerModalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  imagePickerModal: { backgroundColor: "#fff", borderRadius: radius.lg, padding: spacing.xl, width: "80%", alignItems: "center" },
  imagePickerTitle: { ...type.h3, color: colors.text, marginBottom: spacing.xl, fontWeight: "600" },
  imagePickerOption: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.md, paddingHorizontal: spacing.lg, width: "100%", gap: spacing.md, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, marginBottom: spacing.sm },
  imagePickerOptionText: { ...type.body, color: colors.text, fontWeight: "500" },
  imagePickerCancelButton: { marginTop: spacing.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.xl },
  imagePickerCancelText: { ...type.body, color: colors.muted, fontWeight: "500" }
});