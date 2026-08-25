import type { GlyphName } from "./gift-colors";

/**
 * Shared illustration artwork for the 16 gift glyphs.
 * Each entry returns the inner SVG elements (viewBox 0 0 64 64) for a given
 * accent color. Used by GiftMark.svelte (client) and the OG image generator
 * (server) so both stay visually identical.
 */
export const GIFT_MARK_PATHS: Record<GlyphName, (color: string) => string> = {
  star: (color) => `
    <path d="M32 8 L38.5 24.5 L56 25.5 L42.5 36.5 L47.5 53.5 L32 44 L16.5 53.5 L21.5 36.5 L8 25.5 L25.5 24.5 Z" fill="${color}" stroke="#1b1b1b" stroke-width="3" stroke-linejoin="round"/>`,
  eye: (color) => `
    <path d="M6 32 C14 18 24 12 32 12 C40 12 50 18 58 32 C50 46 40 52 32 52 C24 52 14 46 6 32 Z" fill="#ffffff" stroke="#1b1b1b" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="32" cy="32" r="9" fill="${color}" stroke="#1b1b1b" stroke-width="3"/>
    <circle cx="35" cy="29" r="2.5" fill="#ffffff"/>`,
  speech: (color) => `
    <path d="M10 14 C10 10.5 12.5 8 16 8 L48 8 C51.5 8 54 10.5 54 14 L54 38 C54 41.5 51.5 44 48 44 L28 44 L16 56 L17 44 C13 44 10 41.5 10 38 Z" fill="${color}" stroke="#1b1b1b" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="24" cy="26" r="2.6" fill="#ffffff"/>
    <circle cx="32" cy="26" r="2.6" fill="#ffffff"/>
    <circle cx="40" cy="26" r="2.6" fill="#ffffff"/>`,
  flame: (color) => `
    <path d="M32 6 C36 14 46 20 46 34 C46 45 40 52 32 52 C24 52 18 45 18 34 C18 26 22 22 24 16 C26 20 28 21 30 20 C28 15 29 10 32 6 Z" fill="${color}" stroke="#1b1b1b" stroke-width="3" stroke-linejoin="round"/>
    <path d="M32 34 C35 37 36 39 36 42 C36 46 34 48 32 48 C30 48 28 46 28 42 C28 39 30 37 32 34 Z" fill="#ffffff" stroke="#1b1b1b" stroke-width="2.5" stroke-linejoin="round"/>`,
  dove: (color) => `
    <path d="M12 34 C18 28 26 26 32 28 C33 22 38 16 46 14 C44 18 44 21 45 24 C49 25 53 27 56 30 C50 32 47 33 45 36 C42 46 32 52 20 50 C24 46 25 43 24 40 C19 40 15 38 12 34 Z" fill="#ffffff" stroke="#1b1b1b" stroke-width="3" stroke-linejoin="round"/>
    <path d="M32 28 C36 30 39 33 40 37 C36 36 33 34 32 31 Z" fill="${color}" stroke="#1b1b1b" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="44" cy="20" r="1.6" fill="#1b1b1b"/>`,
  gift: (color) => `
    <rect x="12" y="24" width="40" height="32" rx="4" fill="${color}" stroke="#1b1b1b" stroke-width="3"/>
    <rect x="8" y="14" width="48" height="12" rx="4" fill="${color}" stroke="#1b1b1b" stroke-width="3"/>
    <line x1="32" y1="14" x2="32" y2="56" stroke="#1b1b1b" stroke-width="3"/>
    <path d="M32 14 C26 14 22 11 22 7 C27 7 31 9 32 14 Z" fill="#ffffff" stroke="#1b1b1b" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M32 14 C38 14 42 11 42 7 C37 7 33 9 32 14 Z" fill="#ffffff" stroke="#1b1b1b" stroke-width="2.5" stroke-linejoin="round"/>`,
  hands: (color) => `
    <path d="M8 30 C12 26 16 26 19 29 L26 36 C27 37 27 39 26 40 C25 41 23 41 22 40 L18 36" stroke="#1b1b1b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M18 36 L30 48 C33 51 38 51 41 48 L52 37 C55 34 55 30 52 27 C49 24 45 24 42 27 L38 31" fill="${color}" stroke="#1b1b1b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M46 30 C43 27 39 27 36 30 L30 36" stroke="#1b1b1b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
  sun: (color) => `
    <circle cx="32" cy="32" r="12" fill="${color}" stroke="#1b1b1b" stroke-width="3"/>
    <g stroke="#1b1b1b" stroke-width="3" stroke-linecap="round">
      <line x1="32" y1="6" x2="32" y2="13"/>
      <line x1="32" y1="51" x2="32" y2="58"/>
      <line x1="6" y1="32" x2="13" y2="32"/>
      <line x1="51" y1="32" x2="58" y2="32"/>
      <line x1="13.6" y1="13.6" x2="18.5" y2="18.5"/>
      <line x1="45.5" y1="45.5" x2="50.4" y2="50.4"/>
      <line x1="13.6" y1="50.4" x2="18.5" y2="45.5"/>
      <line x1="45.5" y1="18.5" x2="50.4" y2="13.6"/>
    </g>`,
  house: (color) => `
    <path d="M10 30 L32 10 L54 30" stroke="#1b1b1b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 28 L16 52 C16 54 17.5 56 20 56 L44 56 C46.5 56 48 54 48 52 L48 28 Z" fill="${color}" stroke="#1b1b1b" stroke-width="3" stroke-linejoin="round"/>
    <rect x="27" y="40" width="10" height="16" rx="2" fill="#ffffff" stroke="#1b1b1b" stroke-width="2.5"/>`,
  pray: (color) => `
    <path d="M26 10 C22 14 20 20 20 26 L20 38 C20 42 22 45 25 47 L28 49 L28 56" fill="${color}" stroke="#1b1b1b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M38 10 C42 14 44 20 44 26 L44 38 C44 42 42 45 39 47 L36 49 L36 56" fill="${color}" stroke="#1b1b1b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M26 10 C28 20 30 26 32 30 C34 26 36 20 38 10" fill="#ffffff" stroke="#1b1b1b" stroke-width="3" stroke-linejoin="round"/>`,
  book: (color) => `
    <path d="M32 16 C26 11 17 10 8 12 L8 50 C17 48 26 49 32 54 C38 49 47 48 56 50 L56 12 C47 10 38 11 32 16 Z" fill="#ffffff" stroke="#1b1b1b" stroke-width="3" stroke-linejoin="round"/>
    <line x1="32" y1="16" x2="32" y2="54" stroke="#1b1b1b" stroke-width="3"/>
    <path d="M14 22 C20 21 25 22 28 24" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
    <path d="M14 32 C20 31 25 32 28 34" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
    <path d="M36 24 C39 22 44 21 50 22" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
    <path d="M36 34 C39 32 44 31 50 32" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`,
  crown: (color) => `
    <path d="M10 44 L8 18 L22 30 L32 12 L42 30 L56 18 L54 44 C40 49 24 49 10 44 Z" fill="${color}" stroke="#1b1b1b" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="32" cy="40" r="2.6" fill="#ffffff"/>
    <circle cx="20" cy="40" r="2.6" fill="#ffffff"/>
    <circle cx="44" cy="40" r="2.6" fill="#ffffff"/>`,
  heart: (color) => `
    <path d="M32 52 C18 42 8 33 8 22 C8 14 14 9 21 9 C26 9 30 12 32 16 C34 12 38 9 43 9 C50 9 56 14 56 22 C56 33 46 42 32 52 Z" fill="${color}" stroke="#1b1b1b" stroke-width="3" stroke-linejoin="round"/>`,
  footprints: (color) => `
    <ellipse cx="22" cy="20" rx="8" ry="11" transform="rotate(-12 22 20)" fill="${color}" stroke="#1b1b1b" stroke-width="3"/>
    <ellipse cx="20" cy="38" rx="4.5" ry="6" transform="rotate(-12 20 38)" fill="${color}" stroke="#1b1b1b" stroke-width="3"/>
    <ellipse cx="42" cy="34" rx="8" ry="11" transform="rotate(-12 42 34)" fill="#ffffff" stroke="#1b1b1b" stroke-width="3"/>
    <ellipse cx="40" cy="52" rx="4.5" ry="6" transform="rotate(-12 40 52)" fill="#ffffff" stroke="#1b1b1b" stroke-width="3"/>`,
  plant: (color) => `
    <path d="M32 56 L32 26" stroke="#1b1b1b" stroke-width="3" stroke-linecap="round"/>
    <path d="M32 34 C32 24 24 18 13 18 C13 28 21 34 32 34 Z" fill="${color}" stroke="#1b1b1b" stroke-width="3" stroke-linejoin="round"/>
    <path d="M32 26 C32 17 39 11 49 11 C49 20 42 26 32 26 Z" fill="#ffffff" stroke="#1b1b1b" stroke-width="3" stroke-linejoin="round"/>
    <path d="M20 56 C24 52 40 52 44 56" stroke="#1b1b1b" stroke-width="3" stroke-linecap="round"/>`,
  lamp: (color) => `
    <path d="M14 48 L50 48 L46 40 C40 43 24 43 18 40 Z" fill="${color}" stroke="#1b1b1b" stroke-width="3" stroke-linejoin="round"/>
    <path d="M32 40 L32 34" stroke="#1b1b1b" stroke-width="3" stroke-linecap="round"/>
    <path d="M32 8 C35 13 39 16 39 22 C39 27 36 30 32 30 C28 30 25 27 25 22 C25 16 29 13 32 8 Z" fill="#ffecc7" stroke="#1b1b1b" stroke-width="3" stroke-linejoin="round"/>`,
};

/**
 * Small four-point sparkle used as decorative accent.
 */
export function sparkleSvg(color: string): string {
  return `
    <path d="M32 8 L39 25 L56 32 L39 39 L32 56 L25 39 L8 32 L25 25 Z" fill="${color}" stroke="#1b1b1b" stroke-width="3" stroke-linejoin="round"/>`;
}

/**
 * Full standalone SVG document string for a glyph (used for rasterization).
 */
export function giftMarkSvg(glyph: GlyphName, color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">${GIFT_MARK_PATHS[glyph](color)}</svg>`;
}

export function sparkleSvgDocument(color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">${sparkleSvg(color)}</svg>`;
}
