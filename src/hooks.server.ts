import './lib/server/wasm-instantiate-shim';
import { redirect } from '@sveltejs/kit';
import { pickLang } from '$lib/server/lang';

const LEGACY_PATH = /^\/(questionnaire|onboarding)(\/|$)/;

/** Redirect legacy pre-i18n URLs (GET only) to lang-prefixed equivalents. */
export const handle = ({ event, resolve }) => {
  if (event.request.method === 'GET' && LEGACY_PATH.test(event.url.pathname)) {
    const lang = pickLang(
      event.cookies.get('lang'),
      event.request.headers.get('accept-language'),
    );
    redirect(302, `/${lang}${event.url.pathname}${event.url.search}`);
  }
  return resolve(event);
};
