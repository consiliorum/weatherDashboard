<script lang="ts">
	import { weatherData } from '$lib/stores/weather';
	import { getWeatherInfo } from '$lib/utils/weatherCodes';

	const hourly = $derived($weatherData?.hourly);

	const next24Hours = $derived(() => {
		if (!hourly) return [];
		const now = new Date();
		const currentHourIndex = hourly.time.findIndex((t) => new Date(t) >= now);
		const start = Math.max(0, currentHourIndex);
		return hourly.time.slice(start, start + 24).map((time, i) => ({
			time: new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
			temp: Math.round(hourly.temperature_2m[start + i]),
			icon: getWeatherInfo(hourly.weather_code[start + i]).icon,
			isNow: i === 0
		}));
	});
</script>

{#if hourly}
	<div class="glass-card p-4 sm:p-6">
		<div class="mb-4 flex items-center gap-2">
			<svg class="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				<path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
			<h3 class="text-base font-semibold">Hourly Forecast</h3>
		</div>
		<div class="custom-scrollbar flex gap-2 overflow-x-auto pb-2">
			{#each next24Hours() as hour}
				<div class="flex min-w-[68px] flex-col items-center gap-1 rounded-xl px-3 py-3 transition-colors {hour.isNow ? 'bg-accent/10 ring-1 ring-accent/30' : 'bg-bg-card hover:bg-bg-card-hover'}">
					<span class="text-xs font-medium {hour.isNow ? 'text-accent' : 'text-text-muted'}">
						{hour.isNow ? 'Now' : hour.time}
					</span>
					<span class="my-0.5 text-xl">{hour.icon}</span>
					<span class="text-sm font-semibold">{hour.temp}°</span>
				</div>
			{/each}
		</div>
	</div>
{/if}
