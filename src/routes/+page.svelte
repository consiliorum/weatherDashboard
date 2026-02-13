<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { loadWeather, loading, error, weatherData } from '$lib/stores/weather';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import CurrentWeather from '$lib/components/CurrentWeather.svelte';
	import ForecastChart from '$lib/components/ForecastChart.svelte';
	import HourlyForecast from '$lib/components/HourlyForecast.svelte';
	import WeatherMap from '$lib/components/WeatherMap.svelte';

	onMount(() => {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					loadWeather({
						name: 'My Location',
						latitude: pos.coords.latitude,
						longitude: pos.coords.longitude
					});
				},
				() => {
					// Default to London if geolocation denied
					loadWeather({ name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'UK' });
				}
			);
		} else {
			loadWeather({ name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'UK' });
		}
	});
</script>

<svelte:head>
	<title>Weather Dashboard</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-6">
	<header class="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
		<h1 class="text-2xl font-bold text-accent">Weather Dashboard</h1>
		<SearchBar />
	</header>

	{#if $loading}
		<div class="flex items-center justify-center py-20">
			<div class="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
		</div>
	{:else if $error}
		<div class="rounded-lg bg-red-900/30 p-4 text-center text-red-300">{$error}</div>
	{:else if $weatherData}
		<div class="grid gap-6 lg:grid-cols-2">
			<CurrentWeather />
			<WeatherMap />
		</div>
		<div class="mt-6">
			<HourlyForecast />
		</div>
		<div class="mt-6">
			<ForecastChart />
		</div>
	{/if}
</div>
