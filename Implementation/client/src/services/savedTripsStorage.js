import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_TRIPS_KEY = '@saved_trips';

/**
 * Get all saved trips from storage
 * @returns {Promise<Object>} - Saved trips object
 */
export const getSavedTrips = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(SAVED_TRIPS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : {
      home: null,
      work: null,
      gym: null,
      school: null
    };
  } catch (error) {
    console.error('Error getting saved trips:', error);
    return {
      home: null,
      work: null,
      gym: null,
      school: null
    };
  }
};

/**
 * Save a trip location
 * @param {string} type - Trip type (home, work, gym, school)
 * @param {Object} location - Location data {address, coordinates, name}
 * @returns {Promise<boolean>} - Success status
 */
export const saveTripLocation = async (type, location) => {
  try {
    const savedTrips = await getSavedTrips();
    savedTrips[type] = location;
    const jsonValue = JSON.stringify(savedTrips);
    await AsyncStorage.setItem(SAVED_TRIPS_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving trip location:', error);
    return false;
  }
};

/**
 * Remove a saved trip
 * @param {string} type - Trip type (home, work, gym, school)
 * @returns {Promise<boolean>} - Success status
 */
export const removeTripLocation = async (type) => {
  try {
    const savedTrips = await getSavedTrips();
    savedTrips[type] = null;
    const jsonValue = JSON.stringify(savedTrips);
    await AsyncStorage.setItem(SAVED_TRIPS_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error('Error removing trip location:', error);
    return false;
  }
};

/**
 * Clear all saved trips
 * @returns {Promise<boolean>} - Success status
 */
export const clearAllTrips = async () => {
  try {
    await AsyncStorage.removeItem(SAVED_TRIPS_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing saved trips:', error);
    return false;
  }
};