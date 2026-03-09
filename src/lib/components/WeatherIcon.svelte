<script lang="ts">
	import { getWeatherInfo } from '$lib/utils/weatherCodes';
	import { theme } from '$lib/stores/theme';

	let { code, isNight = false, class: className = '' }: { code: number; isNight?: boolean; class?: string } = $props();

	const moonCodes = [0, 1, 2];
	const isMoon = $derived(isNight && moonCodes.includes(code));
	const info = $derived(getWeatherInfo(code, isNight));
	const moonColor = $derived($theme === 'dark' ? '#f8fafc' : '#3730a3');
	const moonGlow = $derived($theme === 'dark'
		? 'drop-shadow(0 0 6px rgba(148, 163, 184, 0.6))'
		: 'drop-shadow(0 0 5px rgba(55, 48, 163, 0.4))');
</script>

{#if isMoon}
	<svg
		class={className}
		style="width:1em;height:1em;vertical-align:-0.125em;display:inline-block;filter:{moonGlow}"
		viewBox="0 0 24 24"
		fill={moonColor}
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
	</svg>
{:else}
	<span style="font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">{info.icon}</span>
{/if}
