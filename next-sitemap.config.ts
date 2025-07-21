/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://www.senin-domainin.com',
    generateRobotsTxt: true,
    sitemapSize: 5000,
    outDir: './public',
    changefreq: 'daily',
    priority: 0.7,
    generateIndexSitemap: true, // 📌 otomatik sitemap index dosyası
    sitemapBaseFileName: 'sitemaps/sitemap', // alt dizin içinde tut
    // Alt sitemapleri ayırmak için:
    transform: async (config, path) => {
      if (path.startsWith('/products/')) {
        return {
          loc: path,
          changefreq: 'weekly',
          priority: 1.0,
          sitemap: 'sitemaps/products',
        };
      }
  
      if (path.startsWith('/categories/')) {
        return {
          loc: path,
          changefreq: 'weekly',
          priority: 0.9,
          sitemap: 'sitemaps/categories',
        };
      }
  
      if (path.startsWith('/brands/')) {
        return {
          loc: path,
          changefreq: 'monthly',
          priority: 0.8,
          sitemap: 'sitemaps/brands',
        };
      }
  
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.5,
        sitemap: 'sitemaps/contents', // Diğer her şey
      };
    },
  };
  