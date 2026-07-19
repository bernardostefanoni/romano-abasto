# 004 — Agregar feedback visual al badge del carrito cuando cambia

- **Status**: DONE
- **Commit**: 20540d3
- **Severity**: LOW
- **Category**: Missed opportunity (delight)
- **Estimated scope**: 2 files (Header.jsx, index.css)

## Problem

El badge numérico del carrito en el header cambia de valor cada vez que se agrega o quita un producto, pero no tiene ningún feedback visual — el número simplemente se re-renderiza. Es una interacción de frecuencia ocasional/media (cada vez que se agrega algo al carrito, no en cada tecla ni cada scroll), así que un pequeño "pop" de escala al cambiar es un candidato razonable de delight, no de exceso.

```jsx
// src/components/Header.jsx:53-61 — actual
<Link to="/carrito" className="relative flex items-center gap-1.5 text-sm font-semibold text-leaf">
  <span aria-hidden>🧺</span>
  <span className="hidden sm:inline">Carrito</span>
  {totalItems > 0 && (
    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-crate text-[11px] font-bold text-cream">
      {totalItems}
    </span>
  )}
</Link>
```

## Target

Un keyframe corto de escala (pop) que se retriggerea remontando el `<span>` del badge con `key={totalItems}` — al cambiar `totalItems`, React desmonta y monta un nuevo nodo, lo que reinicia la animación CSS de forma limpia (no es una animación interrumpible a mitad de camino como un toast o un drag, es un pulso de una sola vez por cambio discreto de valor, así que un keyframe es apropiado acá).

Agregar a `src/index.css`, dentro de `@layer components` (después de los bloques de los planes anteriores que hayan corrido, o después de `.stepper-btn` si ninguno corrió todavía):

```css
/* target — nuevo bloque en src/index.css, dentro de @layer components */
.cart-badge {
  animation: cart-badge-pop 200ms var(--ease-in-out);
}
@keyframes cart-badge-pop {
  0% { transform: scale(1); }
  40% { transform: scale(1.35); }
  100% { transform: scale(1); }
}
```

Asegurar en `:root` (mismo mecanismo idempotente que los planes 002/003 — agregar solo si falta):

```css
:root {
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
}
```

En `src/components/Header.jsx`:

```jsx
// src/components/Header.jsx:53-61 — target
<Link to="/carrito" className="relative flex items-center gap-1.5 text-sm font-semibold text-leaf">
  <span aria-hidden>🧺</span>
  <span className="hidden sm:inline">Carrito</span>
  {totalItems > 0 && (
    <span
      key={totalItems}
      className="cart-badge absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-crate text-[11px] font-bold text-cream"
    >
      {totalItems}
    </span>
  )}
</Link>
```

## Repo conventions to follow

- Mismo patrón de `@layer components` en `src/index.css` que el resto de las clases reutilizables.
- `--ease-in-out` se usa acá (no `--ease-out`) porque es un morph de ida y vuelta sobre el mismo elemento (scale up y back down), no una entrada/salida — según la tabla de decisión de easing del audit ("Moving / morphing on screen → ease-in-out").

## Steps

1. En `src/index.css`, asegurar que `:root` contenga `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);` (agregar solo si no está ya presente por otro plan).
2. En `src/index.css`, dentro de `@layer components`, agregar el bloque `.cart-badge` + el `@keyframes cart-badge-pop` citados arriba.
3. En `src/components/Header.jsx`, línea 57 (el `<span>` del badge), agregar `key={totalItems}` y la clase `cart-badge` al `className` existente, sin quitar ninguna de las clases actuales.

## Boundaries

- No tocar el ícono 🧺 ni el texto "Carrito".
- No cambiar cómo se calcula `totalItems` (viene de `useCart()`, no tocar `CartContext.jsx`).
- No agregar dependencias nuevas.
- Si el bloque citado de `Header.jsx` no coincide con el código actual, PARAR y reportar.

## Verification

- **Mecánica**: `npm run build` sin errores.
- **Feel check**: en `npm run dev`, ir a `/productos`, agregar un producto y confirmar:
  - El número del badge aparece/cambia con un pulso de escala breve, no un cambio instantáneo.
  - Agregar varios productos seguidos rápido y confirmar que no se rompe ni queda un número "pegado" a mitad de animación.
  - En DevTools → Animations, bajar el playback a 10% y confirmar que el pop es sutil (no exagerado) y dura ~200ms.
  - Activar `prefers-reduced-motion` y confirmar que el badge sigue mostrando el número correcto aunque sin el pop (o con un pop mínimo) — no debe desaparecer.
- **Done when**: el badge anima un pop al cambiar de valor y el build pasa.
