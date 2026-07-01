// Datos estáticos — Los productos vienen de Supabase via useProducts()
// Este archivo solo mantiene packs, zonas de entrega y datos que no se sincronizan del ERP

export const packs = [
  {
    id: 'pack-semanal',
    name: 'Bolsón Semanal Hogar',
    price: 18500,
    desc: 'Selección de verduras de hoja, raíz y fruta de estación pensada para una familia de hasta 4 personas durante una semana.',
    bullets: ['Verduras y frutas de estación', 'Cantidad pensada para 4 personas', 'Variedad cambia según cosecha del Mercofrut'],
    items: 12,
    img: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'pack-saludable',
    name: 'Pack Verde y Liviano',
    price: 14200,
    desc: 'Hojas verdes, cítricos y vegetales crudos ideales para ensaladas, jugos y licuados durante la semana.',
    bullets: ['Hojas verdes seleccionadas', 'Cítricos de estación', 'Ideal para jugos y ensaladas'],
    items: 9,
    img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'pack-desayuno',
    name: 'Pack Desayuno y Merienda',
    price: 9800,
    desc: 'Pan casero, facturas, huevos y fruta para arrancar el día. Pensado para reponer cada semana.',
    bullets: ['Pan del día incluido', 'Huevos frescos', 'Fruta de fácil consumo'],
    items: 7,
    img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'pack-negocio',
    name: 'Pack Gastronómico',
    price: 32500,
    desc: 'Pensado para locales gastronómicos: verdura de base, papa, tomate y cebolla en volumen, con entrega recurrente.',
    bullets: ['Volumen pensado para cocina', 'Entrega recurrente programable', 'Precio mayorista'],
    items: 15,
    img: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=800&auto=format&fit=crop',
  },
]

export const deliveryZones = [
  { zone: 'Centro y Microcentro', day: 'Martes', time: '08:00–12:00' },
  { zone: 'Barrio Sur', day: 'Martes', time: '17:00–20:00' },
  { zone: 'Yerba Buena', day: 'Miércoles', time: '08:00–12:00' },
  { zone: 'Villa Mariano Moreno', day: 'Miércoles', time: '17:00–20:00' },
  { zone: 'Barrio Norte', day: 'Jueves', time: '08:00–12:00' },
  { zone: 'San Cayetano', day: 'Jueves', time: '17:00–20:00' },
]
