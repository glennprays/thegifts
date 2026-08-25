import { Resvg } from '@resvg/resvg-wasm';
import { initResvg } from '$lib/server/resvg';
import { GIFT_MARK_PATHS, sparkleSvgDocument } from '$lib/data/gift-mark-paths';
import type { GlyphName } from '$lib/data/gift-colors';

const cache = new Map<string, string>();

/**
 * Render a glyph SVG string to PNG bytes.
 */
async function renderSvgToPng(svg: string, size: number): Promise<Uint8Array> {
	await initResvg();
	const resvg = new Resvg(svg, {
		fitTo: { mode: 'width', value: size },
		background: 'rgba(0,0,0,0)'
	});
	const png = resvg.render().asPng();
	resvg.free();
	return png;
}

/**
 * Rasterize a gift glyph to a PNG data URI that satori can embed.
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

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">${GIFT_MARK_PATHS[glyph](color)}</svg>`;
	const png = await renderSvgToPng(svg, size);

	const uri = `data:image/png;base64,${Buffer.from(png).toString('base64')}`;
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

	const png = await renderSvgToPng(sparkleSvgDocument(color), size);

	const uri = `data:image/png;base64,${Buffer.from(png).toString('base64')}`;
	cache.set(key, uri);
	return uri;
}

/**
 * Rasterize an arbitrary SVG string to a PNG data URI (e.g. QR codes).
 */
export async function svgStringDataUri(svg: string, size: number): Promise<string> {
	const png = await renderSvgToPng(svg, size);
	return `data:image/png;base64,${Buffer.from(png).toString('base64')}`;
}
