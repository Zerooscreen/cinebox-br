const { img, slugify } = require('./tmdb');

const SITE_NAME = 'CineBox';
const DEFAULT_TITLE = '[ASSISTIR!!] Filmes Online Completo Dublado e Legendado em Português HD/4K';
const DEFAULT_DESC = 'Clique para assistir filmes online agora! Veja o filme completo com áudio dublado e legendas em português. Qualidade 4K Ultra HD disponível para streaming.';
const DEFAULT_OG_IMAGE = 'https://placehold.co/1200x630/17171b/8d8a92?text=CineBox';

const GOOGLE_SITE_VERIFICATION = 'M-_SCpf4h0A8JcaYgk3_kEfeagIFV6cKmqsg0iROtiI';

function escapeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function head({ title, description, url, image, type = 'website', robots = 'index, follow' }) {
  const t = escapeHtml(title || DEFAULT_TITLE);
  const d = escapeHtml((description || DEFAULT_DESC).slice(0, 160));
  const ogImg = image || DEFAULT_OG_IMAGE;
  return `
  <title>${t}</title>
  <meta name="google-site-verification" content="${GOOGLE_SITE_VERIFICATION}" />
  <meta name="description" content="${d}">
  <meta name="robots" content="${robots}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:title" content="${t}">
  <meta property="og:description" content="${d}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${ogImg}">
  <meta property="og:locale" content="pt_BR">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${t}">
  <meta name="twitter:description" content="${d}">
  <meta name="twitter:image" content="${ogImg}">
  `;
}

// ... (fungsi movieJsonLd, tvJsonLd, personJsonLd tetap sama) ...

function monetagScript() {
  return `<script>(function(s){s.dataset.zone='11565740',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>`;
}

function bannerScript(key, width, height) {
  return `<script>atOptions = { 'key' : '${key}', 'format' : 'iframe', 'height' : ${height}, 'width' : ${width}, 'params' : {} };</script><script src="https://www.highperformanceformat.com/${key}/invoke.js"></script>`;
}

// ... (fungsi topBannerAd, sideBannerAd, nativeBannerAd, socialBarScript, popunderScript, histatsScript tetap sama) ...

function layout({ headHtml, bodyHtml, activeTab = 'movie' }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${headHtml}
${monetagScript()}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css">
<style>
  /* ... (style Anda tetap sama) ... */
</style>
</head>
<body>
<header>
  <div class="header-inner">
    <a class="logo" href="/movie">Cine<span>Box</span></a>
    <nav class="tabs">
      <a class="tab-btn ${activeTab === 'movie' ? 'active' : ''}" href="/movie">Filmes</a>
      <a class="tab-btn ${activeTab === 'tv' ? 'active' : ''}" href="/tv">Séries</a>
    </nav>
    <div class="search-wrap">
      <input id="search-input" type="text" placeholder="Buscar título..." autocomplete="off">
      <div class="search-results" id="search-results"></div>
    </div>
  </div>
</header>
${topBannerAd()}
<main>
${bodyHtml}
</main>
<footer>
  <p>CineBox — Site de informações de filmes e séries de dados públicos do TMDB (não é um serviço de streaming) · Powered by <a href="https://www.themoviedb.org/" target="_blank" rel="noopener">TMDB</a></p>
</footer>
<script src="/app.js"></script>
${socialBarScript()}
${popunderScript()}
${histatsScript()}
</body>
</html>`;
}

// ... (fungsi posterCard, genreRow, trailerBlock, castGrid tetap sama) ...

module.exports = { 
  head, 
  layout, 
  posterCard, 
  genreRow, 
  trailerBlock, 
  castGrid, 
  escapeHtml, 
  movieJsonLd, 
  tvJsonLd, 
  personJsonLd,
  sideBannerAd, 
  nativeBannerAd, 
  DEFAULT_TITLE, 
  DEFAULT_DESC, 
  SITE_NAME 
};
