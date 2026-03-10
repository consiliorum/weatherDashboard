export interface AirQualityResponse {
	current: {
		european_aqi: number;
	};
}

export async function fetchAirQuality(
	latitude: number,
	longitude: number
): Promise<AirQualityResponse> {
	const params = new URLSearchParams({
		latitude: latitude.toString(),
		longitude: longitude.toString(),
		current: 'european_aqi'
	});
	const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`);
	if (!res.ok) throw new Error('Air quality API error');
	return res.json();
}

export function aqiLevel(aqi: number): { label: string; color: string; bg: string } {
	if (aqi <= 20) return { label: 'Good',           color: 'text-sky-400',     bg: 'bg-sky-400'     };
	if (aqi <= 40) return { label: 'Fair',           color: 'text-green-400',   bg: 'bg-green-400'   };
	if (aqi <= 60) return { label: 'Moderate',       color: 'text-amber-400',   bg: 'bg-amber-400'   };
	if (aqi <= 80) return { label: 'Poor',           color: 'text-orange-400',  bg: 'bg-orange-400'  };
	if (aqi <= 100)return { label: 'Very Poor',      color: 'text-red-400',     bg: 'bg-red-400'     };
	return              { label: 'Extremely Poor', color: 'text-indigo-400',  bg: 'bg-indigo-400'  };
}
