export const SUPPORTED_LOCALES = ['en', 'id'] as const;
export type Lang = (typeof SUPPORTED_LOCALES)[number];

export function pickLang(
  langCookie: string | undefined,
  acceptLanguage: string | null,
): Lang {
  if (
    langCookie &&
    (SUPPORTED_LOCALES as readonly string[]).includes(langCookie)
  ) {
    return langCookie as Lang;
  }
  const header = acceptLanguage ?? '';
  const preferred = header
    .split(',')
    .map((part) => part.split(';')[0].trim().toLowerCase())
    .find((tag) => SUPPORTED_LOCALES.some((locale) => tag.startsWith(locale)));
  return preferred ? (preferred.slice(0, 2) as Lang) : 'en';
}
