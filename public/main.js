(async function () {
  const app = document.querySelector('main.wrap');
  if (!app) { console.error("Kein <main class='wrap'> gefunden."); return; }

  function byId(id){ return document.getElementById(id); }
  const safe = (x) => String(x ?? '');

  async function loadData(){
    const res = await fetch('/api/data', { cache: 'no-store' });
    if(!res.ok) throw new Error(`Kann /api/data nicht laden (Status ${res.status})`);
    return res.json();
  }

  function currentId(){
    const parts = location.pathname.replace(/^\/+|\/+$/g,'').split('/');
    const idx = parts.indexOf('verify');
    return (idx>=0 && parts[idx+1]) ? parts[idx+1] : '001';
  }

  async function render(){
    let data;
    try { data = await loadData(); }
    catch(e){
      app.innerHTML = `<div style="padding:24px;color:#fff">Fehler: ${e.message}</div>`;
      console.error(e); return;
    }

    const id = currentId();
    const art = data[id];
    if(!art){
      app.innerHTML = `<div style="padding:24px;color:#fff"><h2>Artwork nicht gefunden</h2><div class="muted">ID: ${id}</div></div>`;
      return;
    }

    // Bild absolut referenzieren
    const img = byId('artImage');
    if (img) {
      let p = safe(art.image);
      if (!/^https?:\/\//i.test(p)) p = '/' + p.replace(/^\/+/, '');
      img.src = p;
      img.alt = safe(art.title);
    }

    // Texte
    byId('title').textContent   = safe(art.title);
    byId('chain').textContent   = safe(art.chain);
    byId('token').textContent   = safe(art.tokenId);

    const cEl = byId('contract')?.querySelector('.code');
    if (cEl) cEl.textContent = safe(art.contract);

    const oEl = byId('owner')?.querySelector('.code');
    if (oEl) oEl.textContent = safe(art.owner);

    // Links
    byId('mkt').href = safe(art.opensea || '#');
    let ipfs = safe(art.ipfs || '#');
    if (ipfs.startsWith('ipfs://')) ipfs = ipfs.replace('ipfs://','https://ipfs.io/ipfs/');
    byId('ipfs').href = ipfs;

    // Notes
    byId('notes').textContent = safe(art.notes || '');
  }

  await render();
})();
