import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const supportedLocales = ['en', 'id'];

export const GET: RequestHandler = ({ request }) => {
	const header = request.headers.get('accept-language') ?? '';
	const preferred = header
		.split(',')
		.map((part) => part.split(';')[0].trim().toLowerCase())
		.find((tag) => supportedLocales.some((locale) => tag.startsWith(locale)));
	const lang = preferred ? (preferred.slice(0, 2) as 'en' | 'id') : 'en';

	redirect(302, `/${lang}`);
};
