document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');

  if (!input) return;

  let timer;
  input.addEventListener('input', (e) => {
    clearTimeout(timer);
    const q = e.target.value.trim();
    if (!q) {
      results.style.display = 'none';
      results.innerHTML = '';
      return;
    }

    timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        
        if (!data.results || data.results.length === 0) {
          results.innerHTML = '<div style="padding:15px;text-align:center;color:#8d8a92">Nenhum resultado encontrado</div>';
          results.style.display = 'block';
          return;
        }

        results.innerHTML = data.results.map(r => `
          <a class="search-item" href="/${r.type}/${r.id}/${encodeURIComponent(r.slug)}">
            <img src="${r.poster}" alt="${r.title}">
            <div>
              <div style="font-weight:700;font-size:14px">${r.title}</div>
              <div style="font-size:12px;color:#8d8a92">${r.type === 'movie' ? 'Filme' : 'Série'} · ${r.year || ''}</div>
            </div>
          </a>
        `).join('');
        results.style.display = 'block';
      } catch (err) {
        console.error(err);
      }
    }, 300);
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !results.contains(e.target)) {
      results.style.display = 'none';
    }
  });
});
document.addEventListener('click', async (e) => {
  const seasonHead = e.target.closest('.season-head');
  if (!seasonHead) return;

  const seasonItem = seasonHead.closest('.season-item');
  const panel = seasonItem.querySelector('.episode-panel');
  const tvId = seasonItem.getAttribute('data-tv');
  const seasonNumber = seasonItem.getAttribute('data-season');

  seasonItem.classList.toggle('active');

  if (panel.innerHTML.trim() !== '') return;

  panel.innerHTML = '<div class="loading-ep">Carregando episódios...</div>';

  try {
    const res = await fetch(`/api/season/${tvId}/${seasonNumber}`);
    const data = await res.json();

    if (data.episodes && data.episodes.length > 0) {
      panel.innerHTML = data.episodes.map(ep => `
        <div class="episode-card" style="display:flex;gap:15px;margin-bottom:15px;background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;align-items:center;">
          <img src="${ep.still || ''}" alt="${escapeHtml(ep.name)}" style="width:120px;height:70px;object-fit:cover;border-radius:6px;" loading="lazy">
          <div class="ep-info" style="text-align:left;">
            <div class="ep-num" style="font-size:12px;color:#ff2d55;font-weight:bold;">Episódio ${ep.number}</div>
            <div class="ep-title" style="font-size:14px;font-weight:bold;color:#fff;">${escapeHtml(ep.name)}</div>
            <div class="ep-overview" style="font-size:12px;color:#aaa;margin-top:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${escapeHtml(ep.overview || 'Sem descrição.')}</div>
          </div>
        </div>
      `).join('');
    } else {
      panel.innerHTML = '<div class="empty" style="padding:10px;color:#aaa;">Nenhum episódio encontrado.</div>';
    }
  } catch (err) {
    panel.innerHTML = '<div class="empty" style="padding:10px;color:#aaa;">Erro ao carregar episódios.</div>';
  }
});

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
