<script lang="ts">
	import { selectedLocation } from '$lib/stores/weather';
	import { fetchAirQuality, aqiLevel } from '$lib/api/airQuality';

	let aqi    = $state<number | null>(null);
	let loading = $state(false);
	let error  = $state(false);

	$effect(() => {
		const loc = $selectedLocation;
		if (!loc) return;
		loading = true;
		error = false;
		aqi = null;
		fetchAirQuality(loc.latitude, loc.longitude)
			.then((d) => { aqi = d.current.european_aqi; })
			.catch(() => { error = true; })
			.finally(() => { loading = false; });
	});

	const level = $derived(aqi !== null ? aqiLevel(aqi) : null);
	const barPct = $derived(aqi !== null ? Math.min(100, (aqi / 150) * 100) : 0);
</script>

<div class="glass-card flex flex-col p-3 sm:p-4">
	<div class="flex items-center gap-2">
		<svg class="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
			<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9S16.97 3 12 3Zm0 0c0 4.97-4.03 9-9 9m9-9c0 4.97 4.03 9 9 9" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		<h3 class="text-base font-semibold">Air Quality</h3>
		{#if level}
			<span class="ml-auto text-sm font-semibold {level.color}">{aqi} <span class="text-xs font-normal text-text-muted">{level.label}</span></span>
		{:else}
			<span class="ml-auto text-xs text-text-muted">EU AQI</span>
		{/if}
	</div>

	<div class="flex flex-1 items-center">
		{#if loading}
			<div class="flex w-full justify-center">
				<div class="h-5 w-5 animate-spin rounded-full border-2 border-accent/30 border-t-accent"></div>
			</div>
		{:else if error || aqi === null}
			<p class="w-full text-center text-xs text-text-muted">Unavailable</p>
		{:else}
			<div class="w-full">
				<div class="relative h-1.5 overflow-visible rounded-full"
					style="background:linear-gradient(to right,#38bdf8,#4ade80,#fbbf24,#fb923c,#f87171,#818cf8)">
					<div class="absolute top-1/2 h-3 w-1 -translate-y-1/2 rounded-full bg-white shadow"
						style="left:calc({barPct}% - 1px)">
					</div>
				</div>
				<div class="mt-1 flex justify-between text-[9px] text-text-muted">
					<span>Good</span>
					<span>Extremely Poor</span>
				</div>
			</div>
		{/if}
	</div>
</div>
