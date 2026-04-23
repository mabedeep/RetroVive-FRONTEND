# Manual de Creación y Edición de Temas

RetroFront utiliza un sistema de temas basado en **CSS Variables** inyectadas dinámicamente. Esto permite cambiar el aspecto completo de la interfaz sin tocar la lógica del programa.

## Archivos Clave
1. `src/index.css`: Contiene los estilos y las definiciones de los temas.
2. `src/constants.ts`: Contiene la lista de temas que aparecen en el menú de ajustes.

## Estructura de un Tema
Un tema se define por un bloque de variables CSS aplicado a un `data-theme`.

### Variables Disponibles:
- `--bg-primary`: Color de fondo principal de las pantallas.
- `--bg-secondary`: Color de fondo de tarjetas, paneles y elementos secundarios.
- `--accent`: Color de resalte (el color "protagonista" del sistema).
- `--text-main`: Color del texto principal.
- `--text-dim`: Color del texto secundario o descripciones.

## Ejemplo: Crear el tema "Cyberpunk"

### Paso 1: Definir el CSS
Añade esto al final de `src/index.css`:

```css
[data-theme='cyberpunk'] {
  --bg-primary: #02020a;
  --bg-secondary: #0d0d1a;
  --accent: #fcee0a; /* Amarillo neón */
  --text-main: #00ff9f; /* Verde neon */
  --text-dim: #711c91;  /* Púrpura */
}
```

### Paso 2: Registrar el tema
En `src/constants.ts`, añade el ID al array `THEMES`:

```typescript
export const THEMES = [
  { id: 'default', name: 'Retro Dark' },
  { id: 'classic', name: 'Classic Blue' },
  { id: 'modern', name: 'Modern Glass' },
  { id: 'cyberpunk', name: 'Cyberpunk 2077' }, // <--- Nuevo tema
];
```

## Tips para Diseñar Temas
1. **Fondo de Sistema**: Puedes asignar fondos específicos por sistema en la configuración. El tema debe armonizar con esos fondos.
2. **Contraste**: Asegúrate de que `--accent` sea legible sobre `--bg-primary`.
3. **Transparencias**: Puedes usar RGBA en las variables si quieres efectos de cristal o transparencia.
   Ejemplo: `--bg-secondary: rgba(255, 255, 255, 0.1);`
