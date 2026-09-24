import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pickLang } from '$lib/server/lang';

export const GET: RequestHandler = ({ request, cookies }) => {
  redirect(
    302,
    `/${pickLang(cookies.get('lang'), request.headers.get('accept-language'))}`,
  );
};
