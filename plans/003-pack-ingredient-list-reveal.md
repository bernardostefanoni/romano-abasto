# 003 — Animar el desplegable de ingredientes del pack

- **Status**: DONE
- **Commit**: 20540d3
- **Severity**: LOW-MEDIUM
- **Category**: Missed opportunity / Physicality
- **Estimated scope**: 1 file (PackCard.jsx)

## Problem

En la card de un pack, el chevron "▼" ya rota correctamente al expandir (`transition-transform`), pero la lista de ingredientes que aparece debajo se monta/desmonta de golpe, sin transición — un salto de contenido dentro de la misma card.

```jsx
// src/components/PackCard.jsx:45-78 — actual
{components.length > 0 && (
  <div className="mt-2">
    <button
      onClick={() => setExpanded(!expanded)}
      className="flex items-center gap-1.5 text-xs font-medium text-leaf hover:text-leafLight transition-colors"
    >
      <span className={`inline-block transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
      {expanded ? 'Ocultar' : `Ver ${components.length} productos`}
    </button>

    {expanded && (
      <ul className="mt-3 space-y-1.5 rounded-lg bg-creamDark/50 p-3 max-h-56 overflow-y-auto">
        {components.map((c, i) => (
          <li key={i} className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span className="font-tag font-bold text-leaf shrink-0">
                {c.cantidad}
              </span>
              <span className="text-[10px] text-charcoal/40 shrink-0">
                {c.unidad}
              </span>
              <span className="text-charcoal truncate">{c.sku}</span>
            </div>
            {c.precio_unit > 0 && (
              <span className="tag-price text-xs whitespace-nowrap">
                ${formatPrice(Math.round(c.precio_unit * c.cantidad))}
              </span>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
)}
```

## Target

Usar la técnica de grid `0fr → 1fr` para un reveal de altura variable sin medir con JS (el contenido no tiene una altura fija — depende de cuántos componentes tenga el pack). La `<ul>` deja de desmontarse condicionalmente; siempre está en el DOM, envuelta en un grid row que colapsa a 0 cuando `expanded` es `false`.

Agregar a `src/index.css`, dentro de `@layer components` (después del bloque `.mobile-menu` del plan 002, o después de `.stepper-btn` si ese plan no se ejecutó todavía):

```css
/* target — nuevo bloque en src/index.css, dentro de @layer components */
.pack-reveal {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 200ms var(--ease-out);
}
.pack-reveal.is-open {
  grid-template-rows: 1fr;
}
.pack-reveal > div {
  overflow: hidden;
}
```

Asegurar en `:root` (mismo mecanismo que el plan 002 — crear el bloque si no existe, o solo agregar la variable si falta):

```css
:root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
}
```

En `src/components/PackCard.jsx`, reemplazar el `{expanded && (<ul>...</ul>)}` por un wrapper siempre montado:

```jsx
// src/components/PackCard.jsx:55-77 — target
<div className={`pack-reveal ${expanded ? 'is-open' : ''}`}>
  <div>
    <ul className="mt-3 space-y-1.5 rounded-lg bg-creamDark/50 p-3 max-h-56 overflow-y-auto">
      {components.map((c, i) => (
        <li key={i} className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <span className="font-tag font-bold text-leaf shrink-0">
              {c.cantidad}
            </span>
            <span className="text-[10px] text-charcoal/40 shrink-0">
              {c.unidad}
            </span>
            <span className="text-charcoal truncate">{c.sku}</span>
          </div>
          {c.precio_unit > 0 && (
            <span className="tag-price text-xs whitespace-nowrap">
              ${formatPrice(Math.round(c.precio_unit * c.cantidad))}
            </span>
          )}
        </li>
      ))}
    </ul>
  </div>
</div>
```

## Repo conventions to follow

- Mismo token `--ease-out` introducido en el plan 002 — si ese plan ya corrió, no duplicar la variable en `:root`.
- Los estilos reutilizables van en `@layer components` de `src/index.css`, igual que `.mobile-menu`, `.btn-primary`, etc.

## Steps

1. En `src/index.css`, asegurar que `:root` contenga `--ease-out: cubic-bezier(0.23, 1, 0.32, 1);` (crear el bloque si hace falta, sin duplicar si el plan 002 ya lo agregó).
2. En `src/index.css`, dentro de `@layer components`, agregar el bloque `.pack-reveal` citado arriba.
3. En `src/components/PackCard.jsx`, líneas 55-77, reemplazar `{expanded && (<ul>...)}` por el wrapper `<div className={\`pack-reveal ${expanded ? 'is-open' : ''}\`}><div><ul>...</ul></div></div>` mostrado en el target, manteniendo el contenido interno de la `<ul>` sin cambios.

## Boundaries

- No tocar el botón del chevron (líneas 47-53) — ya está bien.
- No cambiar la lógica de `useState(expanded)`.
- No agregar dependencias nuevas.
- Si el código citado no coincide con lo que hay en el archivo (cambió desde `20540d3`), PARAR y reportar.

## Verification

- **Mecánica**: `npm run build` sin errores.
- **Feel check**: en `npm run dev`, ir a `/packs`, abrir un pack con componentes y confirmar:
  - La lista se despliega con una transición suave de altura (no aparece de golpe), y se pliega igual de suave al cerrar.
  - Probar con un pack de pocos componentes y uno de varios (si existen) para confirmar que la altura variable funciona sin recortar contenido.
  - En DevTools → Animations, bajar el playback a 10% y confirmar que no hay parpadeo ni salto brusco al final de la transición.
  - Activar `prefers-reduced-motion` y confirmar que el desplegable sigue funcionando (puede ser instantáneo, pero no debe romperse ni quedar oculto para siempre).
- **Done when**: el desplegable de ingredientes anima su apertura/cierre y el build pasa.
