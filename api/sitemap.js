const SITE_URL = 'https://meilleuralternantseo.com';
const SUPABASE_URL = 'https://mrfdtszzzdejslqzjtyz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_BN90xXq0TsbgXsTV_I8SdA_7e6q-hhg';

function escapeXml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

module.exports = async (req, res) => {
  let posts = [];
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,updated_at,published_at&status=eq.published&order=published_at.desc`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    if (r.ok) posts = await r.json();
  } catch (e) {
    posts = [];
  }

  const staticUrls = [
    { loc: `${SITE_URL}/`, lastmod: '2026-08-17', changefreq: 'monthly', priority: '1.0' },
    { loc: `${SITE_URL}/blog/index.html`, lastmod: '2026-08-17', changefreq: 'weekly', priority: '0.8' },
  ];

  const postUrls = posts.map((p) => ({
    loc: `${SITE_URL}/blog/post.html?slug=${encodeURIComponent(p.slug)}`,
    lastmod: (p.updated_at || p.published_at || '').slice(0, 10),
    changefreq: 'monthly',
    priority: '0.6',
  }));

  const urls = [...staticUrls, ...postUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).send(xml);
};
