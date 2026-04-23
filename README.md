# RetroFront UI - Manual de Configuración

Este documento explica cómo configurar tus juegos, archivos de metadatos (gamelist.xml), multimedia y temas para que RetroFront los reconozca correctamente.

---

## 1. Estructura de Directorios

El programa busca los archivos en la carpeta `public/` (que es la raíz del servidor cuando ejecutas el proyecto).

### Directorio de ROMs y Gamelist
Cada sistema tiene su propia subcarpeta dentro de `/roms`. El archivo `gamelist.xml` **DEBE** estar en la raíz de la carpeta del sistema.

**Ubicación:** `/roms/{sistema}/gamelist.xml`

**Ejemplo para SNES:**
- `roms/snes/gamelist.xml`
- `roms/snes/Super Mario World.zip`

### Estructura de Media
La multimedia se organiza por sistema y por tipo de archivo. El nombre del archivo de media debe coincidir exactamente con el nombre de la ROM (sin la extensión).

**Ubicación:** `/media/{sistema}/{tipo}/{romName}.{extension}`

**Tipos soportados:**
- `box2d/`: Carátulas 2D (.png)
- `box3d/`: Carátulas 3D (.png)
- `fanart/`: Fondos decorativos (.jpg)
- `logos/`: Logos del juego (.png)
- `marquee/`: Marquesinas (.png)
- `image/`: Capturas de pantalla (.jpg)
- `video/`: Vídeos de previsualización (.mp4)

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
