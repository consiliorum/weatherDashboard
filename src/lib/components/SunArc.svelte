<script lang="ts">
	import { weatherData } from '$lib/stores/weather';

	const W = 200, midY = 25, amp = 12, STEPS = 240;

	function toMins(iso: string): number {
		const [h, m] = iso.split('T')[1].substring(0, 5).split(':').map(Number);
		return h * 60 + m;
	}

	function formatTime(iso: string): string {
		const [h, m] = iso.split('T')[1].substring(0, 5).split(':').map(Number);
		const period = h >= 12 ? 'pm' : 'am';
		return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${period}`;
	}

	function sy(t: number, sr: number, ss: number): number {
		return Math.sin(Math.PI * (t - sr) / (ss - sr));
	}

	let srMins  = $state(360);
	let ssMins  = $state(1200);
	let srLabel = $state('');
	let ssLabel = $state('');
	let nowMins = $state(720);

	$effect(() => {
		const d = $weatherData;
		if (!d?.daily.sunrise[0]) return;
		srMins  = toMins(d.daily.sunrise[0]);
		ssMins  = toMins(d.daily.sunset[0]);
		srLabel = formatTime(d.daily.sunrise[0]);
		ssLabel = formatTime(d.daily.sunset[0]);
		const update = () => {
			const t = new Date().toLocaleTimeString('en-CA', {
				timeZone: d.timezone, hour: '2-digit', minute: '2-digit', hour12: false
			});
			const [h, m] = t.split(':').map(Number);
			nowMins = h * 60 + m;
		};
		update();
		const id = setInterval(update, 60_000);
		return () => clearInterval(id);
	});

	const curvePath = $derived.by(() => {
		let path = '';
		for (let i = 0; i <= STEPS; i++) {
			const t = (i / STEPS) * 1440;
			const x = (t / 1440) * W;
			const y = midY - amp * sy(t, srMins, ssMins);
			path += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
		}
		return path;
	});

	const fillPath = $derived.by(() => {
		const steps = Math.max(2, Math.round(STEPS * (ssMins - srMins) / 1440));
		const xSr = (srMins / 1440) * W;
		const xSs = (ssMins / 1440) * W;
		let path = `M ${xSr.toFixed(1)} ${midY}`;
		for (let i = 1; i <= steps; i++) {
			const t = srMins + (i / steps) * (ssMins - srMins);
			const x = (t / 1440) * W;
			const y = midY - amp * sy(t, srMins, ssMins);
			path += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
		}
		path += ` L ${xSs.toFixed(1)} ${midY} Z`;
		return path;
	});

	const srX   = $derived((srMins / 1440) * W);
	const ssX   = $derived((ssMins / 1440) * W);
	const nowX  = $derived((nowMins / 1440) * W);
	const nowY  = $derived(midY - amp * sy(nowMins, srMins, ssMins));
	const isDay = $derived(nowMins >= srMins && nowMins <= ssMins);
</script>

{#if $weatherData?.daily.sunrise[0]}
	<div class="glass-card flex flex-col p-3 sm:p-4">
		<div class="mb-2 flex items-center gap-2">
			<svg class="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				<path d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
			<h3 class="text-base font-semibold">Sun</h3>
		</div>

		<svg viewBox="0 0 200 50" class="w-full overflow-visible">
			<!-- Horizon -->
			<line x1="0" y1={midY} x2={W} y2={midY}
				stroke="currentColor" stroke-width="0.5" opacity="0.15"/>

			<!-- Sine curve -->
			<path d={curvePath} fill="none" stroke="currentColor"
				stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round" opacity="0.35"/>

			<!-- Current time dot -->
			<circle cx={nowX} cy={nowY} r={isDay ? 3 : 2.5}
				fill={isDay ? '#fbbf24' : '#94a3b8'}/>

			<!-- Time labels at intersections -->
			<text x={srX} y={midY + 12} text-anchor="middle" font-size="7.5"
				fill="currentColor" opacity="0.45">{srLabel}</text>
			<text x={ssX} y={midY + 12} text-anchor="middle" font-size="7.5"
				fill="currentColor" opacity="0.45">{ssLabel}</text>
		</svg>
	</div>
{/if}
