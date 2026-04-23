import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: Get current systems
  app.get('/api/systems', (req, res) => {
    const configPath = path.join(__dirname, 'src/constants.ts');
    // For simplicity in this demo, we read from the file or a separate JSON
    // In a real app, we'd use a dedicated systems.json
    res.json({ message: "Ready to manage systems" });
  });

  // API: Create new system structure
  app.post('/api/systems/create', (req, res) => {
    const { id, name, type } = req.body;
    if (!id) return res.status(400).json({ error: 'System ID is required' });

    const romPath = path.join(__dirname, 'public/roms', id);
    const mediaPath = path.join(__dirname, 'public/media', id);
    const systemsJsonPath = path.join(__dirname, 'public/systems.json');
    
    try {
      // Create directories
      [
        romPath,
        path.join(mediaPath, 'box2d'),
        path.join(mediaPath, 'fanart'),
        path.join(mediaPath, 'video'),
        path.join(mediaPath, 'logos')
      ].forEach(dir => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, '.gitkeep'), '# Placeholder');
        }
      });

      // Update systems.json
      if (fs.existsSync(systemsJsonPath)) {
        const systems = JSON.parse(fs.readFileSync(systemsJsonPath, 'utf8'));
        if (!systems.find((s: any) => s.id === id)) {
          systems.push({
            id,
            name,
            fullname: name,
            manufacturer: 'Auto-Created',
            releaseYear: new Date().getFullYear(),
            logo: `${id}.png`,
            background: `${id}_bg.jpg`,
            folder: id,
            type: type || 'console'
          });
          fs.writeFileSync(systemsJsonPath, JSON.stringify(systems, null, 2));
        }
      }

      res.json({ success: true, message: `Structure created and config updated for ${id}` });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
