<script lang="ts">
	import { searchLocations } from '$lib/api/geocoding';
	import { loadWeather } from '$lib/stores/weather';
	import type { Location } from '$lib/types/weather';

	let query = $state('');
	let results = $state<Location[]>([]);
	let showDropdown = $state(false);
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
		setTimeout(() => (showDropdown = false), 200);
	}
</script>

<div class="relative w-full max-w-md">
	<input
		type="text"
		bind:value={query}
		oninput={handleInput}
		onblur={handleBlur}
		onfocus={() => results.length > 0 && (showDropdown = true)}
		placeholder="Search for a city..."
		class="w-full rounded-lg bg-bg-secondary px-4 py-3 text-text-primary placeholder-text-secondary outline-none ring-1 ring-bg-card focus:ring-accent"
	/>
	{#if showDropdown}
		<ul class="absolute z-50 mt-1 w-full rounded-lg bg-bg-secondary shadow-lg ring-1 ring-bg-card">
			{#each results as location}
				<li>
					<button
						type="button"
						class="w-full px-4 py-2 text-left text-text-primary hover:bg-bg-card"
						onmousedown={() => selectLocation(location)}
					>
						{location.name}{location.admin1 ? ', ' + location.admin1 : ''}{location.country ? ', ' + location.country : ''}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
