/**
 * Google Maps API Configuration
 *
 * IMPORTANT: For production, store API keys securely using:
 * 1. Environment variables (react-native-config or expo-constants)
 * 2. Secure storage solutions
 * 3. Backend proxy to hide API keys
 *
 * Never commit actual API keys to version control!
 */

import { GOOGLE_MAPS_API_KEY as ENV_API_KEY } from '@env';

// Use environment variable, with fallback for development
export const GOOGLE_MAPS_API_KEY = ENV_API_KEY || 'AIzaSyAVahG7GQUf3dQaUjT3hEQvBYliKTkikUg';

// API Configuration
export const GOOGLE_MAPS_CONFIG = {
  // Default map settings
  defaultZoom: 15,
  defaultMapType: 'standard',

  // Search radius in meters
  defaultSearchRadius: 5000,

  // Maximum number of autocomplete results
  maxAutocompleteResults: 5,

  // Route calculation settings
  routeOptions: {
    mode: 'driving',
    alternatives: true,
    avoidTolls: false,
    avoidHighways: false,
    avoidFerries: false
  },

  // Place types for filtering
  placeTypes: {
    gasStation: 'gas_station',
    restaurant: 'restaurant',
    hotel: 'lodging',
    parking: 'parking',
    store: 'store'
  }
};

// Map style presets
export const MAP_STYLES = {
  standard: [],
  light: [
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "transit",
      stylers: [{ visibility: "off" }]
    }
  ],
  dark: [
    {
      elementType: "geometry",
      stylers: [{ color: "#242f3e" }]
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#242f3e" }]
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#746855" }]
    }
  ]
};

// Route colors matching Figma design
export const ROUTE_COLORS = {
  main: '#8B5CF6', // Purple for main route
  alternate: '#C4B5FD', // Light purple for alternate routes
  active: '#7C3AED' // Darker purple for active navigation
};
