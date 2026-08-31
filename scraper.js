// scraper.js
//
// Lee /alminuto de La Vanguardia, detecta noticias nuevas, entra en cada una
// para extraer datos estructurados (JSON-LD), y entra en la página de cada
// autor nuevo para sacar su foto. Guarda todo en Supabase.
//
// Uso local:
//   SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scraper.js
//
// En GitHub Actions, estas dos variables se pasan como Secrets (ver
// .github/workflows/scraper.yml).

import { createClient } from "@supabase/supabase-js";
import * as cheerio from "cheerio";
import fetch from "node-fetch";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Faltan SUPABASE_URL o SUPABASE_SERVICE_KEY en las variables de entorno.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BASE = "https://www.lavanguardia.com";
const LISTING_URL = `${BASE}/alminuto`;

// Un user-agent de navegador normal evita bloqueos básicos de bots.
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
};

const PAUSE_MS = 500; // pausa entre peticiones para no saturar el servidor

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugifyName(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function absoluteUrl(href) {
  if (!href) return null;
  return href.startsWith("http") ? href : `${BASE}${href}`;
}

async function fetchHtml(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} al pedir ${url}`);
  }
  return res.text();
}

// Busca, entre todos los <script type="application/ld+json"> de la página,
// el que tenga el @type indicado (p. ej. "NewsArticle" o "ProfilePage").
function extractJsonLd($, type) {
  let result = null;
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text();
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (data["@type"] === type) result = data;
    } catch (e) {
      // JSON-LD malformado o parcial: lo ignoramos y seguimos
    }
  });
  return result;
}

// ---------------------------------------------------------------------
// 1. Listado /alminuto: solo para descubrir URLs nuevas + datos básicos
// ---------------------------------------------------------------------
async function getListingItems() {
  const html = await fetchHtml(LISTING_URL);
  const $ = cheerio.load(html);
  const items = [];

  $("article.listing-item").each((_, el) => {
    const $el = $(el);
    const href = $el.find("a.page-link").first().attr("href");
    if (!href) return;

    const url = absoluteUrl(href);
    const title = $el.find("h2.title a.page-link").first().text().trim();
    const authorName = $el.find(".author").first().text().trim() || "Sin firma";

    items.push({ url, title, authorName });
  });

  // Quitamos duplicados dentro del propio listado (a veces un módulo de
  // publicidad rompe la estructura y puede repetirse algún item)
  const seen = new Set();
  return items.filter((i) => {
    if (seen.has(i.url)) return false;
    seen.add(i.url);
    return true;
  });
}

async function getExistingUrls() {
  const { data, error } = await supabase.from("articles").select("url");
  if (error) throw error;
  return new Set((data || []).map((r) => r.url));
}

// ---------------------------------------------------------------------
// 2. Autor: si no lo tenemos ya, vamos a su página y sacamos foto + bio
//    del JSON-LD ProfilePage.
// ---------------------------------------------------------------------
async function ensureAuthor(authorName, authorUrl) {
  const slug = authorUrl
    ? authorUrl.split("/").pop().replace(".html", "")
    : slugifyName(authorName);

  const { data: existing, error: selectError } = await supabase
    .from("authors")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();

  if (selectError) {
    console.error("Error consultando autor", slug, selectError);
  }
  if (existing) return slug;

  let photoUrl = null;
  let bio = null;

  if (authorUrl) {
    try {
      const html = await fetchHtml(authorUrl);
      const $ = cheerio.load(html);
      const profile = extractJsonLd($, "ProfilePage");
      if (profile && profile.mainEntity) {
        photoUrl = profile.mainEntity.image || null;
        bio = profile.mainEntity.description || null;
      }
    } catch (e) {
      console.warn(`No se pudo leer la página de autor ${authorUrl}: ${e.message}`);
    }
  }

  const { error: upsertError } = await supabase.from("authors").upsert({
    slug,
    name: authorName,
    photo_url: photoUrl,
    bio,
    author_page_url: authorUrl || null,
    last_checked_at: new Date().toISOString(),
  });

  if (upsertError) {
    console.error("Error guardando autor", slug, upsertError);
  }

  return slug;
}

// ---------------------------------------------------------------------
// 3. Artículo: entramos en la noticia y sacamos título, sección, imagen,
//    fecha y autor real del JSON-LD NewsArticle.
// ---------------------------------------------------------------------
async function processArticle(item) {
  const html = await fetchHtml(item.url);
  const $ = cheerio.load(html);

  const newsArticle = extractJsonLd($, "NewsArticle");

  const title = newsArticle?.headline || item.title;
  const section = newsArticle?.articleSection || null;

  const imageUrl = Array.isArray(newsArticle?.image)
    ? newsArticle.image[0]?.url
    : newsArticle?.image?.url || null;

  const publishedAt = newsArticle?.datePublished || null;

  // Prioridad para el autor: enlace real en la página > JSON-LD > nombre del listado
  let authorName = item.authorName;
  let authorUrl = null;

  const authorLink = $('.author_name a[rel="author"]').first();
  if (authorLink.length) {
    authorName = authorLink.text().trim() || authorName;
    authorUrl = absoluteUrl(authorLink.attr("href"));
  } else if (newsArticle?.author?.[0]) {
    authorName = newsArticle.author[0].name || authorName;
    authorUrl = newsArticle.author[0].url || null;
  }

  const authorSlug = await ensureAuthor(authorName, authorUrl);

  const { error } = await supabase.from("articles").insert({
    url: item.url,
    title,
    section,
    image_url: imageUrl,
    author_slug: authorSlug,
    published_at: publishedAt,
  });

  if (error) {
    console.error("Error guardando artículo", item.url, error);
  }
}

// ---------------------------------------------------------------------
// main
// ---------------------------------------------------------------------
async function main() {
  console.log("Leyendo listado /alminuto...");
  const items = await getListingItems();
  console.log(`Encontrados ${items.length} items en el listado`);

  const existingUrls = await getExistingUrls();
  const newItems = items.filter((i) => !existingUrls.has(i.url));
  console.log(`${newItems.length} artículos nuevos por procesar`);

  for (const item of newItems) {
    try {
      await processArticle(item);
      console.log("OK:", item.title);
    } catch (e) {
      console.error("Fallo en", item.url, e.message);
    }
    await sleep(PAUSE_MS);
  }

  console.log("Hecho.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
