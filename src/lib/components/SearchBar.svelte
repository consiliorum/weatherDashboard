<script lang="ts">
	import { searchLocations } from '$lib/api/geocoding';
	import { loadWeather } from '$lib/stores/weather';
	import type { Location } from '$lib/types/weather';

	let query = $state('');
	let results = $state<Location[]>([]);
	let showDropdown = $state(false);
	let isFocused = $state(false);
	let debounceTimer: ReturnType<typeof setTimeout>;

	function handleInput() {
		clearTimeout(debounceTimer);
		if (query.length < 2) {
			results = [];
			showDropdown = false;
			return;
		}
		debounceTimer = setTimeout(async () => {
			try {
				const data = await searchLocations(query);
				results = data.results ?? [];
				showDropdown = results.length > 0;
			} catch {
				results = [];
			}
		}, 300);
	}

	function selectLocation(location: Location) {
		query = `${location.name}${location.admin1 ? ', ' + location.admin1 : ''}${location.country ? ', ' + location.country : ''}`;
		showDropdown = false;
		results = [];
		loadWeather(location);
	}

	function handleBlur() {
		setTimeout(() => {
			showDropdown = false;
			isFocused = false;
		}, 200);
	}
</script>

<div class="relative w-full max-w-sm">
	<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
		<svg class="h-4 w-4 transition-colors {isFocused ? 'text-accent' : 'text-text-muted'}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.35-4.35" stroke-linecap="round" />
		</svg>
	</div>
	<input
		type="text"
		bind:value={query}
		oninput={handleInput}
		onblur={handleBlur}
		onfocus={() => { isFocused = true; results.length > 0 && (showDropdown = true); }}
		placeholder="Search for a city..."
		class="w-full rounded-xl border border-glass-border bg-bg-secondary py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted backdrop-blur-xl outline-none transition-all duration-300 focus:border-accent/40 focus:shadow-[0_0_20px_rgba(56,189,248,0.08)]"
	/>
	{#if showDropdown}
		<ul class="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-glass-border bg-bg-secondary shadow-2xl backdrop-blur-xl">
			{#each results as location, i}
				<li>
					<button
						type="button"
						class="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-bg-card"
						onmousedown={() => selectLocation(location)}
					>
						<svg class="h-4 w-4 shrink-0 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
							<path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
							<path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
						</svg>
						<span>
							<span class="font-medium text-text-primary">{location.name}</span>
							{#if location.admin1 || location.country}
								<span class="text-text-secondary">
									{location.admin1 ? ', ' + location.admin1 : ''}{location.country ? ', ' + location.country : ''}
								</span>
							{/if}
						</span>
					</button>
				</li>
				{#if i < results.length - 1}
					<li class="mx-4 border-t border-glass-border"></li>
				{/if}
			{/each}
		</ul>
	{/if}
</div>
