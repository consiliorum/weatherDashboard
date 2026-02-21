<script lang="ts">
	import { weatherData } from '$lib/stores/weather';
	import { theme } from '$lib/stores/theme';
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

	function isToday(dateStr: string): boolean {
		const date = new Date(dateStr + 'T00:00:00');
		const today = new Date();
		return date.toDateString() === today.toDateString();
	}

	function getChartColors(t: string) {
		const isDark = t === 'dark';
		return {
			tick: isDark ? '#64748b' : '#64748b',
			grid: isDark ? 'rgba(148, 163, 184, 0.06)' : 'rgba(148, 163, 184, 0.15)',
			legendText: isDark ? '#94a3b8' : '#475569',
			tooltipBg: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
			tooltipTitle: isDark ? '#f1f5f9' : '#0f172a',
			tooltipBody: isDark ? '#94a3b8' : '#475569',
			tooltipBorder: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.25)'
		};
	}

	function renderChart() {
		if (!daily || !canvas) return;

		if (chart) chart.destroy();

		const labels = daily.time.map(formatDay);
		const colors = getChartColors($theme);

		chart = new Chart(canvas, {
			type: 'bar',
			data: {
				labels,
				datasets: [
					{
						label: 'High °C',
						data: daily.temperature_2m_max,
						backgroundColor: 'rgba(251, 146, 60, 0.6)',
						borderColor: 'rgba(251, 146, 60, 0.8)',
						borderWidth: 1,
						borderRadius: 6,
						borderSkipped: false
					},
					{
						label: 'Low °C',
						data: daily.temperature_2m_min,
						backgroundColor: 'rgba(56, 189, 248, 0.5)',
						borderColor: 'rgba(56, 189, 248, 0.7)',
						borderWidth: 1,
						borderRadius: 6,
						borderSkipped: false
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						labels: {
							color: colors.legendText,
							usePointStyle: true,
							pointStyle: 'rectRounded',
							padding: 20,
							font: { size: 12, family: 'Inter' }
						}
					},
					tooltip: {
						backgroundColor: colors.tooltipBg,
						titleColor: colors.tooltipTitle,
						bodyColor: colors.tooltipBody,
						borderColor: colors.tooltipBorder,
						borderWidth: 1,
						cornerRadius: 8,
						padding: 12,
						titleFont: { family: 'Inter', weight: 'bold' as const },
						bodyFont: { family: 'Inter' },
						callbacks: {
							label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}°C`
						}
					}
				},
				scales: {
					x: {
						ticks: { color: colors.tick, font: { size: 11, family: 'Inter' } },
						grid: { color: colors.grid }
					},
					y: {
						ticks: {
							color: colors.tick,
							callback: (v) => v + '°',
							font: { size: 11, family: 'Inter' }
						},
						grid: { color: colors.grid }
					}
				}
			}
		});
	}

	onMount(() => {
		renderChart();
	});

	$effect(() => {
		// Re-render when data or theme changes
		if (daily || $theme) renderChart();
	});
</script>

{#if daily}
	<div class="glass-card p-4 sm:p-6">
		<div class="mb-4 flex items-center gap-2">
			<svg class="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				<path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
			<h3 class="text-base font-semibold">7-Day Forecast</h3>
		</div>

		<div class="custom-scrollbar mb-5 flex gap-2 overflow-x-auto pb-2">
			{#each daily.time as day, i}
				<div class="flex min-w-[85px] flex-col items-center gap-1 rounded-xl px-3 py-3 transition-colors {isToday(day) ? 'bg-accent/10 ring-1 ring-accent/30' : 'bg-bg-card hover:bg-bg-card-hover'}">
					<span class="text-xs font-medium {isToday(day) ? 'text-accent' : 'text-text-muted'}">
						{isToday(day) ? 'Today' : formatDay(day).split(',')[0]}
					</span>
					<span class="text-2xl">{getWeatherInfo(daily.weather_code[i]).icon}</span>
					<div class="flex items-center gap-1 text-xs">
						<span class="font-semibold text-warm">{Math.round(daily.temperature_2m_max[i])}°</span>
						<span class="text-text-muted">/</span>
						<span class="text-text-secondary">{Math.round(daily.temperature_2m_min[i])}°</span>
					</div>
					<span class="mt-0.5 text-[10px] text-text-muted">{daily.precipitation_probability_max[i]}% rain</span>
				</div>
			{/each}
		</div>

		<div class="h-56">
			<canvas bind:this={canvas}></canvas>
		</div>
	</div>
{/if}
