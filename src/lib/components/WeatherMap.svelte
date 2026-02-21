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
	let isMobile = $state(false);
	let mapInteractive = $state(false);
	let interactTimeout: ReturnType<typeof setTimeout>;

	const TILES = {
		dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
		light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
	};

	function enableMapInteraction() {
		if (!map) return;
		mapInteractive = true;
		map.dragging.enable();
		map.touchZoom.enable();
		clearTimeout(interactTimeout);
		interactTimeout = setTimeout(() => {
			if (!map) return;
			mapInteractive = false;
			map.dragging.disable();
			map.touchZoom.disable();
		}, 3000);
	}

	onMount(async () => {
		const leaflet = await import('leaflet');
		L = leaflet;

		isMobile = window.matchMedia('(max-width: 768px)').matches;

		const m = leaflet.map(mapContainer, {
			zoomControl: false,
			dragging: !isMobile,
			scrollWheelZoom: !isMobile,
			touchZoom: !isMobile
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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="glass-card relative overflow-hidden" onclick={isMobile && !mapInteractive ? enableMapInteraction : undefined}>
	<div bind:this={mapContainer} class="h-[280px] w-full transition-colors duration-300 sm:h-[400px]" style="background-color: var(--theme-map-bg);"></div>
	{#if isMobile && !mapInteractive}
		<div class="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center">
			<span class="rounded-full bg-black/50 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm">
				Tap to interact with map
			</span>
		</div>
	{/if}
</div>
