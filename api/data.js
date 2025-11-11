import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'artworks.json');
    const jsonData = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(jsonData);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(data);
  } catch (err) {
    console.error('Fehler beim Lesen von artworks.json:', err);
    res.status(500).json({ error: 'Fehler beim Laden der Daten' });
  }
}
