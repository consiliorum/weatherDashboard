<script lang="ts">
	import { onMount } from 'svelte';
	import { selectedLocation, weatherData, loadWeather } from '$lib/stores/weather';
	import { theme } from '$lib/stores/theme';
	import { getWeatherInfo } from '$lib/utils/weatherCodes';
	import type { Map, Marker, TileLayer } from 'leaflet';

	let mapContainer: HTMLDivElement;
	let map = $state<Map | null>(null);
	let marker = $state<Marker | null>(null);
	let currentTileLayer: TileLayer | null = null;
	let L = $state<typeof import('leaflet') | null>(null);

	const TILES = {
		dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
		light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
	};

	onMount(async () => {
		const leaflet = await import('leaflet');
		L = leaflet;

		const m = leaflet.map(mapContainer, {
			zoomControl: false
		}).setView([48.8566, 2.3522], 5);

		leaflet.control.zoom({ position: 'bottomright' }).addTo(m);

		const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
		currentTileLayer = leaflet.tileLayer(TILES[currentTheme], {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
		}).addTo(m);

		marker = leaflet.marker([48.8566, 2.3522]).addTo(m);
		map = m;

		m.on('click', (e) => {
			const { lat, lng } = e.latlng;
			loadWeather({ name: `${lat.toFixed(2)}, ${lng.toFixed(2)}`, latitude: lat, longitude: lng });
		});
	});

	// Swap tiles when theme changes
	$effect(() => {
		const t = $theme;
		if (map && currentTileLayer && L) {
			map.removeLayer(currentTileLayer);
			currentTileLayer = L.tileLayer(TILES[t], {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
			}).addTo(map);
		}
	});

	$effect(() => {
		const loc = $selectedLocation;
		const weather = $weatherData;
		if (loc && map && marker && L) {
			const pos: [number, number] = [loc.latitude, loc.longitude];
			map.setView(pos, 10);
			marker.setLatLng(pos);

			if (weather) {
				const info = getWeatherInfo(weather.current.weather_code);
				marker.bindPopup(
					`<strong>${loc.name}</strong><br>${info.icon} ${Math.round(weather.current.temperature_2m)}°C<br>${info.description}`
				).openPopup();
			}
		}
	});
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
		crossorigin=""
	/>
</svelte:head>

<div class="glass-card overflow-hidden">
	<div bind:this={mapContainer} class="h-[400px] w-full transition-colors duration-300" style="background-color: var(--theme-map-bg);"></div>
</div>
