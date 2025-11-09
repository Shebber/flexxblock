
# PHY•NFT – Scan‑to‑Verify (MVP)

Dieses Repo ist ein sofort nutzbares Gerüst für deine physischen Acryl‑NFT‑Prints mit NFC (z. B. **ICODE SLIX2** Sticker).

## NFC‑URL‑Schema
Programmiere jeden Sticker mit einer URL nach folgendem Muster:
```
https://DEINE-DOMAIN.xyz/verify/<id>
```
Beispiel: `https://yourbrand.xyz/verify/001`

## Dateien
- `index.html` – Single‑Page App, rendert Landing & Verify‑Ansicht
- `script.js` – Mini‑Router, lädt Metadaten aus `data/artworks.json`
- `style.css` – Dark Theme
- `data/artworks.json` – Mapping von `id` → Metadaten (Titel, Bild, Chain, usw.)
- `assets/placeholder.svg` – Platzhalterbild
- `_redirects` – Für Netlify o. ä., leitet alle Pfade auf `index.html` (SPA‑Routing)

## Metadaten bearbeiten
Öffne `data/artworks.json` und ergänze deine realen Daten, z. B.:
```json
{
  "001": {
    "title": "Genesis #1 – Acrylic",
    "image": "assets/dein-bild.jpg",
    "chain": "ApeChain",
    "contract": "0x...",
    "tokenId": "123",
    "owner": "0x...",
    "opensea": "https://opensea.io/assets/...",
    "ipfs": "ipfs://..."
  }
}
```

## Hosting
- **Netlify**: Ordner deployen, `_redirects` wird erkannt → `verify/<id>` funktioniert.
- **Vercel**: Als Single‑Page App deployen, „Rewrite to /index.html“ aktivieren.
- **GitHub Pages**: Ohne Rewrites öffne `/index.html?verify=001` oder nutze ein SPA‑Routing‑Plugin.

## Hinweise zum SLIX2‑Einsatz
- Vor Montage UID prüfen (App: *NXP TagInfo*).
- Nicht direkt an Metall platzieren, Abstand > 5 mm zu LED‑Streifen/Netzteilen.
- Typische Durchdringung: Acryl 3–4 mm noch zuverlässig lesbar.

## Optional: IPFS/EVM Lookup
Für den Livebetrieb kannst du statt `data/artworks.json`:
- Metadaten von IPFS holen (CID pro ID),
- oder eine kleine API bereitstellen, die Contract/Owner dynamisch abfragt.

Viel Spaß beim ersten Sample!
