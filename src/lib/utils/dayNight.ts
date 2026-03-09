function toHHMM(isoString: string): string {
	return isoString.split('T')[1].substring(0, 5);
}

export function isNightAt(timezone: string, sunrise: string, sunset: string): boolean {
	const now = new Date();
	const current = now.toLocaleTimeString('en-CA', {
		timeZone: timezone,
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	}).substring(0, 5);
	return current < toHHMM(sunrise) || current > toHHMM(sunset);
}

export function isHourNight(
	hourTime: string,
	dailyTimes: string[],
	sunrises: string[],
	sunsets: string[]
): boolean {
	const date = hourTime.split('T')[0];
	const time = hourTime.split('T')[1].substring(0, 5);
	const dayIndex = dailyTimes.indexOf(date);
	if (dayIndex === -1) return false;
	return time < toHHMM(sunrises[dayIndex]) || time > toHHMM(sunsets[dayIndex]);
}
