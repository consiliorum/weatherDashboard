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
			icon: getWeatherInfo(hourly.weather_code[start + i]).icon
		}));
	});
</script>

{#if hourly}
	<div class="rounded-xl bg-bg-secondary p-6 shadow-lg">
		<h3 class="mb-4 text-lg font-semibold">Hourly Forecast</h3>
		<div class="flex gap-3 overflow-x-auto pb-2">
			{#each next24Hours() as hour}
				<div class="flex min-w-[60px] flex-col items-center rounded-lg bg-bg-card px-3 py-2">
					<span class="text-xs text-text-secondary">{hour.time}</span>
					<span class="my-1 text-xl">{hour.icon}</span>
					<span class="text-sm font-semibold">{hour.temp}°</span>
				</div>
			{/each}
		</div>
	</div>
{/if}
