import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

const supportedLocales = ['en', 'id'];

function getPreferredLocale(cookies: { get: (name: string) => string | undefined }, headers: Headers): string {
	const cookieLang = cookies.get('lang');
	if (cookieLang && supportedLocales.includes(cookieLang)) {
		return cookieLang;
	}
	const acceptLang = headers.get('accept-language')?.split(',')[0]?.split('-')[0];
	if (acceptLang === 'id') return 'id';
	return 'en';
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 20;

function isRateLimited(ip: string): boolean {
	const now = Date.now();
	const entry = rateLimitMap.get(ip);
	if (!entry || now > entry.resetAt) {
		rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
		return false;
	}
	entry.count++;
	return entry.count > RATE_LIMIT_MAX;
}

setInterval(() => {
	const now = Date.now();
	for (const [ip, entry] of rateLimitMap) {
		if (now > entry.resetAt) rateLimitMap.delete(ip);
	}
}, 5 * 60_000);

export const handle: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;
	const method = event.request.method;

	// Rate limit expensive endpoints
	if (pathname.startsWith('/api/og-image/') || (pathname === '/questionnaire' && method === 'POST')) {
		const ip = event.getClientAddress();
		if (isRateLimited(ip)) {
			return new Response(JSON.stringify({ error: 'Too many requests' }), {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '60' }
			});
		}
	}

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

	const response = await resolve(event);

	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	response.headers.set(
		'Content-Security-Policy',
		"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'none'"
	);

	return response;
};
