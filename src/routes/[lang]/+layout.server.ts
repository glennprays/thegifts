import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const supportedLocales = ['en', 'id'];

export const load: LayoutServerLoad = ({ params }) => {
	const lang = params.lang;

	if (!supportedLocales.includes(lang)) {
		throw error(404, 'Not found');
	}

	return {
		lang
	};
};
