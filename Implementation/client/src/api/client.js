/**
 * Simple API client for the new Express backend (server2)
 *
 * This replaces the complex LocalStack integration with a simple HTTP API
 */

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || "http://localhost:3000";

export const api = {
  /**
   * Get all active weather alerts
   */
  getAlerts: async () => {
    try {
      console.log('[API] Fetching all alerts from:', `${API_BASE}/alerts`);

      const response = await fetch(`${API_BASE}/alerts`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const alerts = await response.json();
      console.log(`[API] Successfully fetched ${alerts.length} alerts`);

      return alerts;
    } catch (error) {
      console.error('[API] Error fetching alerts:', error);
      return [];
    }
  },

  /**
   * Get alerts for specific coordinates (route)
   * @param {Array} coordinates - Array of [lat, lon] pairs
   */
  getAlertsForRoute: async (coordinates) => {
    try {
      console.log(`[API] Searching alerts for ${coordinates.length} coordinates`);

      const response = await fetch(`${API_BASE}/alerts/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coordinates })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const alerts = await response.json();
      console.log(`[API] Found ${alerts.length} alerts for route`);

      return alerts;
    } catch (error) {
      console.error('[API] Error searching alerts:', error);
      return [];
    }
  },

  /**
   * Get alerts for a specific state
   * @param {string} state - 2-letter state code (e.g., 'NY', 'CA')
   */
  getAlertsByState: async (state) => {
    try {
      console.log(`[API] Fetching alerts for state: ${state}`);

      const response = await fetch(`${API_BASE}/alerts/${state}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const alerts = await response.json();
      console.log(`[API] Found ${alerts.length} alerts for ${state}`);

      return alerts;
    } catch (error) {
      console.error(`[API] Error fetching alerts for ${state}:`, error);
      return [];
    }
  },

  /**
   * Health check
   */
  healthCheck: async () => {
    try {
      const response = await fetch(`${API_BASE}/health`);
      return response.json();
    } catch (error) {
      console.error('[API] Health check failed:', error);
      return { status: 'error', message: error.message };
    }
  }
};