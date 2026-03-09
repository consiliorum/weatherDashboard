<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { loadWeather, loading, error, weatherData, selectedLocation } from '$lib/stores/weather';
	import { theme, toggleTheme } from '$lib/stores/theme';
	import { unitSystem, toggleUnits } from '$lib/stores/units';
	import { isNightAt } from '$lib/utils/dayNight';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import CurrentWeather from '$lib/components/CurrentWeather.svelte';
	import ForecastChart from '$lib/components/ForecastChart.svelte';
	import HourlyForecast from '$lib/components/HourlyForecast.svelte';
	import WeatherMap from '$lib/components/WeatherMap.svelte';

	let shared = $state(false);

	function shareLocation() {
		const loc = $selectedLocation;
		if (!loc) return;
		const url = new URL(window.location.href);
		url.search = '';
		url.searchParams.set('lat', loc.latitude.toString());
		url.searchParams.set('lon', loc.longitude.toString());
		url.searchParams.set('name', loc.name + (loc.admin1 ? `, ${loc.admin1}` : '') + (loc.country ? `, ${loc.country}` : ''));
		navigator.clipboard.writeText(url.toString()).then(() => {
			shared = true;
			setTimeout(() => (shared = false), 2000);
		});
	}

	onMount(() => {
		const searchParams = get(page).url.searchParams;
		const lat = parseFloat(searchParams.get('lat') ?? '');
		const lon = parseFloat(searchParams.get('lon') ?? '');
		const name = searchParams.get('name') ?? '';

		if (!isNaN(lat) && !isNaN(lon)) {
			loadWeather({ name: name || `${lat}, ${lon}`, latitude: lat, longitude: lon });
			return;
		}

		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				(pos) => loadWeather({ name: 'My Location', latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
				() => loadWeather({ name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'UK' })
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

<div class="mx-auto max-w-7xl overflow-x-hidden px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
	<header class="relative z-[1000] mb-6 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-xl sm:h-10 sm:w-10 sm:text-2xl">
					<span>
						{#if $weatherData}
							{@const code = $weatherData.current.weather_code}
							{@const night = $weatherData.daily.sunrise[0] ? isNightAt($weatherData.timezone, $weatherData.daily.sunrise[0], $weatherData.daily.sunset[0]) : false}
							{#if code === 0}{night ? "🌙" : "☀️"}{:else if code <= 3}{night ? "🌙" : "⛅"}{:else}&#127326;&#65039;{/if}
						{:else}
							&#127780;&#65039;
						{/if}
					</span>
				</div>
				<h1 class="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
					Weather<span class="text-accent">Dashboard</span>
				</h1>
			</div>
			<button
				onclick={toggleTheme}
				class="flex h-9 w-9 items-center justify-center rounded-xl border border-glass-border bg-bg-secondary backdrop-blur-xl transition-all duration-300 hover:border-glass-border-light hover:shadow-lg sm:hidden"
				aria-label="Toggle theme"
			>
				{#if $theme === 'dark'}
					<svg class="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="4" />
						<path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke-linecap="round" />
					</svg>
				{:else}
					<svg class="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				{/if}
			</button>
		</div>
		<div class="flex items-center gap-2">
			<SearchBar />
			<button
				onclick={toggleUnits}
				class="flex h-10 items-center justify-center rounded-xl border border-glass-border bg-bg-secondary px-3 text-sm font-medium text-text-secondary backdrop-blur-xl transition-all duration-300 hover:border-glass-border-light hover:text-accent hover:shadow-lg"
				title="Toggle units"
			>
				{$unitSystem === 'metric' ? '°C' : '°F'}
			</button>
			<button
				onclick={shareLocation}
				disabled={!$selectedLocation}
				class="flex h-10 w-10 items-center justify-center rounded-xl border border-glass-border bg-bg-secondary backdrop-blur-xl transition-all duration-300 hover:border-glass-border-light hover:shadow-lg disabled:opacity-40"
				title="Copy shareable link"
			>
				{#if shared}
					<svg class="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path d="M4.5 12.75l6 6 9-13.5" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				{:else}
					<svg class="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				{/if}
			</button>
			<button
				onclick={toggleTheme}
				class="hidden h-10 w-10 items-center justify-center rounded-xl border border-glass-border bg-bg-secondary backdrop-blur-xl transition-all duration-300 hover:border-glass-border-light hover:shadow-lg sm:flex"
				aria-label="Toggle theme"
			>
				{#if $theme === 'dark'}
					<svg class="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="4" />
						<path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke-linecap="round" />
					</svg>
				{:else}
					<svg class="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				{/if}
			</button>
		</div>
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
		<div class="stagger-children grid gap-6 md:grid-cols-2">
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
