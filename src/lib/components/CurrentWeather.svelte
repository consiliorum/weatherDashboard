<script lang="ts">
	import { weatherData, selectedLocation } from '$lib/stores/weather';
	import { getWeatherInfo } from '$lib/utils/weatherCodes';

	const weather = $derived($weatherData?.current);
	const location = $derived($selectedLocation);
	const info = $derived(weather ? getWeatherInfo(weather.weather_code) : null);
</script>

{#if weather && location && info}
	<div class="rounded-xl bg-bg-secondary p-6 shadow-lg">
		<h2 class="mb-1 text-lg text-text-secondary">{location.name}{location.country ? ', ' + location.country : ''}</h2>
		<div class="flex items-center gap-4">
			<span class="text-6xl">{info.icon}</span>
			<div>
				<p class="text-5xl font-bold">{Math.round(weather.temperature_2m)}°C</p>
				<p class="text-text-secondary">{info.description}</p>
			</div>
		</div>
		<div class="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
			<div class="rounded-lg bg-bg-card p-3">
				<p class="text-text-secondary">Feels like</p>
				<p class="text-lg font-semibold">{Math.round(weather.apparent_temperature)}°C</p>
			</div>
			<div class="rounded-lg bg-bg-card p-3">
				<p class="text-text-secondary">Humidity</p>
				<p class="text-lg font-semibold">{weather.relative_humidity_2m}%</p>
			</div>
			<div class="rounded-lg bg-bg-card p-3">
				<p class="text-text-secondary">Wind</p>
				<p class="text-lg font-semibold">{weather.wind_speed_10m} km/h</p>
			</div>
			<div class="rounded-lg bg-bg-card p-3">
				<p class="text-text-secondary">UV Index</p>
				<p class="text-lg font-semibold">{weather.uv_index}</p>
			</div>
		</div>
	</div>
{/if}
