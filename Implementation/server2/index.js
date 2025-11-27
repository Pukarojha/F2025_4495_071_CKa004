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

    // Filter alerts that affect the given coordinates
    const relevantAlerts = alerts.filter(alert => {
      if (!alert.geometry || !alert.geometry.coordinates) {
        return false;
      }

      // Check if any of the user's coordinates fall within the alert's geometry
      return coordinates.some(coord => {
        const [lat, lon] = coord;
        return isPointInAlertGeometry(lat, lon, alert.geometry);
      });
    });

    console.log(`[API] Found ${relevantAlerts.length} relevant alerts`);
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
 * Helper function to check if a point is within an alert's geometry
 * This is a simplified version - for production, you'd want a proper GeoJSON library
 */
function isPointInAlertGeometry(lat, lon, geometry) {
  if (!geometry || geometry.type !== 'Polygon') {
    return false;
  }

  // For simplicity, we'll do a bounding box check
  // In production, you'd use a proper point-in-polygon algorithm
  const coords = geometry.coordinates[0];

  let minLat = Infinity, maxLat = -Infinity;
  let minLon = Infinity, maxLon = -Infinity;

  coords.forEach(([lng, lt]) => {
    minLat = Math.min(minLat, lt);
    maxLat = Math.max(maxLat, lt);
    minLon = Math.min(minLon, lng);
    maxLon = Math.max(maxLon, lng);
  });

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