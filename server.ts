import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { spawn } from 'child_process';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: Launch Game with RetroArch or Standalone
  app.post('/api/launch', (req, res) => {
    const { path: romPath, systemId } = req.body;
    
    if (!romPath) return res.status(400).json({ error: 'ROM path is required' });

    const absoluteRomPath = romPath.startsWith('/') 
      ? path.join(__dirname, 'public', romPath)
      : path.join(__dirname, 'public/roms', systemId, romPath);

    console.log(`Launching: ${absoluteRomPath}`);

    // Load system database
    const systemDbPath = path.join(__dirname, 'src/system_db.json');
    let systemDb: any = {};
    if (fs.existsSync(systemDbPath)) {
      systemDb = JSON.parse(fs.readFileSync(systemDbPath, 'utf8'));
    }

    const systemInfo = systemDb[systemId];
    let command = 'retroarch';
    let args: string[] = [];

    if (systemInfo) {
      if (systemInfo.standalone) {
        // Run with standalone emulator
        command = systemInfo.standalone;
        args = [absoluteRomPath];
      } else if (systemInfo.core) {
        // Run with RetroArch core
        args = ['-L', systemInfo.core, absoluteRomPath];
      } else {
        // Default to RetroArch auto-detect
        args = [absoluteRomPath];
      }
    } else {
      // Default fallback
      args = [absoluteRomPath];
    }
    
    try {
      const emulator = spawn(command, args);

      emulator.on('error', (err) => {
        console.error(`Failed to start ${command}:`, err);
        res.status(500).json({ error: `Could not find ${command}. Make sure it is in your PATH.` });
      });

      emulator.on('close', (code) => {
        console.log(`${command} exited with code ${code}`);
        res.json({ success: true, code });
      });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // API: Get current systems
  app.get('/api/systems', (req, res) => {
    const configPath = path.join(__dirname, 'src/constants.ts');
    res.json({ message: "Ready to manage systems" });
  });

  // API: Get music list
  app.get('/api/music', (req, res) => {
    const musicDir = path.join(__dirname, 'public/musica');
    if (!fs.existsSync(musicDir)) {
      fs.mkdirSync(musicDir, { recursive: true });
      // Add a dummy file if empty for first run
    }
    
    const files = fs.readdirSync(musicDir)
      .filter(file => ['.mp3', '.ogg', '.wav', '.m4a'].includes(path.extname(file).toLowerCase()));
    
    res.json(files);
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
