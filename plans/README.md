# Planes de animación — romano-abasto

Generados por `improve-animations` sobre el commit `20540d3`.

| # | Plan | Severidad | Categoría | Status |
| --- | --- | --- | --- | --- |
| 001 | [Reemplazar `transition-all` por `transition-colors` en botones "Agregar"](001-fix-transition-all-agregar-buttons.md) | MEDIUM | Performance / Cohesión | TODO |
| 002 | [Animar la entrada/salida del menú mobile](002-mobile-menu-entrance.md) | MEDIUM | Physicality / Missed opportunity | TODO |
| 003 | [Animar el desplegable de ingredientes del pack](003-pack-ingredient-list-reveal.md) | LOW-MEDIUM | Missed opportunity / Physicality | TODO |
| 004 | [Feedback visual en el badge del carrito](004-cart-badge-pop-feedback.md) | LOW | Missed opportunity (delight) | TODO |
| 005 | [Fade-in al terminar de cargar productos/packs](005-loading-state-fade-in.md) | LOW | Missed opportunity | TODO |

## Orden de ejecución recomendado

1. **001 primero** — no toca `index.css`, no tiene dependencias con los demás, y es el fix más mecánico (una palabra en 3 archivos). Buen warm-up antes de los que sí tocan CSS compartido.
2. **002, 003, 004, 005 en cualquier orden** — los cuatro tocan `src/index.css` (agregan variables a `:root` y reglas a `@layer components`), pero cada uno está escrito para ser idempotente: si un plan anterior ya agregó `--ease-out` o `--ease-in-out`, el siguiente no debe duplicarlo, solo agregar lo que falte. No hay dependencias funcionales entre ellos (tocan componentes distintos: Header.jsx, PackCard.jsx, Header.jsx de nuevo, Productos.jsx/PackDetail.jsx respectivamente).

## Dependencias entre planes

- **002 y 003** ambos introducen `--ease-out` en `:root` — si se ejecutan en la misma sesión sin coordinación, el segundo debe verificar que la variable no esté duplicada (ambos planes lo indican explícitamente en sus Steps).
- **004** introduce `--ease-in-out`, no se pisa con 002/003/005.
- Ninguno depende del resultado de otro para funcionar — se pueden ejecutar todos en paralelo por agentes distintos si se coordina el archivo `index.css` al final (o ejecutarlos secuencialmente para evitar conflictos de merge en ese único archivo compartido).

## Nota sobre el token `--ease-out` / `--ease-in-out`

Este proyecto no tenía ningún token de easing antes de estos planes (todo el motion existente usaba el `ease` implícito de Tailwind en transiciones de color). Los dos tokens introducidos (`--ease-out` para entradas, `--ease-in-out` para morphs en pantalla) son los valores recomendados por el audit y quedan disponibles en `:root` para que futuras animaciones del proyecto los reutilicen en vez de inventar curvas nuevas.
