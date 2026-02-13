<script lang="ts">
	import { weatherData } from '$lib/stores/weather';
	import { getWeatherInfo } from '$lib/utils/weatherCodes';
	import { Chart, registerables } from 'chart.js';
	import { onMount } from 'svelte';

	Chart.register(...registerables);

	let canvas = $state<HTMLCanvasElement>(undefined!);
	let chart: Chart | null = null;

	const daily = $derived($weatherData?.daily);

	function formatDay(dateStr: string): string {
		const date = new Date(dateStr + 'T00:00:00');
		return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
	}

	function renderChart() {
		if (!daily || !canvas) return;

		if (chart) chart.destroy();

		const labels = daily.time.map(formatDay);

		chart = new Chart(canvas, {
			type: 'bar',
			data: {
				labels,
				datasets: [
					{
						label: 'High °C',
						data: daily.temperature_2m_max,
						backgroundColor: 'rgba(251, 146, 60, 0.7)',
						borderColor: 'rgb(251, 146, 60)',
						borderWidth: 1,
						borderRadius: 4
					},
					{
						label: 'Low °C',
						data: daily.temperature_2m_min,
						backgroundColor: 'rgba(56, 189, 248, 0.7)',
						borderColor: 'rgb(56, 189, 248)',
						borderWidth: 1,
						borderRadius: 4
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						labels: { color: '#94a3b8' }
					}
				},
				scales: {
					x: {
						ticks: { color: '#94a3b8' },
						grid: { color: 'rgba(148, 163, 184, 0.1)' }
					},
					y: {
						ticks: { color: '#94a3b8', callback: (v) => v + '°' },
						grid: { color: 'rgba(148, 163, 184, 0.1)' }
					}
				}
			}
		});
	}

	onMount(() => {
		renderChart();
	});

	$effect(() => {
		if (daily) renderChart();
	});
</script>

{#if daily}
	<div class="rounded-xl bg-bg-secondary p-6 shadow-lg">
		<h3 class="mb-4 text-lg font-semibold">7-Day Forecast</h3>
		<div class="mb-4 flex gap-2 overflow-x-auto pb-2">
			{#each daily.time as day, i}
				<div class="flex min-w-[80px] flex-col items-center rounded-lg bg-bg-card px-3 py-2 text-xs">
					<span class="text-text-secondary">{formatDay(day).split(',')[0]}</span>
					<span class="text-2xl">{getWeatherInfo(daily.weather_code[i]).icon}</span>
					<span class="text-text-secondary">{daily.precipitation_probability_max[i]}% 💧</span>
				</div>
			{/each}
		</div>
		<div class="h-64">
			<canvas bind:this={canvas}></canvas>
		</div>
	</div>
{/if}
