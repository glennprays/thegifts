import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { SUPPORTED_LOCALES } from '$lib/server/lang';

export const load: LayoutServerLoad = ({ params, url }) => {
	const lang = params.lang.toLowerCase();

	if (!(SUPPORTED_LOCALES as readonly string[]).includes(lang)) {
		error(404, 'Not found');
	}

	if (lang !== params.lang) {
		redirect(
			301,
			`/${lang}${url.pathname.slice(params.lang.length + 1)}${url.search}`,
		);
	}

	return {
		lang
	};
};
