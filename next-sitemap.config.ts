/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://toyzzbox.com", // ❗ kendi domainin
  generateRobotsTxt: true,

  sitemapSize: 5000,
  outDir: "./public",

  changefreq: "daily",
  priority: 0.7,

  generateIndexSitemap: true,

  // 🗂 sitemap'leri /sitemaps/ altında üret
  sitemapBaseFileName: "sitemaps/sitemap",

  transform: async (config, path) => {
    // ❗ SEO: parametreli / boş path'leri atla
    if (path.includes("?")) return null;

    // 🧸 Ürünler
    if (path.startsWith("/products/")) {
      return {
        loc: path,
        changefreq: "weekly",
        priority: 1.0,
        sitemap: "sitemaps/products",
      };
    }

    // 📦 Kategoriler
    if (path.startsWith("/categories/")) {
      return {
        loc: path,
        changefreq: "weekly",
        priority: 0.9,
        sitemap: "sitemaps/categories",
      };
    }

    // 🏷 Markalar
    if (path.startsWith("/brands/")) {
      return {
        loc: path,
        changefreq: "monthly",
        priority: 0.8,
        sitemap: "sitemaps/brands",
      };
    }

    // 📄 Diğer sayfalar (home, help, static vb.)
    return {
      loc: path,
      changefreq: "monthly",
      priority: 0.5,
      sitemap: "sitemaps/contents",
    };
  },
};
