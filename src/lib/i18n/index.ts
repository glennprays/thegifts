// src/lib/i18n.ts
import { browser } from '$app/environment'
import { init, register } from 'svelte-i18n'

const defaultLocale = 'en'

register('en', () => import('./locales/en.json'))
register('id', () => import('./locales/id.json'))

init({
  fallbackLocale: defaultLocale,
  initialLocale: browser
    ? window.navigator.language.split('-')[0] // Normalize to 'en' or 'id'
    : defaultLocale,
})
