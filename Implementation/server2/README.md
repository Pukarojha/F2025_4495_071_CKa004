# Weather Driver Server

A simple Express.js backend that fetches weather alerts from the NOAA API.

## Features

- ✅ Fetches real-time weather alerts from NOAA
- ✅ Caches alerts for 5 minutes to reduce API calls
- ✅ CORS enabled for frontend access
- ✅ Simple REST API
- ✅ No database required
- ✅ No Docker required
- ✅ Works on all platforms (Windows, Mac, Linux)

## Quick Start

### 1. Install Dependencies

```bash
cd server2
npm install
```

### 2. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-27T12:00:00.000Z"
}
```

### GET /alerts
Get all active weather alerts in the US

**Response:**
```json
[
  {
    "id": "urn:oid:...",
    "event": "Winter Storm Warning",
    "severity": "Severe",
    "urgency": "Expected",
    "headline": "Winter Storm Warning...",
    "description": "Heavy snow expected...",
    "areaDesc": "Western New York",
    "sent": "2025-01-15T10:00:00-05:00",
    "expires": "2025-01-16T18:00:00-05:00"
  }
]
```

### GET /alerts/:state
Get alerts for a specific state (use 2-letter state code)

**Example:** `/alerts/NY` for New York alerts

### POST /alerts/search
Search for alerts affecting specific coordinates

**Request Body:**
```json
{
  "coordinates": [
    [40.7128, -74.0060],
    [34.0522, -118.2437]
  ]
}
```

**Response:** Array of alerts affecting those coordinates

## Testing

### Test with curl

```bash
# Health check
curl http://localhost:3000/health

# Get all alerts
curl http://localhost:3000/alerts

# Get alerts for a state
curl http://localhost:3000/alerts/NY

# Search by coordinates
curl -X POST http://localhost:3000/alerts/search \
  -H "Content-Type: application/json" \
  -d '{"coordinates": [[40.7128, -74.0060]]}'
```

### Test with browser
Open `http://localhost:3000/alerts` in your browser

## Frontend Integration

Update your frontend `.env`:

```env
# For Web/iOS Simulator
EXPO_PUBLIC_API_BASE=http://localhost:3000

# For Android Emulator
EXPO_PUBLIC_API_BASE=http://10.0.2.2:3000

# For Physical Device (use your computer's IP)
EXPO_PUBLIC_API_BASE=http://192.168.0.110:3000
```

Update `client/src/api/client.js`:

```javascript
const API_BASE = process.env.EXPO_PUBLIC_API_BASE || "http://localhost:3000";

export const api = {
  getAlerts: async () => {
    const response = await fetch(`${API_BASE}/alerts`);
    return response.json();
  },

  getAlertsForRoute: async (coordinates) => {
    const response = await fetch(`${API_BASE}/alerts/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coordinates })
    });
    return response.json();
  }
};
```

## Advantages over LocalStack

1. ✅ **Much simpler** - just run `npm install` and `npm start`
2. ✅ **No Docker** - runs directly on your machine
3. ✅ **Real data** - fetches live alerts from NOAA
4. ✅ **Fast** - caching reduces API calls
5. ✅ **Easy debugging** - see console logs immediately
6. ✅ **Works everywhere** - web, Android, iOS, physical devices
7. ✅ **No URL fixing needed** - direct HTTP communication

## Port Configuration

Default port is 3000. To change:

```bash
PORT=8080 npm start
```

## Development Tips

- Server auto-restarts on file changes with `npm run dev`
- Check console for detailed logs
- Alerts are cached for 5 minutes
- CORS is enabled for all origins (restrict in production)

## Troubleshooting

### Port already in use
Change the port in package.json or use:
```bash
PORT=8080 npm start
```

### Cannot reach from Android emulator
Make sure you're using `http://10.0.2.2:3000` in your `.env`

### No alerts returned
The NOAA API returns alerts only when there are active weather events. Try different states or check https://api.weather.gov/alerts/active in your browser.