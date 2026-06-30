// Datos de ejemplo — Romano Abasto (contenido propio, inspirado solo en estructura)

export const categories = [
  { id: 'frutas-verduras', name: 'Frutas y Verduras', icon: '🥬' },
  { id: 'almacen', name: 'Almacén', icon: '🍪' },
  { id: 'huevos', name: 'Huevos', icon: '🥚' },
  { id: 'limpieza', name: 'Limpieza', icon: '🧼' },
  { id: 'panaderia', name: 'Panadería', icon: '🥖' },
]

export const products = [
  { id: 1, name: 'Banana de Ecuador', category: 'frutas-verduras', unit: 'Kg', price: 2900, img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=400&auto=format&fit=crop', featured: true },
  { id: 2, name: 'Zanahoria fresca', category: 'frutas-verduras', unit: '1/2 Kg', price: 600, img: 'https://images.unsplash.com/photo-1582515073490-39981397c445?q=80&w=400&auto=format&fit=crop' },
  { id: 3, name: 'Papa cepillada', category: 'frutas-verduras', unit: 'Kg', price: 1400, img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=400&auto=format&fit=crop' },
  { id: 4, name: 'Tomate perita', category: 'frutas-verduras', unit: 'Kg', price: 2400, img: 'https://images.unsplash.com/photo-1546470427-227c7ad6f86a?q=80&w=400&auto=format&fit=crop', featured: true },
  { id: 5, name: 'Manzana Red', category: 'frutas-verduras', unit: 'Kg', price: 2100, img: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=400&auto=format&fit=crop' },
  { id: 6, name: 'Limón fresco', category: 'frutas-verduras', unit: 'Kg', price: 700, img: 'https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=400&auto=format&fit=crop' },
  { id: 7, name: 'Pomelo rosado', category: 'frutas-verduras', unit: 'Kg', price: 1350, img: 'https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=400&auto=format&fit=crop' },
  { id: 8, name: 'Remolacha', category: 'frutas-verduras', unit: 'Kg', price: 2900, img: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?q=80&w=400&auto=format&fit=crop' },
  { id: 9, name: 'Huevo blanco maple x30', category: 'huevos', unit: 'Maple', price: 6200, img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=400&auto=format&fit=crop', featured: true },
  { id: 10, name: 'Huevo color maple x30', category: 'huevos', unit: 'Maple', price: 6600, img: 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?q=80&w=400&auto=format&fit=crop' },
  { id: 11, name: 'Detergente concentrado', category: 'limpieza', unit: 'Botella', price: 2300, img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=400&auto=format&fit=crop' },
  { id: 12, name: 'Lavandina', category: 'limpieza', unit: 'Botella', price: 1100, img: 'https://images.unsplash.com/photo-1610557892470-55d587b2b1a2?q=80&w=400&auto=format&fit=crop' },
  { id: 13, name: 'Pan casero del día', category: 'panaderia', unit: 'Unidad', price: 1800, img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop', featured: true },
  { id: 14, name: 'Facturas surtidas', category: 'panaderia', unit: 'Docena', price: 4200, img: 'https://images.unsplash.com/photo-1623334044303-241021148842?q=80&w=400&auto=format&fit=crop' },
  { id: 15, name: 'Aceite de girasol', category: 'almacen', unit: 'Botella 900ml', price: 1900, img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=400&auto=format&fit=crop' },
  { id: 16, name: 'Yerba mate', category: 'almacen', unit: 'Paquete 1Kg', price: 3100, img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=400&auto=format&fit=crop' },
]

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
