import type { WeatherResponse } from '$lib/types/weather';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeather(latitude: number, longitude: number): Promise<WeatherResponse> {
	const params = new URLSearchParams({
		latitude: latitude.toString(),
		longitude: longitude.toString(),
		current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index',
		daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
		hourly: 'temperature_2m,weather_code',
		timezone: 'auto',
		forecast_days: '7'
	});

	const response = await fetch(`${BASE_URL}?${params}`);
	if (!response.ok) {
		throw new Error(`Weather API error: ${response.statusText}`);
	}
	return response.json();
}
