
(async function(){
  const app = document.querySelector('#app');
  const routes = {
    landing: renderLanding,
    verify: renderVerify,
    notfound: renderNotFound
  };

  function pathParts(){
    const p = location.pathname.replace(/^\/+|\/+$/g,'').split('/').filter(Boolean);
    return p.length ? p : [''];
  }

  async function render(){
    const parts = pathParts();
    if(parts[0]==='verify' && parts[1]){
      return routes.verify(parts[1]);
    }
    return routes.landing();
  }

  function setHTML(html){ app.innerHTML = html; }
  function copy(text){
    navigator.clipboard?.writeText(text).then(()=>{
      const el = document.querySelector('#copyHint');
      if(el){ el.textContent = 'kopiert ✔'; setTimeout(()=>el.textContent='', 1500); }
    });
  }

  function safe(t){ return String(t ?? '').replace(/[&<>]/g, s=>({ '&':'&amp;','<':'&lt;','>':'&gt;'}[s])); }

  async function loadData(){
    const r = await fetch('phy-nft-sample-site/data/artworks.json', {cache:'no-store'});
    if(!r.ok) throw new Error('Daten nicht gefunden');
    return r.json();
  }

  function brand(){
    return '<div class="header"><div class="logo">Φ</div><div class="brand">PHY•NFT</div></div>';
  }

  function renderLanding(){
    const baseURL = location.origin;
    const demoURL = baseURL + '/verify/001';
    setHTML(`
      ${brand()}
      <div class="container grid">
        <div class="card">
          <div class="badge">MVP • Scan-to-Verify</div>
          <h1 class="h1">Physische Kunst, digitale Identität</h1>
          <p class="lead">Scanne das Werk mit deinem Smartphone (NFC) oder öffne die Verify-URL auf der Rückseite. Dieses MVP rendert Metadaten aus einer lokalen JSON-Datei – ideal für dein erstes Sample.</p>
          <div class="flex">
            <a class="btn" href="/verify/001">Demo ansehen</a>
            <button class="btn copy" onclick="navigator.clipboard.writeText('${demoURL}');document.getElementById('copyHint').textContent='kopiert ✔';setTimeout(()=>document.getElementById('copyHint').textContent='',1500)">Demo-URL kopieren</button>
            <span id="copyHint" class="small"></span>
          </div>
          <div class="alert" style="margin-top:14px">
            <b>NFC-URL-Konvention:</b> <span class="code">${baseURL}/verify/&lt;id&gt;</span>
          </div>
          <div style="margin-top:18px" class="small">Tipp: Programmiere deinen ICODE SLIX2 Sticker mit der gewünschten ID (z. B. <span class="code">001</span>) und dem obigen URL‑Schema.</div>
        </div>
        <div class="hero card"><img src="assets/placeholder.svg" alt="Artwork placeholder"/></div>
      </div>
      <div class="container footer small">
        <div>© ${new Date().getFullYear()} PHY•NFT • Sample-Site • Ersetze Logo/Brand in <span class="code">index.html</span> & <span class="code">style.css</span></div>
      </div>
    `);
  }

  async function renderVerify(id){
    let data, item;
    try{
      data = await loadData();
      item = data[id];
    }catch(e){ /* ignore */ }
    if(!item){
      return setHTML(`
        ${brand()}
        <div class="container">
          <div class="card alert err">
            <b>Artwork nicht gefunden.</b><br/>ID: <span class="code">${safe(id)}</span><br/>
            Prüfe die URL oder ergänze die Datei <span class="code">/data/artworks.json</span>.
          </div>
        </div>
      `);
    }
    const shareURL = location.origin + '/verify/' + encodeURIComponent(id);
    setHTML(`
      ${brand()}
      <div class="container grid">
        <div class="card">
          <div class="badge">Verify • ID ${safe(id)}</div>
          <h1 class="h1">${safe(item.title)}</h1>
          <div class="kv"><div class="k">Chain</div><div>${safe(item.chain)}</div></div>
          <div class="kv"><div class="k">Contract</div><div class="code">${safe(item.contract)}</div></div>
          <div class="kv"><div class="k">Token</div><div>#${safe(item.tokenId)}</div></div>
          <div class="kv"><div class="k">Owner</div><div class="code">${safe(item.owner)}</div></div>
          <div class="kv"><div class="k">IPFS</div><div class="code">${safe(item.ipfs)}</div></div>
          <div class="flex" style="margin-top:14px">
            ${item.opensea ? `<a class="btn" target="_blank" rel="noopener" href="${safe(item.opensea)}">Auf Marktplatz ansehen</a>`:''}
            <button class="btn copy" onclick="navigator.clipboard.writeText('${shareURL}');document.getElementById('copyHint').textContent='kopiert ✔';setTimeout(()=>document.getElementById('copyHint').textContent='',1500)">Link kopieren</button>
            <span id="copyHint" class="small"></span>
          </div>
          ${item.notes ? `<div class="alert" style="margin-top:14px">${safe(item.notes)}</div>`:''}
          <div class="small" style="margin-top:16px">Hinweis: Daten werden clientseitig aus <span class="code">/data/artworks.json</span> geladen. Für Live‑Betrieb später an deine API/IPFS anbinden.</div>
        </div>
        <div class="hero card">
          <img src="${safe(item.image)}" alt="Artwork image"/>
        </div>
      </div>
      <div class="container footer small">
        <div>Scan‑to‑Verify • SLIX2 kompatibel • URL‑Schema: <span class="code">${location.origin}/verify/&lt;id&gt;</span></div>
      </div>
    `);
  }

  function renderNotFound(){
    setHTML(\`
      ${brand()}
      <div class="container"><div class="card alert err">Seite nicht gefunden.</div></div>
    \`);
  }

  // kick
  await render();

  // SPA-style navigation on back/forward
  window.addEventListener('popstate', render);

  // Delegate anchor clicks for internal links
  document.body.addEventListener('click', (e)=>{
    const a = e.target.closest('a');
    if(!a) return;
    const sameOrigin = a.origin === location.origin;
    const internal = sameOrigin && a.getAttribute('href').startsWith('/');
    if(internal){
      e.preventDefault();
      history.pushState({}, '', a.href);
      render();
    }
  });
})();
