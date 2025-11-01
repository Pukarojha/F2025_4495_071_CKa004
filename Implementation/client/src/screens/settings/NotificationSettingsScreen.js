import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
// Replace with your project tokens and colors if needed
const colors = {
  text: "#111",
  muted: "#ADB5BD",
  bg: "#F5FBFF",
  surface: "#fff",
  border: "#E0E0E0",
  primary: "#25A7B8",
};

const spacing = {
  lg: 18,
  md: 10,
  sm: 8,
  xxl: 34,
};

export default function NotificationSettingsScreen({ route, navigation }) {
  const { initialTab } = route?.params || {};
  const [tab, setTab] = useState(initialTab || "Push");

  // Push options
  const [pushAll, setPushAll] = useState(true);
  const [pushOptions, setPushOptions] = useState([
    { id: 1, label: "Important alerts", enabled: true },
    { id: 2, label: "Announcements and Updates", enabled: true },
    { id: 3, label: "Holiday traffic", enabled: true },
    { id: 4, label: "Traffic delay notifications", enabled: true },
    { id: 5, label: "Major traffic events", enabled: true },
    { id: 6, label: "Planned Drives Reminders", enabled: true },
  ]);

  // Email options
  const [emailAll, setEmailAll] = useState(true);
  const [emailOptions, setEmailOptions] = useState([
    { id: 1, label: "Traffic in my area", enabled: false },
    { id: 2, label: "Personalized tips", enabled: false },
    { id: 3, label: "News and Updates", enabled: false },
    { id: 4, label: "Important Announcements", enabled: false },
    { id: 5, label: "Promotional offers", enabled: false },
    { id: 6, label: "Service Updates", enabled: false },
  ]);

  // Store initial state, never updates automatically
  const initialPushAll = useRef(pushAll);
  const initialPushOptions = useRef(pushOptions.map(opt => opt.enabled));
  const initialEmailAll = useRef(emailAll);
  const initialEmailOptions = useRef(emailOptions.map(opt => opt.enabled));

  // Change detection
  const pushOptionsChanged =
    initialPushAll.current !== pushAll ||
    initialPushOptions.current.some((val, i) => val !== pushOptions[i].enabled);

  const emailOptionsChanged =
    initialEmailAll.current !== emailAll ||
    initialEmailOptions.current.some((val, i) => val !== emailOptions[i].enabled);

  const changesMade =
    (tab === "Push" && pushOptionsChanged) ||
    (tab === "Email" && emailOptionsChanged);

  // Handlers for checkboxes and tabs
  const togglePushAll = () => {
    const val = !pushAll;
    setPushAll(val);
    setPushOptions(pushOptions.map(opt => ({ ...opt, enabled: val })));
  };
  const togglePushOption = (id) => {
    setPushOptions(pushOptions.map(opt =>
      opt.id === id ? { ...opt, enabled: !opt.enabled } : opt
    ));
  };
  const toggleEmailAll = () => {
    const val = !emailAll;
    setEmailAll(val);
    setEmailOptions(emailOptions.map(opt => ({ ...opt, enabled: val })));
  };
  const toggleEmailOption = (id) => {
    setEmailOptions(emailOptions.map(opt =>
      opt.id === id ? { ...opt, enabled: !opt.enabled } : opt
    ));
  };

  const handleSave = () => {
    // Insert your save logic (API, state, etc)
    // After saving, update "initial" refs to current state
    if (tab === "Push") {
      initialPushAll.current = pushAll;
      initialPushOptions.current = pushOptions.map(opt => opt.enabled);
    }
    if (tab === "Email") {
      initialEmailAll.current = emailAll;
      initialEmailOptions.current = emailOptions.map(opt => opt.enabled);
    }
    // Optionally show feedback
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>
      {/* Tabs */}
      <View style={styles.tabs}>
        <Pressable onPress={() => setTab("Push")} style={styles.tabBtn}>
          <Text style={[styles.tabText, tab === "Push" && styles.tabActive]}>Push</Text>
          {tab === "Push" && <View style={styles.activeBar} />}
        </Pressable>
        <Pressable onPress={() => setTab("Email")} style={styles.tabBtn}>
          <Text style={[styles.tabText, tab === "Email" && styles.tabActive]}>Email</Text>
          {tab === "Email" && <View style={styles.activeBar} />}
        </Pressable>
      </View>
      {/* Body */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Master checkbox */}
        <View style={styles.mainCheckRow}>
          <Pressable onPress={tab === "Push" ? togglePushAll : toggleEmailAll}>
            <Ionicons
              name={
                (tab === "Push" ? pushAll : emailAll)
                  ? "checkbox"
                  : "square-outline"
              }
              size={24}
              color={colors.primary}
            />
          </Pressable>
          <Text style={styles.mainCheckLabel}>
            {tab === "Push"
              ? "Receive all push notifications"
              : "Receive all email notifications"}
          </Text>
        </View>
        {/* Card (rounded for options) */}
        <View style={styles.card}>
          {(tab === "Push" ? pushOptions : emailOptions).map(opt => (
            <Pressable
              key={opt.id}
              style={styles.cardRow}
              onPress={() =>
                tab === "Push"
                  ? togglePushOption(opt.id)
                  : toggleEmailOption(opt.id)
              }
            >
              <Ionicons
                name={opt.enabled ? "checkbox" : "square-outline"}
                size={22}
                color={opt.enabled ? colors.primary : "#bbb"}
              />
              <Text style={styles.optionLabel}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>
        {/* Save button */}
        <Pressable
          style={[
            styles.saveBtn,
            !changesMade && { backgroundColor: "#a0dbe0" }
          ]}
          disabled={!changesMade}
          onPress={handleSave}
        >
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: 40,
    paddingBottom: 14,
    backgroundColor: colors.bg,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: colors.text },
  tabs: {
    flexDirection: "row",
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 6,
  },
  tabBtn: { flex: 1, alignItems: "center", position: "relative", paddingVertical: 5 },
  tabText: { fontSize: 16, color: "#8899A6", fontWeight: "600" },
  tabActive: { color: "#111" },
  activeBar: {
    height: 3,
    backgroundColor: colors.primary,
    width: "100%",
    borderRadius: 2,
    marginTop: 2,
    position: "absolute",
    bottom: -2,
    left: 0,
  },
  mainCheckRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 18,
  },
  mainCheckLabel: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 10,
    fontWeight: "500",
  },
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 0,
    shadowColor: "#222",
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 0.7,
    borderBottomColor: colors.border,
  },
  optionLabel: { fontSize: 16, color: colors.text, marginLeft: 15, fontWeight: "400" },
  saveBtn: {
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    marginVertical: 28,
    paddingVertical: 20,
    alignItems: "center",
    borderRadius: 13,
  },
  saveText: { color: "#FFF", fontSize: 17, fontWeight: "700" },
});