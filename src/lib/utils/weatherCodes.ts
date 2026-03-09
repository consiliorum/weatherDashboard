interface WeatherCodeInfo {
	description: string;
	icon: string;
	nightIcon?: string;
}

const weatherCodes: Record<number, WeatherCodeInfo> = {
	0:  { description: 'Clear sky',                       icon: '☀️',  nightIcon: '🌙' },
	1:  { description: 'Mainly clear',                    icon: '🌤️', nightIcon: '🌙' },
	2:  { description: 'Partly cloudy',                   icon: '⛅',  nightIcon: '🌙' },
	3:  { description: 'Overcast',                        icon: '☁️' },
	45: { description: 'Fog',                             icon: '🌫️' },
	48: { description: 'Depositing rime fog',             icon: '🌫️' },
	51: { description: 'Light drizzle',                   icon: '🌦️', nightIcon: '🌧️' },
	53: { description: 'Moderate drizzle',                icon: '🌦️', nightIcon: '🌧️' },
	55: { description: 'Dense drizzle',                   icon: '🌧️' },
	56: { description: 'Light freezing drizzle',          icon: '🌧️' },
	57: { description: 'Dense freezing drizzle',          icon: '🌧️' },
	61: { description: 'Slight rain',                     icon: '🌧️' },
	63: { description: 'Moderate rain',                   icon: '🌧️' },
	65: { description: 'Heavy rain',                      icon: '🌧️' },
	66: { description: 'Light freezing rain',             icon: '🌧️' },
	67: { description: 'Heavy freezing rain',             icon: '🌧️' },
	71: { description: 'Slight snowfall',                 icon: '🌨️' },
	73: { description: 'Moderate snowfall',               icon: '🌨️' },
	75: { description: 'Heavy snowfall',                  icon: '❄️' },
	77: { description: 'Snow grains',                     icon: '❄️' },
	80: { description: 'Slight rain showers',             icon: '🌦️', nightIcon: '🌧️' },
	81: { description: 'Moderate rain showers',           icon: '🌧️' },
	82: { description: 'Violent rain showers',            icon: '🌧️' },
	85: { description: 'Slight snow showers',             icon: '🌨️' },
	86: { description: 'Heavy snow showers',              icon: '❄️' },
	95: { description: 'Thunderstorm',                    icon: '⛈️' },
	96: { description: 'Thunderstorm with slight hail',   icon: '⛈️' },
	99: { description: 'Thunderstorm with heavy hail',    icon: '⛈️' }
};

export function getWeatherInfo(code: number, isNight = false): WeatherCodeInfo {
	const info = weatherCodes[code] ?? { description: 'Unknown', icon: '❓' };
	if (isNight && info.nightIcon) return { ...info, icon: info.nightIcon };
	return info;
}
