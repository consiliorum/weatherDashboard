import type { GeocodingResult } from '$lib/types/weather';

const BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export async function searchLocations(name: string): Promise<GeocodingResult> {
	const params = new URLSearchParams({
		name,
		count: '5',
		language: 'en',
		format: 'json'
	});

	const response = await fetch(`${BASE_URL}?${params}`);
	if (!response.ok) {
		throw new Error(`Geocoding API error: ${response.statusText}`);
	}
	return response.json();
}
