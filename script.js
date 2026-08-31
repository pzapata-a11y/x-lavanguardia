// =====================================================================
// DATOS DE EJEMPLO
// =====================================================================

const AUTHORS = {
  "marta-puig": { name: "Marta Puig", color: "#0d2b4e", following: true },
  "jordi-serra": { name: "Jordi Serra", color: "#1c7c3f", following: true },
  "laura-gomez": { name: "Laura Gómez", color: "#7a4b1e", following: false },
  "redaccion-sociedad": { name: "Redacción Sociedad", color: "#5b6672", following: false },
  "pol-vidal": { name: "Pol Vidal", color: "#8e2e46", following: true },
  "anna-ferrer": { name: "Anna Ferrer", color: "#5c3d8e", following: false },
  "david-roca": { name: "David Roca", color: "#0b6e6e", following: false },
  "nuria-camps": { name: "Núria Camps", color: "#8e5a0b", following: true },
  "marc-illa": { name: "Marc Illa", color: "#1c7c3f", following: false },
  "sara-puig": { name: "Sara Puig", color: "#0d2b4e", following: false },
};

const NEWS_DATA = [
  { id: 1, author: "sara-puig", section: "Internacional", title: "La cumbre europea busca un acuerdo urgente para frenar la crisis energética", time: "9min", hasImage: true, likes: 214, comments: 18, reposts: 32, views: 12400 },
  { id: 2, author: "jordi-serra", section: "Deportes", title: "El equipo se juega el pase a la final en un partido marcado por las bajas", time: "11min", hasImage: true, likes: 532, comments: 87, reposts: 120, views: 34500 },
  { id: 3, author: "laura-gomez", section: "Economía", title: "La Bolsa cierra la semana con ganancias pese a la incertidumbre en los mercados", time: "22min", hasImage: true, likes: 98, comments: 12, reposts: 25, views: 8700 },
  { id: 4, author: "redaccion-sociedad", section: "Sociedad", title: "Un estudio revela que el teletrabajo ha cambiado la forma de vivir en las ciudades medias", time: "34min", hasImage: false, likes: 156, comments: 24, reposts: 18, views: 9600 },
  { id: 5, author: "pol-vidal", section: "Política", title: "El Gobierno anuncia un plan de choque para frenar la inflación en los próximos meses", time: "41min", hasImage: true, likes: 302, comments: 145, reposts: 76, views: 21000 },
  { id: 6, author: "anna-ferrer", section: "Cultura", title: "La exposición que repasa cuatro décadas de fotografía urbana llega a la ciudad", time: "48min", hasImage: true, likes: 76, comments: 6, reposts: 9, views: 4300 },
  { id: 7, author: "david-roca", section: "Tecnología", title: "La nueva generación de baterías promete duplicar la autonomía de los coches eléctricos", time: "55min", hasImage: true, likes: 189, comments: 33, reposts: 54, views: 15800 },
  { id: 8, author: "nuria-camps", section: "Opinión", title: "Por qué deberíamos hablar más de salud mental en el trabajo y menos en las redes", time: "1h", hasImage: false, likes: 421, comments: 98, reposts: 61, views: 18200 },
  { id: 9, author: "marc-illa", section: "Deportes", title: "El fichaje sorpresa que cambia por completo la planificación del próximo mercado", time: "1h", hasImage: true, likes: 267, comments: 41, reposts: 38, views: 13100 },
  { id: 10, author: "marta-puig", section: "Internacional", title: "La ONU pide una investigación independiente tras el aumento de tensión en la frontera", time: "1h", hasImage: true, likes: 145, comments: 29, reposts: 44, views: 10200 },
  { id: 11, author: "sara-puig", section: "Internacional", title: "El acuerdo comercial entre los dos bloques queda en suspenso tras el desacuerdo final", time: "2h", hasImage: false, likes: 88, comments: 15, reposts: 12, views: 6400 },
  { id: 12, author: "laura-gomez", section: "Economía", title: "Las hipotecas se encarecen de nuevo tras la última decisión del banco central", time: "2h", hasImage: true, likes: 176, comments: 52, reposts: 29, views: 11900 },
  { id: 13, author: "pol-vidal", section: "Política", title: "La oposición registra una moción para exigir explicaciones sobre el gasto público", time: "2h", hasImage: true, likes: 233, comments: 110, reposts: 47, views: 16700 },
  { id: 14, author: "redaccion-sociedad", section: "Sociedad", title: "Las listas de espera sanitarias vuelven a crecer según el último informe autonómico", time: "3h", hasImage: true, likes: 312, comments: 76, reposts: 55, views: 19500 },
  { id: 15, author: "david-roca", section: "Tecnología", title: "Una investigación alerta del uso creciente de inteligencia artificial en fraudes online", time: "3h", hasImage: false, likes: 199, comments: 45, reposts: 63, views: 14300 },
  { id: 16, author: "nuria-camps", section: "Opinión", title: "La generación que creció con el móvil en la mano ya educa a sus propios hijos", time: "3h", hasImage: true, likes: 356, comments: 84, reposts: 71, views: 20100 },
  { id: 17, author: "anna-ferrer", section: "Cultura", title: "El festival de cine independiente anuncia una edición récord de participación", time: "4h", hasImage: true, likes: 64, comments: 8, reposts: 6, views: 3900 },
  { id: 18, author: "marc-illa", section: "Deportes", title: "La lesión de última hora obliga a cambiar los planes para el partido del fin de semana", time: "4h", hasImage: true, likes: 288, comments: 39, reposts: 41, views: 13600 },
];

const VIDEO_DATA = [
  { id: "v1", author: "redaccion-sociedad", section: "Vídeo", title: "Así ha quedado la plaza tras las obras de remodelación del centro histórico", time: "20min", duration: "1:48", likes: 143, comments: 21, reposts: 19, views: 22300 },
  { id: "v2", author: "jordi-serra", section: "Vídeo", title: "Las mejores jugadas de la jornada en menos de dos minutos", time: "1h", duration: "1:52", likes: 401, comments: 58, reposts: 87, views: 45200 },
  { id: "v3", author: "david-roca", section: "Vídeo", title: "Probamos el nuevo dispositivo que promete cambiar la forma de trabajar en remoto", time: "2h", duration: "3:10", likes: 210, comments: 34, reposts: 40, views: 17600 },
  { id: "v4", author: "marta-puig", section: "Vídeo", title: "Imágenes desde el lugar donde se ha producido el encuentro internacional", time: "3h", duration: "2:24", likes: 178, comments: 26, reposts: 33, views: 15900 },
];

const AD_DATA = [
  { id: "a1", title: "Suscríbete a La Vanguardia", body: "Accede a todo el contenido sin límites desde 1€ el primer mes." },
  { id: "a2", title: "La Vanguardia Shopping", body: "Descubre las mejores ofertas seleccionadas para nuestros lectores." },
];

const COMMENTS_POOL = [
  { author: "laia-montes", name: "Laia Montes", color: "#0d2b4e", text: "Muy buen resumen, gracias por la información." },
  { author: "ricard-soler", name: "Ricard Soler", color: "#7a4b1e", text: "Habrá que ver cómo evoluciona en los próximos días." },
  { author: "elena-vidal", name: "Elena Vidal", color: "#8e2e46", text: "No estoy del todo de acuerdo, faltan datos por contrastar." },
  { author: "toni-marques", name: "Toni Marqués", color: "#1c7c3f", text: "Totalmente de acuerdo, ya era hora de que se hablara de esto." },
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

const commentIcon = '<svg class="icon" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M4 5h16v11H8l-4 4V5z"/></svg>';
const repostIcon = '<svg class="icon" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M6 4v9a3 3 0 0 0 3 3h9M18 20v-9a3 3 0 0 0-3-3H6M9 20l-3-3 3-3M15 4l3 3-3 3"/></svg>';
const likeIcon = '<svg class="icon" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M12 21s-7-4.6-9-7.9C1.4 10.6 3 6 7 6c2.4 0 3.2 1.6 5 3.2C13.8 7.6 14.6 6 17 6c4 0 5.6 4.6 4 7.1C19 16.4 12 21 12 21z"/></svg>';
const viewsIcon = '<svg class="icon" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
const saveIcon = '<svg class="icon" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M6 4h12v16l-6-4-6 4V4z"/></svg>';
const playIcon = "&#9658;";

// =====================================================================
// RENDERIZADO DE TARJETAS
// =====================================================================

function authorAvatarHTML(authorSlug, size) {
  const author = AUTHORS[authorSlug];
  const sizeClass = size === "small" ? " small" : "";
  return `<span class="avatar${sizeClass}" style="background:${author.color}">${initials(author.name)}</span>`;
}

function newsCardHTML(item) {
  const author = AUTHORS[item.author];
  const authorSlug = item.author;
  return `
    <article class="feed-card" data-type="news" data-id="${item.id}" data-title="${item.title}">
      <div class="feed-card-header">
        <a class="author-link" href="/autor/${authorSlug}" title="Ver perfil de ${author.name}">
          ${authorAvatarHTML(authorSlug)}
        </a>
        <div class="author-meta">
          <a class="author-name" href="/autor/${authorSlug}">${author.name}</a>
          <span class="dot">·</span>
          <span class="time">${item.time}</span>
        </div>
        <span class="section-tag">${item.section}</span>
      </div>
      <div class="feed-card-body">
        <h2 class="headline">${item.title}</h2>
        ${item.hasImage ? `<div class="cover-image" style="background:linear-gradient(135deg, ${author.color}, rgba(0,0,0,0.35))">${item.section}</div>` : ""}
      </div>
      ${actionsBarHTML(item)}
      <div class="comments-panel hidden" data-comments-for="${item.id}"></div>
    </article>
  `;
}

function videoCardHTML(item) {
  const author = AUTHORS[item.author];
  const authorSlug = item.author;
  return `
    <article class="feed-card feed-card-video" data-type="video" data-id="${item.id}" data-title="${item.title}">
      <div class="feed-card-header">
        <a class="author-link" href="/autor/${authorSlug}" title="Ver perfil de ${author.name}">
          ${authorAvatarHTML(authorSlug)}
        </a>
        <div class="author-meta">
          <a class="author-name" href="/autor/${authorSlug}">${author.name}</a>
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
      <div class="comments-panel hidden" data-comments-for="${item.id}"></div>
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
        ${commentIcon}<span class="comment-count">${formatCount(item.comments)}</span>
      </button>
      <button type="button" class="action-btn repost-btn" data-action="repost">
        ${repostIcon}<span class="repost-count">${formatCount(item.reposts)}</span>
      </button>
      <button type="button" class="action-btn like-btn" data-action="like">
        ${likeIcon}<span class="like-count">${formatCount(item.likes)}</span>
      </button>
      <button type="button" class="action-btn views-btn" data-action="views">
        ${viewsIcon}<span class="views-count">${formatCount(item.views)}</span>
      </button>
      <button type="button" class="action-btn save-btn" data-action="save" aria-label="Guardar">
        ${saveIcon}
      </button>
    </div>
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
    return NEWS_DATA.filter((item) => AUTHORS[item.author].following);
  }
  return NEWS_DATA;
}

function buildBatch(newsItems) {
  const out = [];
  newsItems.forEach((newsItem) => {
    out.push({ type: "news", data: newsItem });
    feedState.newsCounter++;

    if (feedState.newsCounter % 3 === 0) {
      out.push({ type: "video", data: VIDEO_DATA[feedState.videoIndex % VIDEO_DATA.length] });
      feedState.videoIndex++;
    }
    if (feedState.newsCounter % 5 === 0) {
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

  if (!append) {
    feedEl.innerHTML = "";
    resetFeedState();
  }

  if (!source.length) {
    feedEl.innerHTML = '<p class="feed-empty">Todavía no sigues autores. Prueba la pestaña "Para ti".</p>';
    sentinel.classList.add("is-hidden");
    return;
  }

  const batch = buildBatch(shuffled(source));
  feedEl.insertAdjacentHTML("beforeend", batch.map(cardHTML).join(""));
  feedState.batchesLoaded++;

  if (feedState.batchesLoaded >= feedState.maxBatches) {
    sentinel.classList.add("is-hidden");
    feedEl.insertAdjacentHTML("beforeend", '<p class="feed-end">Has llegado al final de esta muestra de ejemplo.</p>');
  }
}

function loadMore() {
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
// COMENTARIOS SIMULADOS
// =====================================================================

function commentRowHTML(entry) {
  return `
    <div class="comment">
      <span class="avatar small" style="background:${entry.color}">${initials(entry.name)}</span>
      <div class="comment-body">
        <a class="comment-author" href="/autor/${entry.author}">${entry.name}</a>
        <p class="comment-text">${entry.text}</p>
      </div>
    </div>
  `;
}

function renderCommentsPanel(panel, articleId) {
  const seedIndex = Number(String(articleId).replace(/\D/g, "")) || 0;
  const shown = [COMMENTS_POOL[seedIndex % COMMENTS_POOL.length], COMMENTS_POOL[(seedIndex + 1) % COMMENTS_POOL.length]];

  panel.innerHTML = `
    <div class="comments-list">${shown.map(commentRowHTML).join("")}</div>
    <form class="comment-form">
      <input type="text" class="comment-input" placeholder="Escribe un comentario..." />
      <button type="submit" class="comment-submit">Publicar</button>
    </form>
  `;
}

// =====================================================================
// DELEGACIÓN DE EVENTOS SOBRE EL FEED
// =====================================================================

document.getElementById("feed").addEventListener("click", (event) => {
  const commentForm = event.target.closest(".comment-form");
  if (commentForm) return; // el submit se gestiona aparte

  const actionBtn = event.target.closest(".action-btn");
  const card = event.target.closest(".feed-card");
  if (!card) return;

  if (actionBtn) {
    handleAction(actionBtn, card);
    return;
  }

  if (event.target.closest(".author-link")) return; // navegación normal al autor
  if (event.target.closest(".comments-panel")) return;

  if (card.dataset.type === "ad") return; // la publicidad no simula navegación

  const title = card.dataset.title || "vídeo";
  if (card.dataset.type === "video") {
    alert(`Reproduciendo vídeo: ${title}`);
  } else {
    alert(`Abriendo noticia completa:\n\n${title}`);
  }
});

document.getElementById("feed").addEventListener("submit", (event) => {
  const form = event.target.closest(".comment-form");
  if (!form) return;
  event.preventDefault();

  const input = form.querySelector(".comment-input");
  const text = input.value.trim();
  if (!text) return;

  const card = form.closest(".feed-card");
  const list = form.previousElementSibling;
  list.insertAdjacentHTML(
    "afterbegin",
    commentRowHTML({ author: "tu-usuario", name: "Tú", color: "#0d2b4e", text })
  );
  input.value = "";

  const countEl = card.querySelector(".comment-count");
  const next = parseCount(countEl.textContent) + 1;
  countEl.dataset.raw = String(next);
  countEl.textContent = formatCount(next);
});

function handleAction(button, card) {
  const action = button.dataset.action;

  if (action === "comment") {
    const panel = card.querySelector(".comments-panel");
    const wasHidden = panel.classList.contains("hidden");
    if (wasHidden && !panel.dataset.rendered) {
      renderCommentsPanel(panel, card.dataset.id);
      panel.dataset.rendered = "true";
    }
    panel.classList.toggle("hidden");
    return;
  }

  if (action === "views") return; // solo informativo

  if (action === "like" || action === "repost" || action === "save") {
    const isCountable = action !== "save";
    button.classList.toggle("is-active");
    if (isCountable) {
      const countEl = button.querySelector(`.${action}-count`);
      const active = button.classList.contains("is-active");
      const raw = countEl.dataset.raw ? Number(countEl.dataset.raw) : parseCount(countEl.textContent);
      const next = active ? raw + 1 : raw - 1;
      countEl.dataset.raw = String(next);
      countEl.textContent = formatCount(next);
    }
  }
}

function parseCount(text) {
  if (text.includes("K")) {
    return Math.round(parseFloat(text.replace(",", ".")) * 1000);
  }
  return Number(text);
}

// =====================================================================
// SIDEBAR: LO MÁS VISTO
// =====================================================================

function renderTrending() {
  const list = document.getElementById("trending-list");
  if (!list) return;
  const top = NEWS_DATA.slice().sort((a, b) => b.views - a.views).slice(0, 5);
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
// INICIO
// =====================================================================

renderFeed(feedState.currentTab);
renderTrending();
