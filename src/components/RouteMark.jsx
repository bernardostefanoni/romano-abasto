// Elemento de firma visual: la ruta "Del Mercofrut a tu hogar"
// Un trazo punteado entre un origen (mercado) y un destino (casa), con el motocarro en el medio.
export default function RouteMark({ className = '' }) {
  return (
    <svg
      viewBox="0 0 320 60"
      fill="none"
      className={className}
      role="img"
      aria-label="Recorrido del Mercofrut a tu hogar"
    >
      <circle cx="16" cy="30" r="7" fill="#C8553D" />
      <path
        d="M24 30 H140"
        stroke="#2F5233"
        strokeWidth="2"
        strokeDasharray="5 6"
        strokeLinecap="round"
      />
      <g transform="translate(140,14)">
        <rect x="0" y="14" width="26" height="14" rx="3" fill="#D99A3D" />
        <circle cx="6" cy="30" r="4" fill="#2B2620" />
        <circle cx="20" cy="30" r="4" fill="#2B2620" />
        <path d="M2 14 L8 4 H20 L24 14" stroke="#2B2620" strokeWidth="2" fill="none" />
      </g>
      <path
        d="M180 30 H296"
        stroke="#2F5233"
        strokeWidth="2"
        strokeDasharray="5 6"
        strokeLinecap="round"
      />
      <path d="M296 18 L312 30 L296 42 L284 30 Z" fill="#2F5233" />
    </svg>
  )
}
