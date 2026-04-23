# RetroFront UI - Manual de Configuración

Este documento explica cómo configurar tus juegos, archivos de metadatos (gamelist.xml), multimedia y temas para que RetroFront los reconozca correctamente.

---

## 1. Estructura de Directorios y Archivos

Todos tus juegos y multimedia deben ir dentro de la carpeta **`public/`** que se encuentra en la raíz del proyecto. El navegador solo puede leer archivos que estén en esta carpeta o sus subcarpetas.

### Ubicación de ROMs y Gamelist
Para cada sistema (ej. SNES), debes crear su carpeta correspondiente dentro de `/roms`. El archivo `gamelist.xml` debe estar en la raíz de dicha carpeta.

**Ruta completa:** `public/roms/{sistema}/gamelist.xml`

**Ejemplo para SNES:**
- `public/roms/snes/gamelist.xml` (El archivo de metadatos)
- `public/roms/snes/Super Mario World.zip` (Tu juego)

### Ubicación de Multimedia (Media)
La media se organiza por sistema y categoría. Los nombres de los archivos de imagen o vídeo deben coincidir exactamente con el nombre del juego que aparece en la ruta del `gamelist.xml`.

**Ruta completa:** `public/media/{sistema}/{categoría}/nombre_juego.png`

**Categorías recomendadas:**
- `public/media/snes/box2d/`: Carátulas (PNG)
- `public/media/snes/fanart/`: Fondos (JPG)
- `public/media/snes/video/`: Tráilers (MP4)

---

### Música de Fondo (BGM)
Puedes poner tus canciones favoritas para que suenen mientras navegas por los menús.
- **Ubicación**: `public/musica/`
- **Formatos**: .mp3, .ogg, .wav, .m4a
- **Funcionamiento**: El programa detecta automáticamente todos los archivos en esa carpeta y los reproduce de forma aleatoria. Puedes activar/desactivar la música y ajustar su volumen independientemente desde el menú de ajustes.

---

### Logos de los Sistemas
Para los logotipos que aparecen en el selector de sistemas, el programa los busca automáticamente en este orden de prioridad:
1. `public/media/sistemas/logos/{id_sistema}.png` (Recomendado, usa nombres cortos como `snes`, `megadrive`, `mame`).
2. La ruta definida en `src/constants.ts`.
3. `public/media/{carpeta_sistema}/logo.png`.

---

## 2. Agregar Nuevos Sistemas

Para añadir un sistema (por ejemplo, Mega Drive), debes editar el archivo:
`src/constants.ts`

Añade un objeto al array `SYSTEMS`:

```typescript
{
  id: 'megadrive',
  name: 'Mega Drive',
  fullname: 'Sega Mega Drive / Genesis',
  manufacturer: 'SEGA',
  releaseYear: 1988,
  logo: 'megadrive_logo.png',     // Debe estar en /media/logos/
  background: 'megadrive_bg.jpg', // Debe estar en /media/megadrive/
  folder: 'megadrive',            // Nombre de la carpeta en /roms y /media
  type: 'console',
}
```

---

## 3. Instalación de RetroArch

Si no tienes RetroArch instalado, sigue estos pasos según tu sistema:

### Windows:
1. Descarga el instalador desde [retroarch.com](https://www.retroarch.com/?page=platforms).
2. Ejecuta el instalador y sigue los pasos.
3. Abre RetroArch y ve a **Actualizador en línea** > **Actualizador de núcleos** para descargar los emuladores que necesites (ej. Snes9x).

### Linux (Ubuntu/Debian):
```bash
sudo add-apt-repository ppa:libretro/stable
sudo apt update
sudo apt install retroarch
```

---

## 4. Guía de Temas (Themes)

Los temas se gestionan mediante variables de CSS y el atributo `data-theme` en el elemento raíz.

### ¿Dónde están los temas?
- Las variables de color están en: `src/index.css`.
- La lista de temas disponibles está en: `src/constants.ts` (array `THEMES`).

### Cómo crear un tema nuevo:
1. Abre `src/index.css`.
2. Define las variables para tu nuevo tema:

```css
[data-theme='mi-tema-nuevo'] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2a2a2a;
  --accent: #ff00ff;
  --text-main: #ffffff;
  --text-dim: #888888;
}
```

3. Registra el tema en `src/constants.ts`:
```typescript
{ id: 'mi-tema-nuevo', name: 'Mi Tema Personalizado' }
```

### Cómo editar temas existentes:
Simplemente cambia los valores de las variables CSS correspondientes al `id` del tema que quieras modificar en `src/index.css`.

---

## 5. Ejecución Automática
Puedes usar los scripts de la raíz para configurar todo con un clic:
- **Windows**: Pulsa doble clic en `setup-and-run.bat`.
- **Linux**: Ejecuta `./setup-and-run.sh` en la terminal.

---

## 6. Instalar como Servicio (Solo Linux)
Si quieres que RetroFront se inicie automáticamente cada vez que enciendas tu PC o servidor Linux:
1. Dale permisos: `chmod +x install-service.sh`
2. Ejecuta con sudo: `sudo ./install-service.sh`

Esto creará un servicio de sistema (`systemd`) llamado `retrofront` que se ejecutará en segundo plano.
- Para ver el estado: `systemctl status retrofront`
- Para ver los logs: `journalctl -u retrofront -f`
