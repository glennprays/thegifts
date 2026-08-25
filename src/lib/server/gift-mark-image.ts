import sharp from 'sharp';
import { giftMarkSvg, sparkleSvgDocument } from '$lib/data/gift-mark-paths';
import type { GlyphName } from '$lib/data/gift-colors';

const cache = new Map<string, string>();

/**
 * Rasterize a gift glyph SVG to a PNG data URI that satori can embed.
 * Results are cached per glyph+color+size.
 */
export async function giftMarkDataUri(
  glyph: GlyphName,
  color: string,
  size: number
): Promise<string> {
  const key = `mark:${glyph}:${color}:${size}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const svg = Buffer.from(giftMarkSvg(glyph, color));
  const png = await sharp(svg, { density: 300 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const uri = `data:image/png;base64,${png.toString('base64')}`;
  cache.set(key, uri);
  return uri;
}

/**
 * Rasterize the decorative sparkle to a PNG data URI.
 */
export async function sparkleDataUri(color: string, size: number): Promise<string> {
  const key = `sparkle:${color}:${size}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const svg = Buffer.from(sparkleSvgDocument(color));
  const png = await sharp(svg, { density: 300 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const uri = `data:image/png;base64,${png.toString('base64')}`;
  cache.set(key, uri);
  return uri;
}
