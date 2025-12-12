import type { IConfig, ISitemapField } from "next-sitemap";

const config: IConfig = {
  siteUrl: "https://toyzzbox.com",
  generateRobotsTxt: true,

  sitemapSize: 5000,
  outDir: "./public",

  changefreq: "daily",
  priority: 0.7,

  generateIndexSitemap: true,
  sitemapBaseFileName: "sitemaps/sitemap",

  transform: async (_config: IConfig, path: string): Promise<ISitemapField | null> => {
    // parametreli url'leri atla
    if (path.includes("?")) return null;

    if (path.startsWith("/products/")) {
      return {
        loc: path,
        changefreq: "weekly",
        priority: 1.0,
        // Not: sitemap gruplama için next-sitemap sürümüne göre bu alan desteklenmeyebilir.
        // Desteklenmiyorsa bu satırı kaldır.
        sitemap: "sitemaps/products",
      } as unknown as ISitemapField;
    }

    if (path.startsWith("/categories/")) {
      return {
        loc: path,
        changefreq: "weekly",
        priority: 0.9,
        sitemap: "sitemaps/categories",
      } as unknown as ISitemapField;
    }

    if (path.startsWith("/brands/")) {
      return {
        loc: path,
        changefreq: "monthly",
        priority: 0.8,
        sitemap: "sitemaps/brands",
      } as unknown as ISitemapField;
    }

    return {
      loc: path,
      changefreq: "monthly",
      priority: 0.5,
      sitemap: "sitemaps/contents",
    } as unknown as ISitemapField;
  },
};

export default config;
