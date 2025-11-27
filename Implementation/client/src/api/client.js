const API_BASE = process.env.EXPO_PUBLIC_API_BASE || "";

async function http(path, init) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...(init || {})
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const api = {
  getAlerts: (p) => {
    const qs = p ? "?" + new URLSearchParams(Object.entries(p).filter(([, v]) => !!v)).toString() : "";
    return http(`/alerts${qs}`);
  },

  getAlertsForRoute: async (coordinates) => {
    try {
      const res = await fetch(`${API_BASE}/search`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coordinates })
      });

      if (!res.ok) {
        console.error(`Weather alerts API error: ${res.status}`);
        return [];
      }

      const data = await res.json();

      if (data.url) {
        const alertsRes = await fetch(data.url);
        if (alertsRes.ok) {
          return await alertsRes.json();
        }
      }

      return [];
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      return [];
    }
  },

  getZones: () => http(`/zones`),
  search: (q) => http(`/search?q=${encodeURIComponent(q)}`)
};
