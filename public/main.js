(async function () {
  const app = document.querySelector('main.wrap');

  // Sicherstellen, dass das Ziel-Element existiert
  if (!app) {
    console.error("⚠️ Kein <main class='wrap'> im DOM gefunden – Abbruch.");
    return;
  }

  function byId(id) { return document.getElementById(id); }

  // JSON laden – absoluter Pfad, damit es auch bei /verify/... funktioniert
  async function loadData() {
    const res = await fetch('/api/data', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Kann /data/artworks.json nicht laden (Status ${res.status})`);
    }
    return res.json();
  }

  // ID aus der URL ermitteln (z. B. /verify/001 → "001")
  function currentId() {
    const parts = location.pathname.replace(/^\/+|\/+$/g, '').split('/');
    const idx = parts.indexOf('verify');
    return (idx >= 0 && parts[idx + 1]) ? parts[idx + 1] : '001';
  }

  // Sicherheitsfunktion gegen undefined/null
  function safe(x) { return String(x ?? ''); }

  // Haupt-Rendering
  async function render() {
    let data;
    try {
      data = await loadData();
    } catch (e) {
      app.innerHTML = `<div style="padding:24px;color:#fff">
        Fehler: ${e.message}
      </div>`;
      console.error(e);
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

    // Absoluter Bildpfad (wichtig bei /verify/…)
    const img = byId('artImage');
    if (img) {
      let imgPath = safe(art.image);
      if (!imgPath.startsWith('http')) {
        imgPath = '/' + imgPath.replace(/^\/+/, '');
      }
      img.src = imgPath;
      img.alt = safe(art.title);
    }

    // Textfelder
    byId('title').textContent = safe(art.title);
    byId('chain').textContent = safe(art.chain);

    const contractEl = byId('contract')?.querySelector('.code');
    if (contractEl) contractEl.textContent = safe(art.contract);

    byId('token').textContent = safe(art.tokenId);
    const ownerEl = byId('owner')?.querySelector('.code');
    if (ownerEl) ownerEl.textContent = safe(art.owner);

    // Marktplatz-Link
    byId('mkt').href = safe(art.opensea || '#');

    // IPFS-Link (kompatibel umwandeln)
    let ipfsLink = safe(art.ipfs || '#');
    if (ipfsLink.startsWith('ipfs://')) {
      ipfsLink = ipfsLink.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    byId('ipfs').href = ipfsLink;

    // Notizen
    byId('notes').textContent = safe(art.notes || '');
  }

  await render();
})();
