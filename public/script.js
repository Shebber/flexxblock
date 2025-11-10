(async function () {
  const app = document.querySelector('#app');

  async function render() {
    const path = location.pathname.replace(/^\/+|\/+$/g, '').split('/');
    if (path[0] === 'verify' && path[1]) {
      return renderVerify(path[1]);
    }
    return renderLanding();
  }

  function setHTML(html) {
    app.innerHTML = html;
  }

  async function loadData() {
    const res = await fetch('/data/artworks.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Daten nicht gefunden');
    return res.json();
  }

  function brand() {
    return `
      <div class="header">
        <div class="logo">Φ</div>
        <div class="brand">PHY•NFT</div>
      </div>`;
  }

  function renderLanding() {
    const baseURL = location.origin;
    const demoURL = baseURL + '/verify/001';
    setHTML(`
      ${brand()}
      <div class="container grid">
        <div class="card">
          <div class="badge">MVP • Scan-to-Verify</div>
          <h1 class="h1">Physische Kunst, digitale Identität</h1>
          <p class="lead">Scanne das Werk mit deinem Smartphone oder öffne die Verify-URL. Dieses MVP rendert Metadaten aus einer lokalen JSON-Datei.</p>
          <div class="flex">
            <a class="btn" href="./verify/001">Demo ansehen</a>
            <button class="btn copy" onclick="navigator.clipboard.writeText('${demoURL}')">Demo-URL kopieren</button>
          </div>
        </div>
        <div class="hero card"><img src="./assets/placeholder.svg" alt="Artwork placeholder"></div>
      </div>
    `);
  }

  async function renderVerify(id) {
    let data, item;
    try {
      data = await loadData();
      item = data[id];
    } catch (e) {}

    if (!item) {
      return setHTML(`
        ${brand()}
        <div class="container">
          <div class="card alert err">
            <b>Artwork nicht gefunden.</b><br>
            ID: <span class="code">${id}</span>
          </div>
        </div>
      `);
    }

    const shareURL = location.origin + '/verify/' + encodeURIComponent(id);
    setHTML(`
      ${brand()}
      <div class="container grid">
        <div class="card">
          <div class="badge">Verify • ID ${id}</div>
          <h1 class="h1">${item.title}</h1>
          <div class="kv"><div class="k">Chain</div><div>${item.chain}</div></div>
          <div class="kv"><div class="k">Contract</div><div class="code">${item.contract}</div></div>
          <div class="kv"><div class="k">Token</div><div>#${item.tokenId}</div></div>
          <div class="kv"><div class="k">Owner</div><div class="code">${item.owner}</div></div>
          <div class="kv"><div class="k">IPFS</div><div class="code">${item.ipfs}</div></div>
          <div class="flex" style="margin-top:14px">
            ${item.opensea ? `<a class="btn" target="_blank" href="${item.opensea}">Auf Marktplatz ansehen</a>` : ''}
            <button class="btn copy" onclick="navigator.clipboard.writeText('${shareURL}')">Link kopieren</button>
          </div>
        </div>
        <div class="hero card"><img src="./${item.image}" alt="Artwork image"></div>
      </div>
    `);
  }

  await render();
  window.addEventListener('popstate', render);
})();
