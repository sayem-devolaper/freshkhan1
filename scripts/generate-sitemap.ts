import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://freshkhan.com";

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || "https://fvldqwioiupohruhjhgu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2bGRxd2lvaXVwb2hydWhqaGd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NTAyNTMsImV4cCI6MjA5MDQyNjI1M30.dbUSjfO2MGrTHHogXxAG5q9glgwKls9OqEZhvI0uHPo";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/products", changefreq: "daily", priority: "0.9" },
  { path: "/vendors", changefreq: "daily", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/cart", changefreq: "monthly", priority: "0.5" },
  { path: "/checkout", changefreq: "monthly", priority: "0.5" },
  { path: "/login", changefreq: "monthly", priority: "0.4" },
  { path: "/signup", changefreq: "monthly", priority: "0.4" },
  { path: "/vendor/login", changefreq: "monthly", priority: "0.3" },
  { path: "/vendor/register", changefreq: "monthly", priority: "0.3" },
  { path: "/admin/login", changefreq: "monthly", priority: "0.3" },
];

async function fetchDynamicEntries(): Promise<SitemapEntry[]> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  const entries: SitemapEntry[] = [];

  const [{ data: products }, { data: vendors }] = await Promise.all([
    supabase.from("products").select("id").eq("is_approved", true),
    supabase
      .from("vendors_public")
      .select("id")
      .eq("is_approved", true)
      .eq("is_suspended", false),
  ]);

  for (const product of products || []) {
    entries.push({
      path: `/products/${product.id}`,
      changefreq: "weekly",
      priority: "0.8",
    });
  }

  for (const vendor of vendors || []) {
    entries.push({
      path: `/vendors/${vendor.id}`,
      changefreq: "weekly",
      priority: "0.7",
    });
  }

  return entries;
}

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

async function main() {
  const dynamicEntries = await fetchDynamicEntries();
  const allEntries = [...staticEntries, ...dynamicEntries];
  const xml = generateSitemap(allEntries);
  writeFileSync(resolve("public/sitemap.xml"), xml);
  console.log(`sitemap.xml written with ${allEntries.length} entries`);
}

main().catch((err) => {
  console.error("Failed to generate sitemap:", err);
  process.exit(1);
});
