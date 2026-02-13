<script lang="ts">
	import { onMount } from 'svelte';
	import { selectedLocation, weatherData, loadWeather } from '$lib/stores/weather';
	import { getWeatherInfo } from '$lib/utils/weatherCodes';
	import type { Map, Marker } from 'leaflet';

	let mapContainer: HTMLDivElement;
	let map: Map;
	let marker: Marker;
	let L: typeof import('leaflet');

	onMount(async () => {
		L = await import('leaflet');

		map = L.map(mapContainer).setView([48.8566, 2.3522], 5);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);

		marker = L.marker([48.8566, 2.3522]).addTo(map);

		map.on('click', (e) => {
			const { lat, lng } = e.latlng;
			loadWeather({ name: `${lat.toFixed(2)}, ${lng.toFixed(2)}`, latitude: lat, longitude: lng });
		});
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

<div class="overflow-hidden rounded-xl shadow-lg">
	<div bind:this={mapContainer} class="h-[400px] w-full"></div>
</div>
