import React, { useMemo, useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Text, FlatList, ActivityIndicator } from "react-native";
import AppBar from "../../components/ui/AppBar";
import AlertCard from "../../components/AlertCard";
import WeatherAlertModal from "../../components/WeatherAlertModal";
import { colors, spacing, radius } from "../../theme/tokens";
import { api } from "../../api/client";

const SEVERITIES = ["Extreme","Severe","Moderate","Minor"];

export default function AlertsScreen() {
  const [severity, setSeverity] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await api.getAlerts();
      const formattedAlerts = data.map(alert => ({
        id: alert.id,
        title: alert.headline || alert.event,
        description: alert.description || alert.headline || "",
        severity: alert.severity,
        area: alert.areaDesc || "Along your route",
        updatedAt: alert.sent || alert.effective || new Date().toISOString()
      }));
      setAlerts(formattedAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const data = useMemo(
    () => (severity ? alerts.filter(a => a.severity === severity) : alerts),
    [severity, alerts]
  );

  const handleAlertPress = (alert) => {
    setSelectedAlert(alert);
    setShowAlertModal(true);
  };

  const handleCloseModal = () => {
    setShowAlertModal(false);
    setSelectedAlert(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Alerts" />
      <View style={styles.filterRow}>
        {SEVERITIES.map(s => (
          <Pressable key={s} onPress={() => setSeverity(severity === s ? "" : s)}
            style={[styles.chip, severity === s && styles.chipActive]}>
            <Text style={styles.chipText}>{s}</Text>
          </Pressable>
        ))}
        <Pressable onPress={() => setSeverity("")} style={styles.clearBtn}>
          <Text style={{ color: "#fff" }}>Clear</Text>
        </Pressable>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading weather alerts...</Text>
        </View>
      ) : data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No weather alerts at this time</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <AlertCard {...item} onPress={() => handleAlertPress(item)} />
          )}
          contentContainerStyle={{ paddingVertical: spacing.sm }}
        />
      )}

      {/* Alert Detail Modal */}
      <WeatherAlertModal
        visible={showAlertModal}
        alert={selectedAlert}
        onReroute={handleCloseModal}
        onStayOnRoute={handleCloseModal}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  filterRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  chip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: radius.pill, backgroundColor: "#212636", borderWidth: 1, borderColor: "#2A2F3A" },
  chipActive: { backgroundColor: "#3B3F52" },
  chipText: { color: "#fff" },
  clearBtn: { marginLeft: "auto", paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.md, backgroundColor: colors.primary },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.md },
  loadingText: { color: colors.muted, fontSize: 14 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: spacing.xl },
  emptyText: { color: colors.muted, fontSize: 16, textAlign: "center" }
});
