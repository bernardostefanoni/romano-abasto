# 005 — Fade-in suave al terminar de cargar productos y packs

- **Status**: TODO
- **Commit**: 20540d3
- **Severity**: LOW
- **Category**: Missed opportunity
- **Estimated scope**: 2 files (Productos.jsx, PackDetail.jsx)

## Problem

Cuando termina de cargar la data (`loading` pasa de `true` a `false`), el texto "Cargando productos..."/"Cargando pack..." es reemplazado de golpe por el contenido real — un salto instantáneo. Es una interacción que ocurre una vez por visita a la página (ocasional), buena candidata para un fade rápido que suavice el cambio sin demorar la percepción de velocidad.

```jsx
// src/pages/Productos.jsx:50-58 — actual
{loading ? (
  <div className="flex items-center justify-center py-20 text-sm text-charcoal/50">
    Cargando productos...
  </div>
) : error ? (
  <div className="rounded-card border border-crate/30 bg-crate/5 p-6 text-sm text-crateDark">
    No se pudieron cargar los productos. Intentá de nuevo más tarde.
  </div>
) : (
  <>
```

```jsx
// src/pages/PackDetail.jsx:23-29 — actual
if (loading) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 text-sm text-charcoal/50">
      Cargando pack...
    </div>
  )
}
```

## Target

Agregar una clase utilitaria de fade-in de una sola vez (no un toggle, solo se aplica al montar el contenido cargado) al contenedor que se muestra cuando `loading` es `false`.

Agregar a `src/index.css`, dentro de `@layer components` (después de los bloques de planes anteriores que hayan corrido, o después de `.stepper-btn` si es el primero en correr):

```css
/* target — nuevo bloque en src/index.css, dentro de @layer components */
.content-fade-in {
  animation: content-fade-in 200ms var(--ease-out) both;
}
@keyframes content-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

Asegurar en `:root` (mismo mecanismo idempotente que los planes 002/003/004):

```css
:root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
}
```

En `src/pages/Productos.jsx`, envolver el `<>...</>` que se muestra cuando termina de cargar (líneas 59-95 actuales, el `<Fragment>` con los filtros de categoría y la grilla) agregando la clase al primer elemento real dentro del fragment:

```jsx
// src/pages/Productos.jsx:59-61 — target (solo la apertura del bloque cambia)
) : (
  <div className="content-fade-in">
    <div className="mb-8 flex flex-wrap gap-2">
```

Y cerrar el nuevo `<div>` donde hoy cierra el `<>` (reemplazar el `</>` de cierre del bloque por `</div>`).

En `src/pages/PackDetail.jsx`, agregar la clase al contenedor raíz que se renderiza cuando ya cargó y el pack existe:

```jsx
// src/pages/PackDetail.jsx:41 — target
<div className="content-fade-in mx-auto max-w-5xl px-4 py-10 sm:px-6">
```

## Repo conventions to follow

- Mismo patrón `@layer components` + variable `--ease-out` que los planes 002/003/005 (no duplicar la declaración de `:root` si ya existe).
- `both` en el `animation-fill-mode` para que el elemento arranque en `opacity: 0` incluso antes de que la animación empiece a correr (evita un parpadeo de opacity:1 → 0 → 1).

## Steps

1. En `src/index.css`, asegurar que `:root` contenga `--ease-out: cubic-bezier(0.23, 1, 0.32, 1);` (agregar solo si falta).
2. En `src/index.css`, dentro de `@layer components`, agregar el bloque `.content-fade-in` + `@keyframes content-fade-in` citados arriba.
3. En `src/pages/Productos.jsx`, reemplazar el `<>` de apertura (línea ~59, el que sigue al `) : (` del bloque `loading ? ... : error ? ... : (`) por `<div className="content-fade-in">`, y su `</>` de cierre correspondiente (línea ~95) por `</div>`. No tocar el contenido interno.
4. En `src/pages/PackDetail.jsx`, línea 41, agregar `content-fade-in` al `className` del `<div>` raíz (el que empieza con `mx-auto max-w-5xl...`), sin quitar ninguna clase existente.

## Boundaries

- No tocar los estados de `loading`/`error` en sí, ni los hooks `useProducts`/`usePacks`.
- No aplicar el fade al estado de "Cargando..." ni al de error — solo al contenido ya cargado.
- No agregar dependencias nuevas.
- Si las líneas citadas no coinciden con el código actual (cambió desde `20540d3`), PARAR y reportar.

## Verification

- **Mecánica**: `npm run build` sin errores.
- **Feel check**: en `npm run dev`, recargar `/productos` y `/packs/:id` (con throttling de red en DevTools para ver el estado de carga más tiempo) y confirmar:
  - El contenido aparece con un fade rápido, no de golpe.
  - No hay parpadeo (flash de opacity 1 antes de la animación).
  - En DevTools → Animations, confirmar que dura ~200ms.
  - Activar `prefers-reduced-motion` y confirmar que el contenido igual aparece (puede ser instantáneo) — nunca debe quedar en opacity 0 permanente.
- **Done when**: ambas páginas muestran un fade-in al terminar de cargar y el build pasa.
