// api/openapi.js (ou api/openapi.ts si vous utilisez TypeScript)
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs/promises'; // Utilisation de fs.promises pour les opérations asynchrones

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const filePath = path.resolve(process.cwd(), 'public', 'openapi.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const openapi = JSON.parse(fileContents);
    res.status(200).json(openapi);
  } catch (error) {
    console.error('Failed to load openapi.json:', error);
    res.status(500).json({ message: 'Failed to load openapi.json' });
  }
}
