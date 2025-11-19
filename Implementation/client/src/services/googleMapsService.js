import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '../config/googleMaps';

// Base URLs for Google Maps APIs
const DIRECTIONS_API_URL = 'https://maps.googleapis.com/maps/api/directions/json';
const PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place';
const GEOCODING_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

/**
 * Get directions between two points
 * @param {Object} origin - Origin location {latitude, longitude} or address string
 * @param {Object} destination - Destination location {latitude, longitude} or address string
 * @param {Object} options - Additional options (waypoints, avoid, mode, alternatives)
 * @returns {Promise} - Directions response
 */
export const getDirections = async (origin, destination, options = {}) => {
  try {
    const {
      waypoints = [],
      avoid = [], // tolls, highways, ferries
      mode = 'driving',
      alternatives = true,
      departureTime = 'now'
    } = options;

    // Format origin and destination
    const originStr = typeof origin === 'string'
      ? origin
      : `${origin.latitude},${origin.longitude}`;

    const destinationStr = typeof destination === 'string'
      ? destination
      : `${destination.latitude},${destination.longitude}`;

    // Format waypoints
    const waypointsStr = waypoints.length > 0
      ? waypoints.map(wp =>
          typeof wp === 'string' ? wp : `${wp.latitude},${wp.longitude}`
        ).join('|')
      : null;

    // Format avoid parameter
    const avoidStr = avoid.length > 0 ? avoid.join('|') : null;

    const params = {
      origin: originStr,
      destination: destinationStr,
      key: GOOGLE_MAPS_API_KEY,
      mode,
      alternatives,
      departure_time: departureTime
    };

    if (waypointsStr) {
      params.waypoints = waypointsStr;
    }

    if (avoidStr) {
      params.avoid = avoidStr;
    }

    const response = await axios.get(DIRECTIONS_API_URL, { params });

    if (response.data.status === 'OK') {
      return {
        success: true,
        routes: response.data.routes.map(route => ({
          bounds: route.bounds,
          overview_polyline: route.overview_polyline.points,
          legs: route.legs.map(leg => ({
            distance: leg.distance,
            duration: leg.duration,
            start_address: leg.start_address,
            end_address: leg.end_address,
            start_location: leg.start_location,
            end_location: leg.end_location,
            steps: leg.steps.map(step => ({
              distance: step.distance,
              duration: step.duration,
              instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // Remove HTML tags
              maneuver: step.maneuver,
              start_location: step.start_location,
              end_location: step.end_location,
              polyline: step.polyline.points
            }))
          })),
          summary: route.summary,
          warnings: route.warnings,
          waypoint_order: route.waypoint_order
        }))
      };
    } else {
      return {
        success: false,
        error: response.data.status,
        message: response.data.error_message || 'Failed to get directions'
      };
    }
  } catch (error) {
    console.error('Error getting directions:', error);
    return {
      success: false,
      error: 'REQUEST_FAILED',
      message: error.message
    };
  }
};

/**
 * Search for places using Google Places API
 * @param {string} query - Search query
 * @param {Object} location - Current location {latitude, longitude}
 * @param {number} radius - Search radius in meters
 * @param {string} type - Place type (gas_station, restaurant, etc.)
 * @returns {Promise} - Places search response
 */
export const searchPlaces = async (query, location = null, radius = 5000, type = null) => {
  try {
    const params = {
      query,
      key: GOOGLE_MAPS_API_KEY
    };

    if (location) {
      params.location = `${location.latitude},${location.longitude}`;
      params.radius = radius;
    }

    if (type) {
      params.type = type;
    }

    const response = await axios.get(`${PLACES_API_URL}/textsearch/json`, { params });

    if (response.data.status === 'OK' || response.data.status === 'ZERO_RESULTS') {
      return {
        success: true,
        places: response.data.results.map(place => ({
          id: place.place_id,
          name: place.name,
          address: place.formatted_address,
          location: place.geometry.location,
          types: place.types,
          rating: place.rating,
          userRatingsTotal: place.user_ratings_total,
          photos: place.photos,
          openNow: place.opening_hours?.open_now
        }))
      };
    } else {
      return {
        success: false,
        error: response.data.status,
        message: response.data.error_message || 'Failed to search places'
      };
    }
  } catch (error) {
    console.error('Error searching places:', error);
    return {
      success: false,
      error: 'REQUEST_FAILED',
      message: error.message
    };
  }
};

/**
 * Get place autocomplete suggestions
 * @param {string} input - User input text
 * @param {Object} location - Current location {latitude, longitude}
 * @param {number} radius - Search radius in meters
 * @returns {Promise} - Autocomplete suggestions
 */
export const getPlaceAutocomplete = async (input, location = null, radius = 50000) => {
  try {
    const params = {
      input,
      key: GOOGLE_MAPS_API_KEY
    };

    if (location) {
      params.location = `${location.latitude},${location.longitude}`;
      params.radius = radius;
    }

    const response = await axios.get(`${PLACES_API_URL}/autocomplete/json`, { params });

    if (response.data.status === 'OK' || response.data.status === 'ZERO_RESULTS') {
      return {
        success: true,
        predictions: response.data.predictions.map(prediction => ({
          id: prediction.place_id,
          description: prediction.description,
          mainText: prediction.structured_formatting.main_text,
          secondaryText: prediction.structured_formatting.secondary_text,
          types: prediction.types
        }))
      };
    } else {
      return {
        success: false,
        error: response.data.status,
        message: response.data.error_message || 'Failed to get autocomplete'
      };
    }
  } catch (error) {
    console.error('Error getting autocomplete:', error);
    return {
      success: false,
      error: 'REQUEST_FAILED',
      message: error.message
    };
  }
};

/**
 * Get place details by place ID
 * @param {string} placeId - Google Place ID
 * @returns {Promise} - Place details
 */
export const getPlaceDetails = async (placeId) => {
  try {
    const params = {
      place_id: placeId,
      key: GOOGLE_MAPS_API_KEY,
      fields: 'name,formatted_address,geometry,place_id,types,rating,opening_hours,formatted_phone_number'
    };

    const response = await axios.get(`${PLACES_API_URL}/details/json`, { params });

    if (response.data.status === 'OK') {
      const place = response.data.result;
      return {
        success: true,
        place: {
          id: place.place_id,
          name: place.name,
          address: place.formatted_address,
          location: place.geometry.location,
          types: place.types,
          rating: place.rating,
          phone: place.formatted_phone_number,
          openNow: place.opening_hours?.open_now
        }
      };
    } else {
      return {
        success: false,
        error: response.data.status,
        message: response.data.error_message || 'Failed to get place details'
      };
    }
  } catch (error) {
    console.error('Error getting place details:', error);
    return {
      success: false,
      error: 'REQUEST_FAILED',
      message: error.message
    };
  }
};

/**
 * Geocode an address to coordinates
 * @param {string} address - Address to geocode
 * @returns {Promise} - Geocoded location
 */
export const geocodeAddress = async (address) => {
  try {
    const params = {
      address,
      key: GOOGLE_MAPS_API_KEY
    };

    const response = await axios.get(GEOCODING_API_URL, { params });

    if (response.data.status === 'OK') {
      const result = response.data.results[0];
      return {
        success: true,
        location: result.geometry.location,
        formattedAddress: result.formatted_address,
        placeId: result.place_id
      };
    } else {
      return {
        success: false,
        error: response.data.status,
        message: response.data.error_message || 'Failed to geocode address'
      };
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    return {
      success: false,
      error: 'REQUEST_FAILED',
      message: error.message
    };
  }
};

/**
 * Reverse geocode coordinates to address
 * @param {Object} location - Location {latitude, longitude}
 * @returns {Promise} - Address information
 */
export const reverseGeocode = async (location) => {
  try {
    const params = {
      latlng: `${location.latitude},${location.longitude}`,
      key: GOOGLE_MAPS_API_KEY
    };

    const response = await axios.get(GEOCODING_API_URL, { params });

    if (response.data.status === 'OK') {
      const result = response.data.results[0];
      return {
        success: true,
        address: result.formatted_address,
        placeId: result.place_id,
        addressComponents: result.address_components
      };
    } else {
      return {
        success: false,
        error: response.data.status,
        message: response.data.error_message || 'Failed to reverse geocode'
      };
    }
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return {
      success: false,
      error: 'REQUEST_FAILED',
      message: error.message
    };
  }
};

/**
 * Get nearby popular places
 * @param {Object} location - Current location {latitude, longitude}
 * @param {number} radius - Search radius in meters (default 5000)
 * @param {string} type - Place type (default null for all types)
 * @returns {Promise} - Nearby places response
 */
export const getNearbyPlaces = async (location, radius = 5000, type = null) => {
  try {
    const params = {
      location: `${location.latitude},${location.longitude}`,
      radius,
      key: GOOGLE_MAPS_API_KEY,
      rankby: 'prominence'
    };

    if (type) {
      params.type = type;
    }

    const response = await axios.get(`${PLACES_API_URL}/nearbysearch/json`, { params });

    if (response.data.status === 'OK' || response.data.status === 'ZERO_RESULTS') {
      return {
        success: true,
        places: response.data.results.map(place => ({
          id: place.place_id,
          name: place.name,
          address: place.vicinity,
          location: place.geometry.location,
          types: place.types,
          rating: place.rating,
          userRatingsTotal: place.user_ratings_total,
          openNow: place.opening_hours?.open_now,
          icon: place.icon
        }))
      };
    } else {
      return {
        success: false,
        error: response.data.status,
        message: response.data.error_message || 'Failed to get nearby places'
      };
    }
  } catch (error) {
    console.error('Error getting nearby places:', error);
    return {
      success: false,
      error: 'REQUEST_FAILED',
      message: error.message
    };
  }
};

/**
 * Decode polyline string to coordinates
 * @param {string} encoded - Encoded polyline string
 * @returns {Array} - Array of {latitude, longitude} objects
 */
export const decodePolyline = (encoded) => {
  const poly = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    poly.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5
    });
  }

  return poly;
};
