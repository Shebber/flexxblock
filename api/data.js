import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'artworks.json');

  try {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);

    res.status(200).json(data);
  } catch (error) {
    console.error('Error loading JSON:', error);
    res.status(500).json({ error: 'Failed to load data' });
  }
}
