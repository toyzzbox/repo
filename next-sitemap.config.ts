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

  transform: async (
    _config: IConfig,
    url: string
  ): Promise<ISitemapField | undefined> => {
    // parametreli url'leri atla
    if (url.includes("?")) return undefined;

    // Ürünler
    if (url.startsWith("/products/")) {
      return {
        loc: url,
        changefreq: "weekly",
        priority: 1.0,
      };
    }

    // Kategoriler
    if (url.startsWith("/categories/")) {
      return {
        loc: url,
        changefreq: "weekly",
        priority: 0.9,
      };
    }

    // Markalar
    if (url.startsWith("/brands/")) {
      return {
        loc: url,
        changefreq: "monthly",
        priority: 0.8,
      };
    }

    // Diğerleri
    return {
      loc: url,
      changefreq: "monthly",
      priority: 0.5,
    };
  },
};

export default config;
