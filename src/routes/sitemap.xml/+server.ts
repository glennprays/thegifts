import { BASE_URL } from '$lib/constants/constants';

export async function GET() {
	const baseUrl = BASE_URL;

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-en.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-id.xml</loc>
  </sitemap>
</sitemapindex>`;

	return new Response(xml.trim(), {
		headers: { 'Content-Type': 'application/xml' }
	});
}
