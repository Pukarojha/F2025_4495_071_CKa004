import React, { useMemo, useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Text, FlatList, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppBar from "../../components/ui/AppBar";
import AlertCard from "../../components/AlertCard";
import WeatherAlertModal from "../../components/WeatherAlertModal";
import { colors, spacing, radius, type } from "../../theme/tokens";
import { api } from "../../api/client";

const SEVERITIES = [
  { label: "Extreme", color: "#DC2626", icon: "warning" },
  { label: "Severe", color: "#EA580C", icon: "alert-circle" },
  { label: "Moderate", color: "#F59E0B", icon: "information-circle" },
  { label: "Minor", color: "#3B82F6", icon: "information-circle" }
];

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

  const getSeverityCount = (sev) => {
    return alerts.filter(a => a.severity === sev).length;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Alerts" />

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Filter by Severity</Text>
          {severity !== "" && (
            <Pressable onPress={() => setSeverity("")} style={styles.clearBtnSmall}>
              <Ionicons name="close-circle" size={14} color={colors.primary} />
              <Text style={styles.clearBtnSmallText}>Clear</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.filterGrid}>
          {SEVERITIES.map((sev) => {
            const count = getSeverityCount(sev.label);
            const isActive = severity === sev.label;

            return (
              <Pressable
                key={sev.label}
                onPress={() => setSeverity(isActive ? "" : sev.label)}
                style={[
                  styles.chip,
                  isActive && {
                    backgroundColor: sev.color + "20",
                    borderColor: sev.color,
                    borderWidth: 2
                  }
                ]}
              >
                <View style={styles.chipContent}>
                  <Ionicons
                    name={sev.icon}
                    size={16}
                    color={isActive ? sev.color : colors.muted}
                  />
                  <Text style={[
                    styles.chipText,
                    isActive && { color: sev.color, fontWeight: "600" }
                  ]}>
                    {sev.label}
                  </Text>
                </View>
                {count > 0 && (
                  <View style={[styles.badge, isActive && { backgroundColor: sev.color }]}>
                    <Text style={styles.badgeText}>{count}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
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
  filterContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm
  },
  filterTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  clearBtnSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.primary + "15"
  },
  clearBtnSmallText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary
  },
  filterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "48%",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: colors.border
  },
  chipContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    flex: 1
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.text
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 12,
    minWidth: 24,
    alignItems: "center",
    justifyContent: "center"
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md
  },
  loadingText: {
    color: colors.muted,
    fontSize: 14
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl
  },
  emptyText: {
    color: colors.muted,
    fontSize: 16,
    textAlign: "center"
  }
});
