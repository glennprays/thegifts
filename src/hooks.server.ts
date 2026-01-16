import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

const supportedLocales = ['en', 'id'];

function getPreferredLocale(cookies: any, headers: Headers): string {
	const cookieLang = cookies.get('lang');
	if (cookieLang && supportedLocales.includes(cookieLang)) {
		return cookieLang;
	}
	const acceptLang = headers.get('accept-language')?.split(',')[0]?.split('-')[0];
	if (acceptLang === 'id') return 'id';
	return 'en';
}

export const handle: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;
	const method = event.request.method;

	// Extract locale from pathname
	const langMatch = pathname.match(/^\/([a-z]{2})(?:\/|$)/);
	const hasLangPrefix = langMatch && supportedLocales.includes(langMatch[1]);

	// Redirect root (only for GET requests)
	if (pathname === '/' && method === 'GET') {
		const lang = getPreferredLocale(event.cookies, event.request.headers);
		throw redirect(302, `/${lang}`);
	}

	// Redirect old URLs without lang prefix (only for GET requests, not API calls)
	const userRoutes = ['/onboarding', '/questionnaire'];
	const needsLocale = userRoutes.some(
		(route) => pathname === route || pathname.startsWith(route + '/')
	);

	if (needsLocale && !hasLangPrefix && method === 'GET') {
		const lang = getPreferredLocale(event.cookies, event.request.headers);
		throw redirect(302, `/${lang}${pathname}`);
	}

	return resolve(event);
};
