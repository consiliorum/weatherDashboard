# Weather Dashboard

A real-time weather dashboard built with SvelteKit, featuring interactive maps, 7-day forecasts, and hourly breakdowns. Powered entirely by free APIs — no API keys required.

![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=flat&logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

## Features

- **City Search** — Autocomplete search powered by Open-Meteo Geocoding API
- **Current Conditions** — Temperature, feels-like, humidity, wind speed, and UV index
- **7-Day Forecast** — Daily high/low bar chart with weather icons and precipitation probability
- **Hourly Forecast** — Scrollable 24-hour breakdown with temperatures and conditions
- **Interactive Map** — Leaflet map with OpenStreetMap tiles; click anywhere to load weather for that location
- **Geolocation** — Automatically detects your location on first visit
- **Dark Theme** — Slate-toned dark UI built with Tailwind CSS

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | SvelteKit + TypeScript |
| Weather Data | [Open-Meteo API](https://open-meteo.com/) (free, no key) |
| Geocoding | [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) |
| Maps | [Leaflet](https://leafletjs.com/) + OpenStreetMap |
| Charts | [Chart.js](https://www.chartjs.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4 |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/consiliorum/weatherDashboard.git
cd weatherDashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── lib/
│   ├── api/
│   │   ├── weather.ts          # Open-Meteo forecast client
│   │   └── geocoding.ts        # Geocoding search client
│   ├── components/
│   │   ├── SearchBar.svelte    # City search with autocomplete
│   │   ├── CurrentWeather.svelte
│   │   ├── ForecastChart.svelte
│   │   ├── HourlyForecast.svelte
│   │   └── WeatherMap.svelte   # Interactive Leaflet map
│   ├── stores/
│   │   └── weather.ts          # Svelte stores for app state
│   ├── types/
│   │   └── weather.ts          # TypeScript interfaces
│   └── utils/
│       └── weatherCodes.ts     # WMO code → icon/description mapping
└── routes/
    └── +page.svelte            # Main dashboard page
```

## License

MIT
