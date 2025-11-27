const API_BASE = process.env.EXPO_PUBLIC_API_BASE || "http://localhost:4566/2015-03-31/functions";

// Helper function to fix S3 URLs for different platforms
function fixS3Url(url) {
  // Lambda returns URLs with Docker internal IP (172.18.0.2)
  // We need to replace it with the appropriate address for the client platform

  // Extract the base URL from API_BASE to determine what to use
  const baseUrl = API_BASE.replace('/2015-03-31/functions', '');
  const targetHost = baseUrl.replace('http://', '').replace('https://', '');

  // Replace Docker internal IPs with the appropriate host
  return url
    .replace('172.18.0.2:4566', targetHost)
    .replace('localhost:4566', targetHost)
    .replace('host.docker.internal:4566', targetHost);
}

async function http(path, init) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...(init || {})
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function invokeLambda(functionName, payload) {
  try {
    const res = await fetch(`${API_BASE}/${functionName}/invocations`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      console.error(`Lambda ${functionName} error: ${res.status}`);
      throw new Error(`HTTP ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Error invoking Lambda ${functionName}:`, error);
    throw error;
  }
}

export const api = {
  getAlerts: async () => {
    // Fetch all weather alerts from the backend
    try {
      console.log('[API] Fetching all alerts...');
      const payload = {
        body: JSON.stringify({})
      };

      const response = await invokeLambda('search', payload);
      console.log('[API] Search Lambda response:', response);

      if (response.statusCode === 200) {
        const body = JSON.parse(response.body);
        console.log('[API] Parsed body:', body);

        if (body.url && Array.isArray(body.url)) {
          console.log(`[API] Found ${body.url.length} alert URLs`);

          // Fetch alerts from each URL
          const alertPromises = body.url.map(async (url) => {
            try {
              // Fix URL to use the correct host for this platform
              const fixedUrl = fixS3Url(url);
              console.log('[API] Original URL:', url);
              console.log('[API] Fixed URL:', fixedUrl);
              const alertRes = await fetch(fixedUrl);
              if (alertRes.ok) {
                const alert = await alertRes.json();
                console.log('[API] Alert fetched:', alert.properties?.id);
                return alert;
              }
            } catch (err) {
              console.error('[API] Error fetching alert from URL:', url, err);
              return null;
            }
          });

          const alerts = await Promise.all(alertPromises);
          const validAlerts = alerts.filter(alert => alert !== null);
          console.log(`[API] Successfully fetched ${validAlerts.length} alerts`);

          // Extract properties from each alert (NOAA format)
          return validAlerts.map(alert => alert.properties || alert);
        }
      }

      console.log('[API] No alerts found');
      return [];
    } catch (error) {
      console.error('[API] Error fetching alerts:', error);
      return [];
    }
  },

  getAlertsForRoute: async (coordinates) => {
    try {
      // Invoke the search Lambda function with coordinates
      const payload = {
        body: JSON.stringify({ coordinates })
      };

      const response = await invokeLambda('search', payload);

      if (response.statusCode === 200) {
        const body = JSON.parse(response.body);

        // The response contains URLs to S3 where alerts are stored
        if (body.url && Array.isArray(body.url)) {
          // Fetch alerts from each URL
          const alertPromises = body.url.map(async (url) => {
            try {
              const fixedUrl = fixS3Url(url);
              const alertRes = await fetch(fixedUrl);
              if (alertRes.ok) {
                return await alertRes.json();
              }
            } catch (err) {
              console.error('Error fetching alert from URL:', url, err);
              return null;
            }
          });

          const alerts = await Promise.all(alertPromises);
          return alerts.filter(alert => alert !== null).flat();
        }
      }

      return [];
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      return [];
    }
  },

  getAllAlerts: async () => {
    try {
      // Get all alerts (no coordinates filter)
      const payload = {
        body: JSON.stringify({})
      };

      const response = await invokeLambda('search', payload);

      if (response.statusCode === 200) {
        const body = JSON.parse(response.body);

        if (body.url && Array.isArray(body.url)) {
          const alertPromises = body.url.map(async (url) => {
            try {
              const fixedUrl = fixS3Url(url);
              const alertRes = await fetch(fixedUrl);
              if (alertRes.ok) {
                return await alertRes.json();
              }
            } catch (err) {
              console.error('Error fetching alert from URL:', url, err);
              return null;
            }
          });

          const alerts = await Promise.all(alertPromises);
          return alerts.filter(alert => alert !== null).flat();
        }
      }

      return [];
    } catch (error) {
      console.error('Error fetching all alerts:', error);
      return [];
    }
  },

  getZones: () => http(`/zones`),
  search: (q) => http(`/search?q=${encodeURIComponent(q)}`)
};