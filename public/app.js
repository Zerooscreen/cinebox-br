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
