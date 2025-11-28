const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');

const app = express();
const PORT = process.env.PORT || 3000;

// Cache alerts for 5 minutes
const cache = new NodeCache({ stdTTL: 300 });

// Enable CORS for all origins (you can restrict this later)
app.use(cors());
app.use(express.json());

// NOAA API base URL
const NOAA_API = 'https://api.weather.gov';

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * GET /alerts
 * Get all active weather alerts in the US
 */
app.get('/alerts', async (req, res) => {
  try {
    console.log('[API] Fetching all active alerts from NOAA...');

    // Check cache first
    const cachedAlerts = cache.get('all-alerts');
    if (cachedAlerts) {
      console.log('[API] Returning cached alerts');
      return res.json(cachedAlerts);
    }

    // Fetch from NOAA API
    const response = await axios.get(`${NOAA_API}/alerts/active`, {
      headers: {
        'User-Agent': 'WeatherDriverApp/1.0',
        'Accept': 'application/geo+json'
      }
    });

    const alerts = response.data.features.map(feature => ({
      id: feature.properties.id,
      event: feature.properties.event,
      severity: feature.properties.severity,
      certainty: feature.properties.certainty,
      urgency: feature.properties.urgency,
      headline: feature.properties.headline,
      description: feature.properties.description,
      instruction: feature.properties.instruction,
      areaDesc: feature.properties.areaDesc,
      sent: feature.properties.sent,
      effective: feature.properties.effective,
      expires: feature.properties.expires,
      status: feature.properties.status,
      messageType: feature.properties.messageType,
      category: feature.properties.category,
      geometry: feature.geometry
    }));

    console.log(`[API] Found ${alerts.length} active alerts`);

    // Cache the results
    cache.set('all-alerts', alerts);

    res.json(alerts);
  } catch (error) {
    console.error('[API] Error fetching alerts:', error.message);
    res.status(500).json({
      error: 'Failed to fetch weather alerts',
      message: error.message
    });
  }
});

/**
 * POST /alerts/search
 * Search for alerts by coordinates
 * Body: { coordinates: [[lat, lon], [lat, lon], ...] }
 */
app.post('/alerts/search', async (req, res) => {
  try {
    const { coordinates } = req.body;

    if (!coordinates || !Array.isArray(coordinates)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'coordinates array is required'
      });
    }

    console.log(`[API] Searching alerts for ${coordinates.length} coordinate pairs`);

    // Get all alerts
    let alerts;
    const cachedAlerts = cache.get('all-alerts');

    if (cachedAlerts) {
      alerts = cachedAlerts;
    } else {
      const response = await axios.get(`${NOAA_API}/alerts/active`, {
        headers: {
          'User-Agent': 'WeatherDriverApp/1.0',
          'Accept': 'application/geo+json'
        }
      });

      alerts = response.data.features.map(feature => ({
        id: feature.properties.id,
        event: feature.properties.event,
        severity: feature.properties.severity,
        certainty: feature.properties.certainty,
        urgency: feature.properties.urgency,
        headline: feature.properties.headline,
        description: feature.properties.description,
        instruction: feature.properties.instruction,
        areaDesc: feature.properties.areaDesc,
        sent: feature.properties.sent,
        effective: feature.properties.effective,
        expires: feature.properties.expires,
        status: feature.properties.status,
        messageType: feature.properties.messageType,
        category: feature.properties.category,
        geometry: feature.geometry
      }));

      cache.set('all-alerts', alerts);
    }

    // Debug: Log geometry types and sample alerts
    const geometryTypes = {};
    alerts.forEach(alert => {
      const type = alert.geometry?.type || 'null';
      geometryTypes[type] = (geometryTypes[type] || 0) + 1;
    });
    console.log('[API] Alert geometry types:', geometryTypes);

    // Log sample alerts to understand the data structure
    if (alerts.length > 0) {
      console.log('[API] Sample alert with null geometry:', {
        event: alerts[0].event,
        severity: alerts[0].severity,
        areaDesc: alerts[0].areaDesc,
        hasGeometry: !!alerts[0].geometry
      });
    }

    // Since many alerts have null geometry, use a hybrid approach:
    // 1. Try geometry-based matching first
    // 2. Fallback to state-based matching using areaDesc

    // Extract unique states from route
    const routeStates = new Set();
    coordinates.forEach(coord => {
      const [lat, lon] = coord;
      const state = getStateFromCoordinates(lat, lon);
      if (state) routeStates.add(state);
    });
    console.log('[API] Route passes through states:', Array.from(routeStates));

    const relevantAlerts = alerts.filter(alert => {
      // Try geometry-based matching first
      if (alert.geometry && alert.geometry.coordinates) {
        const geometryMatch = coordinates.some(coord => {
          const [lat, lon] = coord;
          return isPointInAlertGeometry(lat, lon, alert.geometry);
        });
        if (geometryMatch) return true;
      }

      // Fallback: Match by states along the route
      // Extract state codes from route coordinates
      if (alert.areaDesc) {
        const matched = coordinates.some(coord => {
          const [lat, lon] = coord;
          const state = getStateFromCoordinates(lat, lon);
          // Check if alert's area description contains the state
          return state && alert.areaDesc.includes(state);
        });
        return matched;
      }

      return false;
    });

    console.log(`[API] Found ${relevantAlerts.length} relevant alerts`);
    if (relevantAlerts.length > 0) {
      console.log('[API] Relevant alerts:', relevantAlerts.map(a => ({
        event: a.event,
        severity: a.severity,
        area: a.areaDesc
      })));
    }
    res.json(relevantAlerts);
  } catch (error) {
    console.error('[API] Error searching alerts:', error.message);
    res.status(500).json({
      error: 'Failed to search weather alerts',
      message: error.message
    });
  }
});

/**
 * GET /alerts/:state
 * Get alerts for a specific state (e.g., /alerts/NY)
 */
app.get('/alerts/:state', async (req, res) => {
  try {
    const { state } = req.params;
    console.log(`[API] Fetching alerts for state: ${state}`);

    const cacheKey = `alerts-${state}`;
    const cachedAlerts = cache.get(cacheKey);

    if (cachedAlerts) {
      console.log(`[API] Returning cached alerts for ${state}`);
      return res.json(cachedAlerts);
    }

    const response = await axios.get(`${NOAA_API}/alerts/active?area=${state.toUpperCase()}`, {
      headers: {
        'User-Agent': 'WeatherDriverApp/1.0',
        'Accept': 'application/geo+json'
      }
    });

    const alerts = response.data.features.map(feature => ({
      id: feature.properties.id,
      event: feature.properties.event,
      severity: feature.properties.severity,
      certainty: feature.properties.certainty,
      urgency: feature.properties.urgency,
      headline: feature.properties.headline,
      description: feature.properties.description,
      instruction: feature.properties.instruction,
      areaDesc: feature.properties.areaDesc,
      sent: feature.properties.sent,
      effective: feature.properties.effective,
      expires: feature.properties.expires,
      geometry: feature.geometry
    }));

    console.log(`[API] Found ${alerts.length} alerts for ${state}`);
    cache.set(cacheKey, alerts);

    res.json(alerts);
  } catch (error) {
    console.error(`[API] Error fetching alerts for state:`, error.message);
    res.status(500).json({
      error: 'Failed to fetch state alerts',
      message: error.message
    });
  }
});

/**
 * Get US state abbreviation from coordinates
 * This is a simplified approach using rough lat/lon boundaries
 */
function getStateFromCoordinates(lat, lon) {
  // Simplified state boundaries for major states along common routes
  // Washington
  if (lat >= 45.5 && lat <= 49 && lon >= -124.7 && lon <= -116.9) return 'WA';
  // Oregon
  if (lat >= 42 && lat <= 46.3 && lon >= -124.5 && lon <= -116.5) return 'OR';
  // California
  if (lat >= 32.5 && lat <= 42 && lon >= -124.4 && lon <= -114.1) return 'CA';
  // Illinois
  if (lat >= 37 && lat <= 42.5 && lon >= -91.5 && lon <= -87.5) return 'IL';
  // New York
  if (lat >= 40.5 && lat <= 45 && lon >= -79.8 && lon <= -71.9) return 'NY';

  // Add more states as needed
  return null;
}

/**
 * Helper function to check if a point is within an alert's geometry
 * Supports Polygon, MultiPolygon, and handles missing geometry
 */
function isPointInAlertGeometry(lat, lon, geometry) {
  if (!geometry || !geometry.coordinates) {
    // No geometry data - can't determine if point is affected
    return false;
  }

  // Handle different geometry types
  if (geometry.type === 'Polygon') {
    return checkPointInPolygon(lat, lon, geometry.coordinates[0]);
  } else if (geometry.type === 'MultiPolygon') {
    // Check if point is in any of the polygons
    return geometry.coordinates.some(polygon =>
      checkPointInPolygon(lat, lon, polygon[0])
    );
  }

  return false;
}

/**
 * Check if a point is within or near a polygon using expanded bounding box
 * coords is an array of [longitude, latitude] pairs
 * Expands the bounding box by ~50 miles (~0.75 degrees) to catch nearby alerts
 */
function checkPointInPolygon(lat, lon, coords) {
  if (!coords || coords.length === 0) {
    return false;
  }

  // Bounding box check with buffer zone
  let minLat = Infinity, maxLat = -Infinity;
  let minLon = Infinity, maxLon = -Infinity;

  coords.forEach(([lng, lt]) => {
    minLat = Math.min(minLat, lt);
    maxLat = Math.max(maxLat, lt);
    minLon = Math.min(minLon, lng);
    maxLon = Math.max(maxLon, lng);
  });

  // Expand bounding box by ~50 miles (~0.75 degrees latitude/longitude)
  const buffer = 0.75;
  minLat -= buffer;
  maxLat += buffer;
  minLon -= buffer;
  maxLon += buffer;

  return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(60));
  console.log('🌦️  Weather Driver Server Started');
  console.log('='.repeat(60));
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`📡 Network accessible on: http://0.0.0.0:${PORT}`);
  console.log('');
  console.log('Available endpoints:');
  console.log(`  GET  /health              - Health check`);
  console.log(`  GET  /alerts              - All active alerts`);
  console.log(`  GET  /alerts/:state       - Alerts for specific state`);
  console.log(`  POST /alerts/search       - Search alerts by coordinates`);
  console.log('='.repeat(60));
});