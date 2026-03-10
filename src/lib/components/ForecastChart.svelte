<script lang="ts">
	import { weatherData } from '$lib/stores/weather';
	import WeatherIcon from './WeatherIcon.svelte';
	import { theme } from '$lib/stores/theme';
	import { getWeatherInfo } from '$lib/utils/weatherCodes';
	import { Chart, registerables } from 'chart.js';
	import { onMount } from 'svelte';
	import { unitSystem, convertTemp, tempUnit } from '$lib/stores/units';

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
			tick:          isDark ? '#64748b' : '#64748b',
			grid:          isDark ? 'rgba(148, 163, 184, 0.06)' : 'rgba(148, 163, 184, 0.15)',
			legendText:    isDark ? '#94a3b8' : '#475569',
			tooltipBg:     isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
			tooltipTitle:  isDark ? '#f1f5f9' : '#0f172a',
			tooltipBody:   isDark ? '#94a3b8' : '#475569',
			tooltipBorder: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.25)'
		};
	}

	function renderChart() {
		if (!daily || !canvas) return;

		if (chart) chart.destroy();

		const isMobile   = window.innerWidth < 640;
		const labels     = daily.time.map((d) =>
			isMobile
				? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })
				: formatDay(d)
		);
		const colors     = getChartColors($theme);
		const units      = $unitSystem;
		const tUnit      = tempUnit(units);
		const tickSize   = isMobile ? 10 : 11;
		const legendSize = isMobile ? 10 : 12;
		const ptRadius   = isMobile ? 3 : 4;
		const ptHover    = isMobile ? 5 : 6;

		const allTemps = [
			...daily.temperature_2m_max.map((t) => convertTemp(t, units)),
			...daily.temperature_2m_min.map((t) => convertTemp(t, units))
		];
		const rawMin = Math.min(...allTemps);
		const rawMax = Math.max(...allTemps);
		const yMin = rawMin - (rawMin % 2 !== 0 ? 1 : 2);
		const yMax = rawMax + (rawMax % 2 !== 0 ? 1 : 2);

		chart = new Chart(canvas, {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						label: `High ${tUnit}`,
						data: daily.temperature_2m_max.map((t) => convertTemp(t, units)),
						borderColor: 'rgba(251, 146, 60, 0.8)',
						backgroundColor: 'rgba(251, 146, 60, 0.15)',
						borderWidth: 2,
						pointBackgroundColor: 'rgba(251, 146, 60, 0.9)',
						pointRadius: ptRadius,
						pointHoverRadius: ptHover,
						tension: 0.4,
						fill: false
					},
					{
						label: `Low ${tUnit}`,
						data: daily.temperature_2m_min.map((t) => convertTemp(t, units)),
						borderColor: 'rgba(56, 189, 248, 0.7)',
						backgroundColor: 'rgba(56, 189, 248, 0.1)',
						borderWidth: 2,
						pointBackgroundColor: 'rgba(56, 189, 248, 0.9)',
						pointRadius: ptRadius,
						pointHoverRadius: ptHover,
						tension: 0.4,
						fill: false
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
							padding: isMobile ? 12 : 20,
							font: { size: legendSize, family: 'Inter' }
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
							label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}${tUnit}`
						}
					}
				},
				scales: {
					x: {
						ticks: { color: colors.tick, font: { size: tickSize, family: 'Inter' } },
						grid: { color: colors.grid }
					},
					y: {
						min: yMin,
						max: yMax,
						ticks: {
							color: colors.tick,
							callback: (v) => v + tUnit,
							font: { size: tickSize, family: 'Inter' }
						},
						grid: { color: colors.grid }
					}
				}
			}
		});
	}

	onMount(() => {
		renderChart();
		window.addEventListener('resize', renderChart);
		return () => window.removeEventListener('resize', renderChart);
	});

	$effect(() => {
		if (daily || $theme || $unitSystem) renderChart();
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

		<div class="custom-scrollbar mb-5 flex gap-2 overflow-x-auto pb-2 sm:grid sm:grid-cols-7 sm:overflow-visible sm:pb-0">
			{#each daily.time as day, i}
				<div class="flex min-w-[64px] shrink-0 flex-col items-center gap-1 rounded-xl px-2 py-3 transition-colors sm:min-w-0 {isToday(day) ? 'bg-accent/10 ring-1 ring-accent/30' : 'bg-bg-card hover:bg-bg-card-hover'}">
					<span class="text-xs font-medium {isToday(day) ? 'text-accent' : 'text-text-muted'}">
						{isToday(day) ? 'Today' : formatDay(day).split(',')[0]}
					</span>
					<span class="text-xl sm:text-2xl"><WeatherIcon code={daily.weather_code[i]} /></span>
					<div class="flex flex-col items-center sm:flex-row sm:gap-1">
						<span class="text-[11px] text-text-secondary sm:text-xs">{convertTemp(daily.temperature_2m_min[i], $unitSystem)}°</span>
						<span class="hidden text-xs text-text-muted sm:inline">/</span>
						<span class="text-[11px] font-semibold text-warm sm:text-xs">{convertTemp(daily.temperature_2m_max[i], $unitSystem)}°</span>
					</div>
				</div>
			{/each}
		</div>

		<div class="h-52 sm:h-72">
			<canvas bind:this={canvas}></canvas>
		</div>
	</div>
{/if}
