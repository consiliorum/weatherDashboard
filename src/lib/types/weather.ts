export interface Location {
	name: string;
	latitude: number;
	longitude: number;
	country?: string;
	admin1?: string;
}

export interface CurrentWeather {
	temperature_2m: number;
	relative_humidity_2m: number;
	apparent_temperature: number;
	weather_code: number;
	wind_speed_10m: number;
	uv_index: number;
}

export interface DailyForecast {
	time: string[];
	weather_code: number[];
	temperature_2m_max: number[];
	temperature_2m_min: number[];
	precipitation_probability_max: number[];
}

export interface HourlyForecast {
	time: string[];
	temperature_2m: number[];
	weather_code: number[];
}

export interface WeatherResponse {
	current: CurrentWeather;
	daily: DailyForecast;
	hourly: HourlyForecast;
	latitude: number;
	longitude: number;
	timezone: string;
}

export interface GeocodingResult {
	results?: Location[];
}

export interface WeatherState {
	location: Location | null;
	weather: WeatherResponse | null;
	loading: boolean;
	error: string | null;
}
