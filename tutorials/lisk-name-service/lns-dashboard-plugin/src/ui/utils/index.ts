import { AppConfig } from '../types';

export const getAppConfig = async (): Promise<AppConfig> => {
	if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
		return {
			applicationUrl: 'ws://localhost:5001/ws',
		};
	}

	const res = await fetch('/api/config.json');
	const config = ((await res.json()) as unknown) as AppConfig;
	return config;
};

export const normalizeName = (name: string): string => {
	if (name.endsWith('.lsk')) {
		return name.toLowerCase();
	}

	return `${name}.lsk`.toLowerCase();
};

export const toLocalTime = (timestamp: number): string =>
	new Date(timestamp * 1000).toLocaleString();
