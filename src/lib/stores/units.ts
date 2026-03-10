import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type UnitSystem = 'metric' | 'imperial';

function getInitial(): UnitSystem {
	if (browser) {
		const saved = localStorage.getItem('units');
		if (saved === 'metric' || saved === 'imperial') return saved;
	}
	return 'metric';
}

export const unitSystem = writable<UnitSystem>(getInitial());

if (browser) {
	unitSystem.subscribe((u) => localStorage.setItem('units', u));
}

export function toggleUnits(): void {
	unitSystem.update((u) => (u === 'metric' ? 'imperial' : 'metric'));
}

export function convertTemp(celsius: number, system: UnitSystem): number {
	return system === 'imperial' ? Math.round(celsius * 9 / 5 + 32) : Math.round(celsius);
}

export function tempUnit(system: UnitSystem): string {
	return system === 'imperial' ? '°F' : '°C';
}

export function convertSpeed(kmh: number, system: UnitSystem): number {
	return system === 'imperial' ? Math.round(kmh * 0.621371) : Math.round(kmh);
}

export function speedUnit(system: UnitSystem): string {
	return system === 'imperial' ? 'mph' : 'km/h';
}

export function convertPrecip(mm: number, system: UnitSystem): string {
	if (system === 'imperial') return (mm / 25.4).toFixed(2) + ' in';
	return mm.toFixed(1) + ' mm';
}
