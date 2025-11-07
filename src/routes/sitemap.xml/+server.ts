export async function GET() {
  return new Response(
    `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<url>
<loc>https://thegifts.site/</loc>
<lastmod>2025-11-07T12:52:48+00:00</lastmod>
<priority>1.00</priority>
</url>
<url>
<loc>https://thegifts.site/onboarding</loc>
<lastmod>2025-11-07T12:52:48+00:00</lastmod>
<priority>0.80</priority>
</url>
</urlset>
`.trim(),
    {
      headers: {
        'Content-Type': 'application/xml'
      }
    }
  )
}
