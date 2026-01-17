// src/lib/i18n.ts
import { init, register } from 'svelte-i18n';

register('en', () => import('./locales/en.json'));
register('id', () => import('./locales/id.json'));

export function initI18n(locale: string) {
	init({
		fallbackLocale: 'en',
		initialLocale: locale
	});
}
