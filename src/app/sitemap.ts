import type { MetadataRoute } from "next";

import { site } from "@/lib/site";
import { findPublishedProductSlugs } from "@/server/repositories/product.repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/policies/shipping`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/policies/returns`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/policies/warranty`, changeFrequency: "yearly", priority: 0.4 },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await findPublishedProductSlugs();
    productRoutes = products.map((product) => ({
      url: `${site.url}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    // Nếu database chưa sẵn sàng, vẫn trả về sitemap cho các trang tĩnh.
  }

  return [...staticRoutes, ...productRoutes];
}
