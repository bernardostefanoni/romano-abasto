# 002 — Animar la entrada/salida del menú mobile

- **Status**: DONE
- **Commit**: 20540d3
- **Severity**: MEDIUM
- **Category**: Physicality & Missed opportunity
- **Estimated scope**: 2 files (Header.jsx, index.css)

## Problem

El menú mobile (hamburguesa) aparece y desaparece de golpe: es un simple mount/unmount condicional sin ninguna transición. Es una UI espacialmente conectada a su disparador (el botón hamburguesa) que hoy "teletransporta" en vez de indicar de dónde viene. Es una interacción ocasional (se abre pocas veces por sesión), así que según la tabla de frecuencia del audit merece animación estándar, no nada.

```jsx
// src/components/Header.jsx:76-96 — actual
{open && (
  <div className="border-t border-line bg-cream px-4 pb-4 md:hidden">
    <nav className="flex flex-col gap-3 pt-3">
      {navLinks.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `text-sm font-medium ${isActive ? 'text-crate' : 'text-charcoal'}`
          }
        >
          {l.label}
        </NavLink>
      ))}
      <Link to="/zonas" className="btn-primary mt-1 w-full" onClick={() => setOpen(false)}>
        Pedir ahora
      </Link>
    </nav>
  </div>
)}
```

## Target

Usar `@starting-style` + `transition-behavior: allow-discrete` (la técnica que el propio playbook de animaciones recomienda para animar la entrada de un elemento que pasa de `display: none` a visible, sin JS ni librerías). El elemento deja de desmontarse condicionalmente y en cambio se controla con un atributo `data-open`.

Agregar a `src/index.css`, dentro de `@layer components` (después de `.stepper-btn`):

```css
/* target — nuevo bloque en src/index.css, dentro de @layer components */
.mobile-menu {
  transition: opacity 200ms var(--ease-out), transform 200ms var(--ease-out), display 200ms allow-discrete;
}
.mobile-menu[data-open='true'] {
  display: block;
  opacity: 1;
  transform: translateY(0);
}
.mobile-menu:not([data-open='true']) {
  display: none;
  opacity: 0;
  transform: translateY(-8px);
}
@starting-style {
  .mobile-menu[data-open='true'] {
    opacity: 0;
    transform: translateY(-8px);
  }
}
```

Agregar a `src/index.css`, ANTES de `@layer base` (o al principio del archivo, después de las 3 líneas `@tailwind`), si no existe ya un bloque `:root` — si ya existe por haber ejecutado otro plan de esta serie primero, simplemente asegurarse de que contenga esta variable (no duplicar el bloque `:root`):

```css
/* target — agregar/asegurar en :root */
:root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
}
```

En `src/components/Header.jsx`, reemplazar el bloque condicional por un render incondicional con `data-open`:

```jsx
// src/components/Header.jsx:76-96 — target
<div className="mobile-menu border-t border-line bg-cream px-4 pb-4 md:hidden" data-open={open}>
  <nav className="flex flex-col gap-3 pt-3">
    {navLinks.map((l) => (
      <NavLink
        key={l.to}
        to={l.to}
        onClick={() => setOpen(false)}
        className={({ isActive }) =>
          `text-sm font-medium ${isActive ? 'text-crate' : 'text-charcoal'}`
        }
      >
        {l.label}
      </NavLink>
    ))}
    <Link to="/zonas" className="btn-primary mt-1 w-full" onClick={() => setOpen(false)}>
      Pedir ahora
    </Link>
  </nav>
</div>
```

## Repo conventions to follow

- Los componentes reutilizables ya viven en `@layer components` de `src/index.css` (ver `.btn-primary`, `.btn-secondary`, `.crate-card`, `.stepper-btn`). `.mobile-menu` sigue exactamente ese mismo patrón.
- El proyecto no tiene ninguna librería de animación instalada (Framer Motion, GSAP, etc.) y no debe agregarse una solo para este menú — por eso se usa CSS puro con `@starting-style`.

## Steps

1. En `src/index.css`, si no existe un bloque `:root` en el archivo, crear uno justo después de las 3 líneas `@tailwind` con la variable `--ease-out` de arriba. Si ya existe un `:root` (por ejecución de otro plan), agregarle la variable `--ease-out` solo si no está ya presente.
2. En `src/index.css`, dentro de `@layer components`, agregar el bloque `.mobile-menu` completo citado arriba, después de la regla `.stepper-btn` (línea 34-36 actual).
3. En `src/components/Header.jsx`, en las líneas 76-96, quitar la condición `{open && (...)}` y reemplazarla por el `<div>` incondicional con `className="mobile-menu ..."` y `data-open={open}` mostrado en el target. El contenido interno (el `<nav>` con los links y el botón "Pedir ahora") no cambia.

## Boundaries

- No tocar el botón hamburguesa (líneas 65-71) ni la lógica de `useState(open)`.
- No agregar Framer Motion, GSAP, ni ninguna otra dependencia — la solución es CSS puro.
- No cambiar el menú desktop (`nav` de las líneas 35-49).
- Si el archivo `src/components/Header.jsx` ya no coincide con el código citado (cambió desde el commit `20540d3`), PARAR y reportar.

## Verification

- **Mecánica**: `npm run build` sin errores. `@starting-style` y `transition-behavior: allow-discrete` requieren Chrome 117+/Safari 17.4+/Firefox 129+; en navegadores más viejos el menú simplemente aparece sin transición (fallback aceptable, no debe romper nada).
- **Feel check**: en `npm run dev`, achicar la ventana a un ancho mobile (`resize_window` a 375×812 o similar), tocar el botón hamburguesa y confirmar:
  - El menú aparece con un fade + leve desplazamiento hacia abajo (no aparece de golpe).
  - Al cerrar (tocar la hamburguesa de nuevo, o click en un link), desaparece con la misma transición en reversa.
  - En DevTools → Animations, bajar el playback a 10% y confirmar que la curva se siente "responsive" (rápida al inicio), no lenta al arrancar.
  - Activar `prefers-reduced-motion` (panel Rendering de DevTools) y confirmar que el menú igual aparece/desaparece (con `display` discreto) aunque sin el desplazamiento — como mínimo no debe quedar invisible o roto.
- **Done when**: el menú mobile abre y cierra con transición, no hay salto de layout visible, y el build pasa.
