import { useState, useEffect } from 'react';
import { getSavedTrips } from '../services/savedTripsStorage';

/**
 * Custom hook to fetch and format saved locations from AsyncStorage
 * @returns {Object} - { savedLocations, loading, refreshLocations }
 */
export const useSavedLocations = () => {
  const [savedLocations, setSavedLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedLocations = async () => {
    setLoading(true);
    try {
      const trips = await getSavedTrips();
      const locations = [];

      // Map saved trips to the format expected by location picker screens
      const tripTypes = [
        { key: 'home', icon: 'home', name: 'Home' },
        { key: 'school', icon: 'school', name: 'School' },
        { key: 'work', icon: 'briefcase', name: 'Work' },
        { key: 'gym', icon: 'fitness', name: 'Gym' }
      ];

      tripTypes.forEach((tripType, index) => {
        const trip = trips[tripType.key];
        if (trip && trip.address) {
          locations.push({
            id: `saved-${tripType.key}`,
            name: tripType.name,
            address: trip.address,
            icon: tripType.icon,
            coordinates: trip.coordinates || null,
            type: 'saved'
          });
        } else {
          // Show placeholder for unset locations
          locations.push({
            id: `saved-${tripType.key}`,
            name: tripType.name,
            address: 'Tap to set location',
            icon: tripType.icon,
            coordinates: null,
            type: 'saved',
            isPlaceholder: true
          });
        }
      });

      setSavedLocations(locations);
    } catch (error) {
      console.error('Error fetching saved locations:', error);
      setSavedLocations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedLocations();
  }, []);

  return {
    savedLocations,
    loading,
    refreshLocations: fetchSavedLocations
  };
};

export default useSavedLocations;