import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
const robots = await readFile(new URL("../dist/robots.txt", import.meta.url), "utf8").catch(() => "");
const sitemap = await readFile(new URL("../dist/sitemap.xml", import.meta.url), "utf8").catch(() => "");
const llms = await readFile(new URL("../dist/llms.txt", import.meta.url), "utf8").catch(() => "");
const memberUrl = "https://gatherwell-demo.vercel.app/member-login";
const pastorUrl = "https://gatherwell-demo.vercel.app/pastor-login";
const canonicalUrl = "https://gatherwell-landing.vercel.app/";

function metaContent(attribute, value) {
  const tag = html.match(new RegExp(`<meta\\s+[^>]*${attribute}=["']${value}["'][^>]*>`, "i"))?.[0];
  return tag?.match(/content=["']([^"']+)["']/i)?.[1];
}

function jsonLd() {
  return [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]));
}

test("all landing demo links use the green GatherWell deployment", () => {
  assert.equal((html.match(new RegExp(memberUrl, "g")) ?? []).length, 3);
  assert.equal((html.match(new RegExp(pastorUrl, "g")) ?? []).length, 2);
  assert.doesNotMatch(html, /gatherwell-community-refined\.varun-israni-2063303\.chatgpt\.site/);
  assert.doesNotMatch(html, /https:\/\/gatherwell\.vercel\.app/);
});

test("homepage publishes canonical search and social metadata", () => {
  assert.match(html, /<title>GatherWell \| Church Community Workspace<\/title>/);
  assert.equal(
    metaContent("name", "description"),
    "Explore GatherWell, a church community workspace demo for groups, gatherings, communication, prayer, and care. No sign-up required.",
  );
  assert.match(html, new RegExp(`<link\\s+rel=["']canonical["']\\s+href=["']${canonicalUrl}["']`));
  assert.equal(metaContent("name", "robots"), "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  assert.equal(metaContent("property", "og:type"), "website");
  assert.equal(metaContent("property", "og:locale"), "en_US");
  assert.equal(metaContent("property", "og:site_name"), "GatherWell");
  assert.equal(metaContent("property", "og:url"), canonicalUrl);
  assert.equal(metaContent("property", "og:title"), "GatherWell | Church Community Workspace");
  assert.equal(metaContent("property", "og:image"), `${canonicalUrl}assets/community-dinner.webp`);
  assert.equal(metaContent("property", "og:image:width"), "1200");
  assert.equal(metaContent("property", "og:image:height"), "800");
  assert.equal(metaContent("property", "og:image:alt"), "Neighbors sharing dinner around a community table");
  assert.equal(metaContent("name", "twitter:card"), "summary_large_image");
  assert.equal(metaContent("name", "twitter:title"), "GatherWell | Church Community Workspace");
  assert.equal(metaContent("name", "twitter:image"), `${canonicalUrl}assets/community-dinner.webp`);
  assert.equal(metaContent("name", "twitter:image:alt"), "Neighbors sharing dinner around a community table");
  assert.match(html, /<link\s+rel=["']icon["'][^>]*href=["']assets\/logo\.svg["']/i);
});

test("structured data describes only the canonical GatherWell demo", () => {
  const documents = jsonLd();
  assert.equal(documents.length, 1);
  const graph = documents[0]["@graph"];
  assert.ok(Array.isArray(graph));
  assert.deepEqual(graph.map((entity) => entity["@type"]), ["WebSite", "SoftwareApplication", "FAQPage"]);
  assert.deepEqual(graph.map((entity) => entity["@id"]), [
    `${canonicalUrl}#website`,
    `${canonicalUrl}#software`,
    `${canonicalUrl}#faq`,
  ]);
  assert.equal(graph[0].url, canonicalUrl);
  assert.equal(graph[1].url, canonicalUrl);
  assert.equal(graph[1].applicationCategory, "BusinessApplication");
  assert.equal(graph[2].mainEntity.length, 4);
  for (const question of graph[2].mainEntity) {
    assert.match(html, new RegExp(`<summary>${question.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<`));
    assert.match(html, new RegExp(question.acceptedAnswer.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(JSON.stringify(documents), /aggregateRating|review|offers|SearchAction|gatherwell\.vercel\.app/);
});

test("crawler and AI-discovery files expose only the real canonical page", () => {
  assert.equal(robots, `User-agent: *\nAllow: /\n\nSitemap: ${canonicalUrl}sitemap.xml\n`);
  assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 1);
  assert.match(sitemap, new RegExp(`<loc>${canonicalUrl}<\\/loc>`));
  assert.doesNotMatch(sitemap, /<lastmod>|gatherwell-demo|gatherwell\.vercel\.app/);
  assert.match(llms, /^# GatherWell$/m);
  assert.match(llms, new RegExp(`^Canonical: ${canonicalUrl}$`, "m"));
  assert.match(llms, new RegExp(`^- Member demo: ${memberUrl}$`, "m"));
  assert.match(llms, new RegExp(`^- Pastor demo: ${pastorUrl}$`, "m"));
  assert.doesNotMatch(llms, /ranking signal|customer|adopted|rating|award|pricing/i);
});

test("page keeps a single H1 and semantic landmarks", () => {
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.equal((html.match(/<main\b/gi) ?? []).length, 1);
  assert.equal((html.match(/<header\b/gi) ?? []).length, 1);
  assert.equal((html.match(/<footer\b/gi) ?? []).length, 1);
  assert.equal((html.match(/<img\b/gi) ?? []).length, (html.match(/<img\b[^>]*\balt=["'][^"']*["'][^>]*>/gi) ?? []).length);
});
