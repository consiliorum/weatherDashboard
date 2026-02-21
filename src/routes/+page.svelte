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
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<header class="relative z-[1000] mb-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
		<div class="flex items-center gap-3">
			<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-2xl">
				<span>
					{#if $weatherData}
						{@const code = $weatherData.current.weather_code}
						{#if code === 0}&#9728;&#65039;{:else if code <= 3}&#9925;{:else}&#127326;&#65039;{/if}
					{:else}
						&#127780;&#65039;
					{/if}
				</span>
			</div>
			<h1 class="text-2xl font-bold tracking-tight text-text-primary">
				Weather<span class="text-accent">Dashboard</span>
			</h1>
		</div>
		<SearchBar />
	</header>

	{#if $loading}
		<div class="flex flex-col items-center justify-center gap-4 py-24">
			<div class="pulse-glow h-12 w-12 animate-spin rounded-full border-[3px] border-accent/30 border-t-accent"></div>
			<p class="text-sm text-text-secondary">Fetching weather data...</p>
		</div>
	{:else if $error}
		<div class="glass-card animate-fade-in mx-auto max-w-md p-6 text-center">
			<span class="mb-3 block text-3xl">&#9888;&#65039;</span>
			<p class="font-medium text-red-400">{$error}</p>
			<p class="mt-2 text-sm text-text-secondary">Please try again or search for a different city.</p>
		</div>
	{:else if $weatherData}
		<div class="stagger-children grid gap-6 lg:grid-cols-2">
			<CurrentWeather />
			<WeatherMap />
		</div>
		<div class="mt-6 animate-fade-in" style="animation-delay: 200ms;">
			<HourlyForecast />
		</div>
		<div class="mt-6 animate-fade-in" style="animation-delay: 300ms;">
			<ForecastChart />
		</div>
	{/if}
</div>
