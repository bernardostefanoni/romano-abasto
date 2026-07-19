# 001 — Reemplazar `transition-all` por `transition-colors` en los botones "Agregar"

- **Status**: DONE
- **Commit**: 20540d3
- **Severity**: MEDIUM
- **Category**: Performance & Cohesión
- **Estimated scope**: 3 files, 1 line each

## Problem

Tres componentes distintos usan el mismo patrón para el botón "Agregar al carrito": cuando se agrega, el fondo cambia de color y el texto pasa a "✓ Listo"/"✓ Agregado" durante 1.5–2s (ver `setTimeout` en cada handler). Los tres usan `transition-all`, que anima todas las propiedades del elemento (incluyendo cualquiera que cambie por otro motivo — layout, sombra, etc.), no solo el color que realmente está cambiando. `transition: all` siempre es un hallazgo de performance porque puede animar propiedades fuera de GPU sin que el autor lo note.

Ubicaciones exactas:

```jsx
// src/components/ProductCard.jsx:135 — actual
className={`w-full rounded-full px-3 py-2 text-xs font-semibold text-cream transition-all sm:w-auto ${
  agregado
    ? 'bg-mustard'
    : 'bg-leaf hover:bg-leafLight'
}`}
```

```jsx
// src/components/PackCard.jsx:83 — actual
className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold text-cream transition-all ${
  agregado ? 'bg-mustard' : 'bg-leaf hover:bg-leafLight'
}`}
```

```jsx
// src/pages/PackDetail.jsx:87 — actual
className={`rounded-full px-6 py-3 text-sm font-semibold text-cream transition-all ${
  agregado ? 'bg-mustard' : 'bg-crate hover:bg-crateDark'
}`}
```

## Target

Cambiar únicamente la clase `transition-all` → `transition-colors` en los tres lugares. No cambia ningún otro valor (duración/easing quedan en el default de Tailwind, que es correcto para hover/cambio de color según el estándar: `ease` implícito, 150ms).

```jsx
// src/components/ProductCard.jsx:135 — target
className={`w-full rounded-full px-3 py-2 text-xs font-semibold text-cream transition-colors sm:w-auto ${
  agregado
    ? 'bg-mustard'
    : 'bg-leaf hover:bg-leafLight'
}`}
```

```jsx
// src/components/PackCard.jsx:83 — target
className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold text-cream transition-colors ${
  agregado ? 'bg-mustard' : 'bg-leaf hover:bg-leafLight'
}`}
```

```jsx
// src/pages/PackDetail.jsx:87 — target
className={`rounded-full px-6 py-3 text-sm font-semibold text-cream transition-colors ${
  agregado ? 'bg-mustard' : 'bg-crate hover:bg-crateDark'
}`}
```

## Repo conventions to follow

- El resto del proyecto ya usa `transition-colors` para todo cambio de color en hover (ver `src/components/Header.jsx:41`, `src/index.css:18` `.btn-primary`). Este fix simplemente alinea estos 3 botones con esa convención existente.

## Steps

1. En `src/components/ProductCard.jsx:135`, reemplazar la palabra `transition-all` por `transition-colors` (una sola palabra, sin tocar nada más de la línea).
2. En `src/components/PackCard.jsx:83`, mismo reemplazo.
3. En `src/pages/PackDetail.jsx:87`, mismo reemplazo.

## Boundaries

- No tocar el `setTimeout` ni la lógica de `agregado`/`handleAgregar` en ninguno de los 3 archivos.
- No cambiar ningún otro texto, clase, o estructura JSX.
- No agregar dependencias nuevas.
- Si alguna de las 3 líneas no coincide exactamente con lo citado arriba (el código cambió desde el commit `20540d3`), PARAR y reportar en vez de improvisar.

## Verification

- **Mecánica**: `npm run build` debe terminar sin errores (es un cambio de una sola clase CSS, no debería afectar el build).
- **Feel check**: en `npm run dev`, abrir `/productos`, agregar un producto al carrito y confirmar:
  - El botón sigue cambiando de color a mostaza y el texto a "✓ Listo" igual que antes (el comportamiento visual no debería cambiar perceptiblemente).
  - En DevTools → pestaña Animations, verificar que ya no aparece "all" como propiedad animada, solo `background-color`/`color`.
  - Repetir en `/packs` (PackCard) y en el detalle de un pack (PackDetail) para confirmar los 3 casos.
- **Done when**: los 3 archivos usan `transition-colors` en vez de `transition-all`, y el build pasa sin errores.
