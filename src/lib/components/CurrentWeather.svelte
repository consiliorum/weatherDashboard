<script lang="ts">
	import { weatherData, selectedLocation } from '$lib/stores/weather';
	import { getWeatherInfo } from '$lib/utils/weatherCodes';

	const weather = $derived($weatherData?.current);
	const location = $derived($selectedLocation);
	const info = $derived(weather ? getWeatherInfo(weather.weather_code) : null);

	const uvLevel = $derived(() => {
		if (!weather) return { label: '', color: '' };
		const uv = weather.uv_index;
		if (uv <= 2) return { label: 'Low', color: 'text-green-400' };
		if (uv <= 5) return { label: 'Moderate', color: 'text-yellow-400' };
		if (uv <= 7) return { label: 'High', color: 'text-orange-400' };
		return { label: 'Very High', color: 'text-red-400' };
	});
</script>

{#if weather && location && info}
	<div class="glass-card flex flex-col p-6">
		<div class="mb-1 flex items-center gap-2">
			<svg class="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				<path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
				<path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
			</svg>
			<h2 class="text-sm font-medium text-text-secondary">
				{location.name}{location.country ? ', ' + location.country : ''}
			</h2>
		</div>

		<div class="my-4 flex items-center gap-5">
			<span class="text-7xl leading-none drop-shadow-lg">{info.icon}</span>
			<div>
				<p class="text-6xl font-bold tracking-tighter">{Math.round(weather.temperature_2m)}<span class="text-3xl font-normal text-text-secondary">°C</span></p>
				<p class="mt-1 text-sm font-medium text-text-secondary">{info.description}</p>
			</div>
		</div>

		<div class="mt-auto grid grid-cols-2 gap-3 sm:grid-cols-4">
			<div class="rounded-xl bg-bg-card p-3 transition-colors hover:bg-bg-card-hover">
				<div class="mb-1 flex items-center gap-1.5">
					<svg class="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25v-.008Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007v-.008Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008v-.008Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008v-.008Z" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
					<p class="text-xs text-text-muted">Feels like</p>
				</div>
				<p class="text-lg font-semibold">{Math.round(weather.apparent_temperature)}°C</p>
			</div>
			<div class="rounded-xl bg-bg-card p-3 transition-colors hover:bg-bg-card-hover">
				<div class="mb-1 flex items-center gap-1.5">
					<svg class="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
					<p class="text-xs text-text-muted">Humidity</p>
				</div>
				<p class="text-lg font-semibold">{weather.relative_humidity_2m}<span class="text-sm text-text-secondary">%</span></p>
			</div>
			<div class="rounded-xl bg-bg-card p-3 transition-colors hover:bg-bg-card-hover">
				<div class="mb-1 flex items-center gap-1.5">
					<svg class="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path d="M6 12h12M6 12l3-3m-3 3l3 3" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
					<p class="text-xs text-text-muted">Wind</p>
				</div>
				<p class="text-lg font-semibold">{weather.wind_speed_10m}<span class="text-sm text-text-secondary"> km/h</span></p>
			</div>
			<div class="rounded-xl bg-bg-card p-3 transition-colors hover:bg-bg-card-hover">
				<div class="mb-1 flex items-center gap-1.5">
					<svg class="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="4" />
						<path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke-linecap="round" />
					</svg>
					<p class="text-xs text-text-muted">UV Index</p>
				</div>
				<p class="text-lg font-semibold">
					{weather.uv_index}
					<span class="text-xs font-normal {uvLevel().color}">{uvLevel().label}</span>
				</p>
			</div>
		</div>
	</div>
{/if}
