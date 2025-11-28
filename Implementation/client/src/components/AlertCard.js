import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors, type, spacing, radius } from "../theme/tokens";
import AlertBadge from "./AlertBadge";

export default function AlertCard({ title, description, severity, area, updatedAt, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed
      ]}
      onPress={onPress}
    >
      <View style={styles.row}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <AlertBadge severity={severity} />
      </View>
      {!!description && <Text style={styles.desc} numberOfLines={3}>{description}</Text>}
      <Text style={styles.meta}>{area} • Updated {new Date(updatedAt).toLocaleTimeString()}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceAlt,
    marginHorizontal: spacing.lg, marginVertical: spacing.sm,
    padding: spacing.md, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border
  },
  cardPressed: {
    backgroundColor: "#2A2F3A",
    opacity: 0.8
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  title: { ...type.h3, color: colors.text, flex: 1, marginRight: spacing.sm },
  desc: { ...type.body, color: "#C9CED8", marginTop: 6 },
  meta: { ...type.caption, color: colors.muted, marginTop: 8 }
});
