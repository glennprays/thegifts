import { BASE_URL } from '$lib/constants/constants';

export async function GET() {
	const baseUrl = BASE_URL;
	const lastmod = new Date().toISOString().split('T')[0];

	const urls = [
		{ loc: `${baseUrl}/id`, priority: '1.00' },
		{ loc: `${baseUrl}/id/onboarding`, priority: '0.80' },
		{ loc: `${baseUrl}/id/questionnaire`, priority: '0.80' }
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml.trim(), {
		headers: { 'Content-Type': 'application/xml' }
	});
}
