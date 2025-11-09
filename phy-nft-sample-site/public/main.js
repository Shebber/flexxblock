(async function () {
  const app = document.querySelector('main.wrap');

  // Fallback-Sicherheitscheck
  if (!app) {
    console.error("⚠️ Kein <main class='wrap'> im DOM gefunden – Abbruch.");
    return;
  }

  function byId(id) { return document.getElementById(id); }

  async function loadData() {
   const res = await fetch('/data/artworks.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Kann /data/artworks.json nicht laden');
    return res.json();
  }

  function currentId() {
    const parts = location.pathname.replace(/^\/+|\/+$/g, '').split('/');
    const idx = parts.indexOf('verify');
    return (idx >= 0 && parts[idx + 1]) ? parts[idx + 1] : '001';
  }

  function safe(x) { return String(x ?? ''); }

  async function render() {
    let data;
    try {
      data = await loadData();
    } catch (e) {
      app.innerHTML = `<div style="padding:24px;color:#fff">
        Fehler: ${e.message}
      </div>`;
      return;
    }

    const id = currentId();
    const art = data[id];

    if (!art) {
      app.innerHTML = `<div style="padding:24px;color:#fff">
        <h2>Artwork nicht gefunden</h2>
        <div class="muted">ID: ${id}</div>
      </div>`;
      return;
    }

    // Bild
    const img = byId('artImage');
    if (img) {
      img.src = safe(art.image);
      img.alt = safe(art.title);
    }

    // Textfelder
    byId('title').textContent = safe(art.title);
    byId('chain').textContent = safe(art.chain);
    const contractEl = byId('contract')?.querySelector('.code');
    if (contractEl) contractEl.textContent = safe(art.contract);
    byId('token').textContent = `#${safe(art.tokenId)}`;
    const ownerEl = byId('owner')?.querySelector('.code');
    if (ownerEl) ownerEl.textContent = safe(art.owner);
    byId('mkt').href = safe(art.opensea || '#');
    byId('ipfs').href = safe(art.ipfs || '#');
    byId('notes').textContent = safe(art.notes || '');
  }

  await render();
})();
