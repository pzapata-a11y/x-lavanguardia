// =====================================================================
// CONFIGURACIÓN DE SUPABASE
// =====================================================================

const SUPABASE_URL = "https://jkiuwnjevhgiwqlxjutd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_PP-ZHfn-Pbq5C8865yoKEQ_xMqoLLx7";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =====================================================================
// IDENTIDAD ANÓNIMA DEL VISITANTE (sin login real)
// =====================================================================
// Vive solo en este navegador. Permite que los likes/guardados/follows
// se mantengan entre visitas sin necesitar cuenta ni contraseña.

function getVisitorId() {
  let id = localStorage.getItem("xlv_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("xlv_visitor_id", id);
  }
  return id;
}

const VISITOR_ID = getVisitorId();

// =====================================================================
// DATOS DE EJEMPLO (vídeos y anuncios siguen simulados)
// =====================================================================

const AUTHORS = {}; // se rellena dinámicamente al cargar Supabase
let NEWS_DATA = []; // se rellena dinámicamente al cargar Supabase

const VIDEO_DATA = [
  { id: "v1", author: null, section: "Vídeo", title: "Así ha quedado la plaza tras las obras de remodelación del centro histórico", time: "20min", duration: "1:48", views: 0 },
  { id: "v2", author: null, section: "Vídeo", title: "Las mejores jugadas de la jornada en menos de dos minutos", time: "1h", duration: "1:52", views: 0 },
  { id: "v3", author: null, section: "Vídeo", title: "Probamos el nuevo dispositivo que promete cambiar la forma de trabajar en remoto", time: "2h", duration: "3:10", views: 0 },
  { id: "v4", author: null, section: "Vídeo", title: "Imágenes desde el lugar donde se ha producido el encuentro internacional", time: "3h", duration: "2:24", views: 0 },
];

const AD_DATA = [
  { id: "a1", title: "Suscríbete a La Vanguardia", body: "Accede a todo el contenido sin límites desde 1€ el primer mes." },
  { id: "a2", title: "La Vanguardia Shopping", body: "Descubre las mejores ofertas seleccionadas para nuestros lectores." },
];

// =====================================================================
// UTILIDADES
// =====================================================================

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function formatCount(n) {
  if (n >= 1000) {
    return (n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0).replace(".", ",") + "K";
  }
  return String(n);
}

function shuffled(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Color determinista a partir del slug del autor, para cuando no hay foto.
function colorFromSlug(slug) {
  const palette = ["#0d2b4e", "#1c7c3f", "#7a4b1e", "#5b6672", "#8e2e46", "#5c3d8e", "#0b6e6e", "#8e5a0b"];
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

// Convierte una fecha ISO en "9min" / "3h" / "2d" / "12d". Siempre
// devuelve algo (usa first_seen_at como reserva si falta published_at).
function timeAgo(isoDate) {
  if (!isoDate) return "hace un tiempo";
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "ahora";
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

// Devuelve el autor si existe, o un autor de reserva si no (por ejemplo,
// los vídeos de ejemplo, que no vienen de Supabase).
function getAuthor(slug) {
  return (
    AUTHORS[slug] || {
      name: "La Vanguardia",
      color: colorFromSlug(slug || "la-vanguardia"),
      photo: null,
      pageUrl: null,
      following: false,
    }
  );
}

const commentIcon = '<svg class="icon" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M4 5h16v11H8l-4 4V5z"/></svg>';
const likeIcon = '<svg class="icon" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M12 21s-7-4.6-9-7.9C1.4 10.6 3 6 7 6c2.4 0 3.2 1.6 5 3.2C13.8 7.6 14.6 6 17 6c4 0 5.6 4.6 4 7.1C19 16.4 12 21 12 21z"/></svg>';
const viewsIcon = '<svg class="icon" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
const saveIcon = '<svg class="icon" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M6 4h12v16l-6-4-6 4V4z"/></svg>';
const playIcon = "&#9658;";

// =====================================================================
// RENDERIZADO DE TARJETAS
// =====================================================================

function authorAvatarHTML(authorSlug, size) {
  const author = getAuthor(authorSlug);
  const sizeClass = size === "small" ? " small" : "";
  if (author.photo) {
    return `<img class="avatar${sizeClass}" src="${author.photo}" alt="${author.name}" />`;
  }
  return `<span class="avatar${sizeClass}" style="background:${author.color}">${initials(author.name)}</span>`;
}

// El nombre/avatar del autor SIEMPRE enlaza a la página real de La
// Vanguardia (no hay páginas de autor dentro de esta demo).
function authorLinkAttrs(author) {
  return author.pageUrl
    ? `href="${author.pageUrl}" target="_blank" rel="noopener"`
    : `href="javascript:void(0)" tabindex="-1" aria-disabled="true"`;
}

function followButtonHTML(authorSlug) {
  const author = getAuthor(authorSlug);
  if (!AUTHORS[authorSlug]) return ""; // no mostramos "seguir" sobre autores de reserva
  const active = author.following;
  return `
    <button type="button" class="follow-btn${active ? " is-active" : ""}" data-action="follow" data-author="${authorSlug}">
      ${active ? "Siguiendo" : "Seguir"}
    </button>
  `;
}

function newsCardHTML(item) {
  const author = getAuthor(item.author);
  const authorSlug = item.author;
  const cover = item.hasImage
    ? item.image
      ? `<div class="cover-image" style="background-image:url('${item.image}'); background-size:cover; background-position:center;"></div>`
      : `<div class="cover-image" style="background:linear-gradient(135deg, ${author.color}, rgba(0,0,0,0.35))">${item.section}</div>`
    : "";
  return `
    <article class="feed-card" data-type="news" data-id="${item.id}" data-url="${item.url || ""}">
      <div class="feed-card-header">
        <a class="author-link" ${authorLinkAttrs(author)} title="Ver perfil de ${author.name} en La Vanguardia">
          ${authorAvatarHTML(authorSlug)}
        </a>
        <div class="author-meta">
          <a class="author-name" ${authorLinkAttrs(author)}>${author.name}</a>
          <span class="dot">·</span>
          <span class="time">${item.time}</span>
        </div>
        ${followButtonHTML(authorSlug)}
        <span class="section-tag">${item.section}</span>
      </div>
      <div class="feed-card-body">
        <h2 class="headline">${item.title}</h2>
        ${cover}
      </div>
      ${actionsBarHTML(item)}
    </article>
  `;
}

function videoCardHTML(item) {
  const author = getAuthor(item.author);
  return `
    <article class="feed-card feed-card-video" data-type="video" data-id="${item.id}" data-url="">
      <div class="feed-card-header">
        <span class="avatar" style="background:${author.color}">${initials(author.name)}</span>
        <div class="author-meta">
          <span class="author-name">${author.name}</span>
          <span class="dot">·</span>
          <span class="time">${item.time}</span>
        </div>
        <span class="section-tag video-label">${item.section}</span>
      </div>
      <div class="feed-card-body">
        <h2 class="headline">${item.title}</h2>
        <div class="video-thumb" style="background:linear-gradient(135deg, ${author.color}, rgba(0,0,0,0.45))">
          <button type="button" class="play-btn" aria-label="Reproducir vídeo">${playIcon}</button>
          <span class="video-duration">${item.duration}</span>
        </div>
      </div>
      ${actionsBarHTML(item)}
    </article>
  `;
}

function adCardHTML(item) {
  return `
    <article class="feed-card feed-card-ad" data-type="ad" data-id="${item.id}">
      <span class="ad-label">Publicidad</span>
      <div class="ad-content">
        <h3>${item.title}</h3>
        <p>${item.body}</p>
      </div>
    </article>
  `;
}

function actionsBarHTML(item) {
  return `
    <div class="feed-card-actions">
      <button type="button" class="action-btn comment-btn" data-action="comment">
        ${commentIcon}<span class="comment-count">Comentarios</span>
      </button>
      <button type="button" class="action-btn like-btn${item.liked ? " is-active" : ""}" data-action="like">
        ${likeIcon}<span class="like-count">${formatCount(item.likes || 0)}</span>
      </button>
      <button type="button" class="action-btn views-btn" data-action="views">
        ${viewsIcon}<span class="views-count">${formatCount(item.views || 0)}</span>
      </button>
      <button type="button" class="action-btn save-btn${item.saved ? " is-active" : ""}" data-action="save" aria-label="Guardar">
        ${saveIcon}
      </button>
    </div>
    <div class="comments-notice hidden">Los comentarios estarán disponibles próximamente para personas suscritas.</div>
  `;
}

function cardHTML(feedItem) {
  if (feedItem.type === "video") return videoCardHTML(feedItem.data);
  if (feedItem.type === "ad") return adCardHTML(feedItem.data);
  return newsCardHTML(feedItem.data);
}

// =====================================================================
// CONSTRUCCIÓN DEL FEED (mezcla de noticias, vídeos y publicidad)
// =====================================================================

const feedState = {
  currentTab: "para-ti",
  newsCounter: 0,
  videoIndex: 0,
  adIndex: 0,
  batchesLoaded: 0,
  maxBatches: 3,
};

function getSourceForTab(tab) {
  if (tab === "siguiendo") {
    return NEWS_DATA.filter((item) => getAuthor(item.author).following);
  }
  if (tab === "guardados") {
    return NEWS_DATA.filter((item) => item.saved);
  }
  return NEWS_DATA;
}

function buildBatch(newsItems, mixExtras) {
  const out = [];
  newsItems.forEach((newsItem) => {
    out.push({ type: "news", data: newsItem });
    feedState.newsCounter++;

    if (mixExtras && feedState.newsCounter % 3 === 0) {
      out.push({ type: "video", data: VIDEO_DATA[feedState.videoIndex % VIDEO_DATA.length] });
      feedState.videoIndex++;
    }
    if (mixExtras && feedState.newsCounter % 5 === 0) {
      out.push({ type: "ad", data: AD_DATA[feedState.adIndex % AD_DATA.length] });
      feedState.adIndex++;
    }
  });
  return out;
}

function resetFeedState() {
  feedState.newsCounter = 0;
  feedState.videoIndex = 0;
  feedState.adIndex = 0;
  feedState.batchesLoaded = 0;
}

function renderFeed(tab, { append = false } = {}) {
  const feedEl = document.getElementById("feed");
  const sentinel = document.getElementById("feed-sentinel");
  const source = getSourceForTab(tab);
  const mixExtras = tab === "para-ti"; // vídeos/anuncios de ejemplo solo en "Para ti"

  if (!append) {
    feedEl.innerHTML = "";
    resetFeedState();
  }

  if (!source.length) {
    const emptyMessage =
      tab === "siguiendo"
        ? 'Todavía no sigues a ningún autor. Pulsa "Seguir" en cualquier noticia.'
        : tab === "guardados"
        ? "Todavía no has guardado ninguna noticia."
        : "No hay noticias disponibles.";
    feedEl.innerHTML = `<p class="feed-empty">${emptyMessage}</p>`;
    sentinel.classList.add("is-hidden");
    return;
  }

  const batch = buildBatch(tab === "para-ti" ? shuffled(source) : source, mixExtras);
  feedEl.insertAdjacentHTML("beforeend", batch.map(cardHTML).join(""));
  feedState.batchesLoaded++;

  if (feedState.batchesLoaded >= feedState.maxBatches || !mixExtras) {
    sentinel.classList.add("is-hidden");
    feedEl.insertAdjacentHTML("beforeend", '<p class="feed-end">Has llegado al final de esta muestra.</p>');
  }
}

function loadMore() {
  if (feedState.currentTab !== "para-ti") return;
  if (feedState.batchesLoaded >= feedState.maxBatches) return;
  renderFeed(feedState.currentTab, { append: true });
}

// =====================================================================
// PESTAÑAS
// =====================================================================

document.querySelectorAll(".feed-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".feed-tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    feedState.currentTab = tab.dataset.tab;
    document.getElementById("feed-sentinel").classList.remove("is-hidden");
    renderFeed(feedState.currentTab);
  });
});

// =====================================================================
// SCROLL INFINITO
// =====================================================================

const sentinelEl = document.getElementById("feed-sentinel");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) loadMore();
    });
  },
  { rootMargin: "200px" }
);
observer.observe(sentinelEl);

// =====================================================================
// DELEGACIÓN DE EVENTOS SOBRE EL FEED
// =====================================================================

document.getElementById("feed").addEventListener("click", (event) => {
  const actionBtn = event.target.closest(".action-btn, .follow-btn");
  const card = event.target.closest(".feed-card");
  if (!card) return;

  if (actionBtn) {
    handleAction(actionBtn, card);
    return;
  }

  if (event.target.closest(".author-link")) return; // navegación normal al autor
  if (card.dataset.type === "ad") return;

  if (card.dataset.type === "video") {
    alert("Los vídeos son contenido de ejemplo en esta demo.");
    return;
  }

  const url = card.dataset.url;
  const articleId = card.dataset.id;
  if (url) {
    registerView(articleId);
    window.open(url, "_blank", "noopener");
  }
});

async function registerView(articleId) {
  const numericId = Number(articleId);
  if (!numericId) return;
  const item = NEWS_DATA.find((n) => String(n.id) === String(articleId));
  if (item) {
    item.views = (item.views || 0) + 1;
    const card = document.querySelector(`.feed-card[data-id="${articleId}"]`);
    const countEl = card && card.querySelector(".views-count");
    if (countEl) countEl.textContent = formatCount(item.views);
  }
  const { error } = await supabaseClient.rpc("increment_views", { p_article_id: numericId });
  if (error) console.warn("No se pudo registrar la vista:", error.message);
}

async function handleAction(button, card) {
  const action = button.dataset.action;
  const articleId = card.dataset.id;

  if (action === "comment") {
    const notice = card.querySelector(".comments-notice");
    notice.classList.toggle("hidden");
    return;
  }

  if (action === "views") return; // solo informativo, no hace nada al clicar

  if (action === "follow") {
    const authorSlug = button.dataset.author;
    const author = getAuthor(authorSlug);
    const nextState = !author.following;
    author.following = nextState;
    button.classList.toggle("is-active", nextState);
    button.textContent = nextState ? "Siguiendo" : "Seguir";

    if (nextState) {
      const { error } = await supabaseClient.from("follows").insert({ author_slug: authorSlug, visitor_id: VISITOR_ID });
      if (error) console.warn("No se pudo guardar el follow:", error.message);
    } else {
      const { error } = await supabaseClient
        .from("follows")
        .delete()
        .eq("author_slug", authorSlug)
        .eq("visitor_id", VISITOR_ID);
      if (error) console.warn("No se pudo quitar el follow:", error.message);
    }
    return;
  }

  if (action === "like" || action === "save") {
    const numericId = Number(articleId);
    const item = NEWS_DATA.find((n) => String(n.id) === String(articleId));
    const isNowActive = !button.classList.contains("is-active");
    button.classList.toggle("is-active", isNowActive);

    const table = action === "like" ? "likes" : "saves";
    const column = "article_id";

    if (action === "like" && item) {
      item.liked = isNowActive;
      item.likes = (item.likes || 0) + (isNowActive ? 1 : -1);
      const countEl = button.querySelector(".like-count");
      countEl.textContent = formatCount(item.likes);
    }
    if (action === "save" && item) {
      item.saved = isNowActive;
    }

    if (isNowActive) {
      const { error } = await supabaseClient.from(table).insert({ [column]: numericId, visitor_id: VISITOR_ID });
      if (error) console.warn(`No se pudo guardar ${action}:`, error.message);
    } else {
      const { error } = await supabaseClient
        .from(table)
        .delete()
        .eq(column, numericId)
        .eq("visitor_id", VISITOR_ID);
      if (error) console.warn(`No se pudo quitar ${action}:`, error.message);
    }
  }
}

// =====================================================================
// SIDEBAR: LO MÁS VISTO
// =====================================================================

function renderTrending() {
  const list = document.getElementById("trending-list");
  if (!list) return;
  const top = NEWS_DATA.slice().sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
  list.innerHTML = top
    .map(
      (item) => `
        <li>
          <span class="trending-section">${item.section}</span>
          <span class="trending-title">${item.title}</span>
        </li>
      `
    )
    .join("");
}

// =====================================================================
// CARGA DE DATOS REALES DESDE SUPABASE
// =====================================================================

async function loadVisitorState() {
  const [likesRes, savesRes, followsRes] = await Promise.all([
    supabaseClient.from("likes").select("article_id").eq("visitor_id", VISITOR_ID),
    supabaseClient.from("saves").select("article_id").eq("visitor_id", VISITOR_ID),
    supabaseClient.from("follows").select("author_slug").eq("visitor_id", VISITOR_ID),
  ]);
  return {
    likedIds: new Set((likesRes.data || []).map((r) => r.article_id)),
    savedIds: new Set((savesRes.data || []).map((r) => r.article_id)),
    followedSlugs: new Set((followsRes.data || []).map((r) => r.author_slug)),
  };
}

async function loadArticlesFromSupabase() {
  const { data, error } = await supabaseClient
    .from("feed_articles")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(150);

  if (error) {
    console.error("Error cargando artículos de Supabase:", error);
    document.getElementById("feed").innerHTML =
      `<p class="feed-empty">No se han podido cargar las noticias.<br>Error: ${error.message || error.code || "desconocido"}</p>`;
    return false;
  }

  if (!data || data.length === 0) {
    document.getElementById("feed").innerHTML =
      '<p class="feed-empty">La consulta a Supabase funcionó pero no devolvió ninguna noticia.</p>';
    return false;
  }

  const { likedIds, savedIds, followedSlugs } = await loadVisitorState();

  data.forEach((row) => {
    const slug = row.author_slug || "sin-firma";
    if (!AUTHORS[slug]) {
      AUTHORS[slug] = {
        name: row.author_name || "Sin firma",
        color: colorFromSlug(slug),
        photo: row.author_photo || null,
        pageUrl: row.author_page_url || null,
        following: followedSlugs.has(slug),
      };
    }
  });

  NEWS_DATA = data.map((row) => ({
    id: row.id,
    url: row.url,
    author: row.author_slug || "sin-firma",
    section: row.section || "Al Minuto",
    title: row.title,
    time: timeAgo(row.published_at || row.first_seen_at),
    hasImage: !!row.image_url,
    image: row.image_url,
    likes: row.likes_count || 0,
    views: row.views_count || 0,
    liked: likedIds.has(row.id),
    saved: savedIds.has(row.id),
  }));

  return true;
}

// =====================================================================
// INICIO
// =====================================================================

(async function init() {
  document.getElementById("feed").innerHTML = '<p class="feed-empty">Cargando noticias…</p>';
  const ok = await loadArticlesFromSupabase();
  if (!ok) return;
  renderFeed(feedState.currentTab);
  renderTrending();
})();
