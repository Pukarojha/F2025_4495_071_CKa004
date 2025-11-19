import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const TOLL_PASSES = [
  'BancPass',
  'Bestpass',
  'E-PASS',
  'E-ZPass',
  'Express Lanes',
  'ExpressToll',
  'EZ Tag',
  'EZPass',
  'FasTrak',
  'Fuego',
  'Good To Go! Pass',
  'K-Tag',
  'Peach Pass',
  'Pike Pass',
  'Sun Pass',
  'TEXpress',
  'TollTag',
  'TxTag',
];

export default function TollPassScreen() {
  const navigation = useNavigation();
  const [selectedPasses, setSelectedPasses] = useState([]);

  // Handler for "+" button
  const handleAddPass = (pass) => {
    if (!selectedPasses.includes(pass)) {
      setSelectedPasses([...selectedPasses, pass]);
      // Optional: show a confirmation message
      Alert.alert('Pass Added', `${pass} has been added to your passes.`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Modal-style header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.title}>Toll and Express Lane Passes</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#212121" />
        </TouchableOpacity>
      </View>
      {/* List of toll passes */}
      <FlatList
        data={TOLL_PASSES}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.passRow}>
            <Text style={styles.passText}>{item}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddPass(item)}
              disabled={selectedPasses.includes(item)}
            >
              <Ionicons
                name={selectedPasses.includes(item) ? "checkmark-circle" : "add-circle"}
                size={28}
                color={selectedPasses.includes(item) ? "green" : "#29B6F6"}
              />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9FF', // light blue
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF5FF',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  closeButton: {
    padding: 8,
    marginLeft: 8,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    color: '#212121',
  },
  listContent: {
    marginTop: 8,
    paddingBottom: 16,
  },
  passRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 4,
    borderRadius: 10,
    marginHorizontal: 16,
    justifyContent: 'space-between',
  },
  passText: {
    fontSize: 17,
    color: '#212121',
  },
  addButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
});
