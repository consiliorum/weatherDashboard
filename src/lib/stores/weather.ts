import { writable } from 'svelte/store';
import { fetchWeather } from '$lib/api/weather';
import type { Location, WeatherResponse } from '$lib/types/weather';

export const selectedLocation = writable<Location | null>(null);
export const weatherData = writable<WeatherResponse | null>(null);
export const loading = writable(false);
export const error = writable<string | null>(null);

export async function loadWeather(location: Location) {
	selectedLocation.set(location);
	loading.set(true);
	error.set(null);

	try {
		const data = await fetchWeather(location.latitude, location.longitude);
		weatherData.set(data);
	} catch (e) {
		error.set(e instanceof Error ? e.message : 'Failed to fetch weather');
	} finally {
		loading.set(false);
	}
}
