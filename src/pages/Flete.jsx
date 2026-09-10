import React, { useState } from 'react'
import RouteMark from '../components/RouteMark.jsx'
import { useProducts } from '../hooks/useProducts.js'

const WHATSAPP_NUMBER = '5493814571329'

// Para el flete, varios productos NO se compran en el Mercofrut en la misma
// unidad en la que se venden sueltos en la tienda (ej: la banana se vende
// por kg, pero se compra por cajón). Este mapa pisa la unidad solo para esos
// casos — el resto usa la unidad de venta normal (atado, ristra, kg, etc.).
const UNIDAD_MERCOFRUT = {
  'Banana paraguaya':         'cajón',
  'Batata roja':              'bolsa',
  'Berenjena':                'bolsa',
  'Brócoli':                  'par',
  'Cebolla selección':        'bolsa',
  'Cebolla morada':           'bolsa',
  'Choclo híbrido':           'bolsa',
  'Kiwi':                     'cajón',
  'Lechuga repollada':        'cajón',
  'Limón':                    'cajón',
  'Naranja criolla':          'cajón',
  'Mandarina':                'bolsa',
  'Manzana roja selección':   'cajón',
  'Papa':                     'bolsa',
  'Papin colorado':           'kg',
  'Pera':                     'cajón',
  'Pepino cajón':             'cajón',
  'Pimiento rojo selección':  'cajón',
  'Pimiento verde':           'cajón',
  'Tomate cherry cajón':      'cajón',
  'Tomate redondo cajón':     'cajón',
  'Tomate redondo selección': 'cajón',
  'Zanahoria':                'bolsa chica',
  'Zapallito verde':          'cajón',
  'Huevos color':             'cajón',
  'Huevos blancos':           'cajón',
}

// Unidad real de venta del producto (atado, ristra, kg, planta, u, etc.) —
// mismo dato que ya se usa en la tienda, salvo los casos de UNIDAD_MERCOFRUT
// donde la compra mayorista es distinta a la venta al menudeo.
function unidadFlete(p) {
  return UNIDAD_MERCOFRUT[p.name] || p.unit || p.unidad_display || 'u'
}

export default function Flete() {
  const { products, loading } = useProducts()
  const [cantidades, setCantidades] = useState({})
  const [form, setForm] = useState({ nombre: '', celular: '', direccion: '', nota: '' })
  const [errors, setErrors] = useState({})

  // Pastelería queda afuera: el flete es para compras de Mercofrut por
  // bulto/cajón, no para productos de panadería/pastelería.
  const productosFlete = products.filter((p) => p.category !== 'panaderia')
  const seleccionados = productosFlete.filter((p) => (cantidades[p.id] || 0) > 0)

  function cambiarCantidad(id, delta) {
    setCantidades((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }))
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  function validar() {
    const e = {}
    if (!form.nombre.trim())    e.nombre    = 'Ingresá tu nombre'
    if (!form.celular.trim())   e.celular   = 'Ingresá tu celular'
    if (!form.direccion.trim()) e.direccion = 'Ingresá el local o dirección de entrega'
    if (seleccionados.length === 0) e.productos = 'Elegí al menos un producto'
    return e
  }

  function enviarPorWhatsApp() {
    const errs = validar()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const lineas = seleccionados.map(
      (p) => `> ${p.name} — ${cantidades[p.id]} ${unidadFlete(p)}`
    )

    const partes = [
      '🚛 PEDIDO DE FLETE - Romano Abasto',
      '(Compra mayorista por bulto/cajón — a cotizar)',
      '',
      ...lineas,
      '',
      '📋 DATOS',
      `👤 Nombre: ${form.nombre}`,
      `📱 Celular: ${form.celular}`,
      `📍 Local / dirección de entrega: ${form.direccion}`,
    ]
    if (form.nota.trim()) partes.push(`📝 Nota: ${form.nota}`)
    partes.push('', '⚠️ El precio se cotiza aparte: precio Mercofrut del día + changarín + flete.')

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(partes.join('\n'))}`
    window.open(url, '_blank')
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <span className="rounded-full bg-leaf px-3 py-1 text-xs font-semibold text-cream">
        Servicio aparte · Para gastronómicos y compras grandes
      </span>
      <h1 className="mt-4 font-display text-3xl font-bold text-charcoal">Flete mayorista</h1>
      <RouteMark className="my-6 h-10 w-full max-w-sm" />

      <p className="text-charcoal/75">
        Si comprás en cantidad para uno o varios locales gastronómicos, tenemos un servicio
        distinto al de la tienda habitual: vas por <strong>bulto o cajón entero</strong>, al
        <strong> precio del Mercofrut</strong> — nosotros no le agregamos margen al producto.
      </p>
      <p className="mt-3 text-charcoal/75">
        Esto es un servicio aparte de los pedidos normales de la web: ahí comprás por unidad o
        kilo, a un precio ya casi de Mercofrut (le agregamos un margen muy bajo) con el envío
        incluido. Acá comprás por bulto entero, directo a precio Mercofrut sin ningún margen, y
        pagás aparte lo que efectivamente cuesta llevarlo hasta tu local.
      </p>

      {/* Cómo se arma el precio */}
      <div className="mt-8 rounded-card border border-line bg-white p-6 shadow-soft">
        <h2 className="font-display text-lg font-semibold text-charcoal">¿Cómo se arma el precio?</h2>
        <div className="mt-4 space-y-4">
          <div className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf/10 text-sm font-bold text-leaf">1</span>
            <div>
              <p className="font-semibold text-charcoal">Producto a precio Mercofrut</p>
              <p className="text-sm text-charcoal/70">Sin margen agregado — pagás lo mismo que pagamos nosotros en el mercado, por bulto o cajón entero.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf/10 text-sm font-bold text-leaf">2</span>
            <div>
              <p className="font-semibold text-charcoal">Changarín</p>
              <p className="text-sm text-charcoal/70">El costo de cargar los bultos y cajones en el mercado.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf/10 text-sm font-bold text-leaf">3</span>
            <div>
              <p className="font-semibold text-charcoal">Flete</p>
              <p className="text-sm text-charcoal/70">El servicio de traslado hasta tu local — acá está nuestra ganancia, no en el producto.</p>
            </div>
          </div>
        </div>
        <p className="mt-5 rounded-lg bg-creamDark/60 px-4 py-3 text-xs text-charcoal/60">
          💡 Al comprar por volumen, el costo del flete se reparte entre más producto — cuanto más
          grande el pedido, más conviene.
        </p>
      </div>

      {/* Selector de productos */}
      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold text-charcoal">Armá tu pedido</h2>
        <p className="mt-1 text-sm text-charcoal/60">
          Elegí los productos y cuántos de cada uno (atado, ristra, kg, cajón — según cómo se
          vende cada uno) — el precio te lo cotizamos por WhatsApp según el día.
        </p>

        {loading ? (
          <div className="mt-6 py-10 text-center text-sm text-charcoal/50">Cargando productos...</div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {productosFlete.map((p) => {
              const cant = cantidades[p.id] || 0
              return (
                <div
                  key={p.id}
                  className={`flex flex-col overflow-hidden rounded-card border bg-white shadow-soft ${
                    cant > 0 ? 'border-leaf' : 'border-line'
                  }`}
                >
                  <div className="aspect-square w-full overflow-hidden bg-creamDark">
                    <img src={p.img} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-3">
                    <p className="font-display text-sm font-semibold leading-snug text-charcoal">{p.name}</p>
                    <p className="text-xs text-charcoal/50">por {unidadFlete(p)}</p>
                    <div className="mt-auto flex items-center justify-center gap-2">
                      <button
                        type="button"
                        className="stepper-btn"
                        onClick={() => cambiarCantidad(p.id, -1)}
                        aria-label="Quitar"
                      >−</button>
                      <span className="w-8 text-center text-sm font-semibold">{cant}</span>
                      <button
                        type="button"
                        className="stepper-btn"
                        onClick={() => cambiarCantidad(p.id, 1)}
                        aria-label="Agregar"
                      >+</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {errors.productos && <p className="mt-3 text-sm text-crate">{errors.productos}</p>}
      </div>

      {/* Resumen de lo elegido */}
      {seleccionados.length > 0 && (
        <div className="mt-6 rounded-card border border-leaf/30 bg-leaf/5 p-4">
          <p className="text-sm font-semibold text-charcoal">Pedido armado:</p>
          <ul className="mt-2 space-y-1 text-sm text-charcoal/75">
            {seleccionados.map((p) => (
              <li key={p.id}>• {p.name} — {cantidades[p.id]} {unidadFlete(p)}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Datos de contacto */}
      <div className="mt-8">
        <h2 className="font-display text-xl font-semibold text-charcoal">Tus datos</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-charcoal">Nombre completo <span className="text-crate">*</span></label>
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Juan Pérez"
              className={`rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-leaf ${errors.nombre ? 'border-crate bg-crate/5' : 'border-line bg-white'}`} />
            {errors.nombre && <span className="text-xs text-crate">{errors.nombre}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-charcoal">Celular <span className="text-crate">*</span></label>
            <input name="celular" value={form.celular} onChange={handleChange} placeholder="381 4xx xxxx"
              className={`rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-leaf ${errors.celular ? 'border-crate bg-crate/5' : 'border-line bg-white'}`} />
            {errors.celular && <span className="text-xs text-crate">{errors.celular}</span>}
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-sm font-medium text-charcoal">Local / dirección de entrega <span className="text-crate">*</span></label>
            <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Nombre del local y dirección (si son varios, contanos en la nota)"
              className={`rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-leaf ${errors.direccion ? 'border-crate bg-crate/5' : 'border-line bg-white'}`} />
            {errors.direccion && <span className="text-xs text-crate">{errors.direccion}</span>}
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-sm font-medium text-charcoal">
              Nota <span className="font-normal text-charcoal/40">(opcional)</span>
            </label>
            <textarea name="nota" value={form.nota} onChange={handleChange}
              placeholder="Ej: varios locales, frecuencia, algo puntual del pedido..." rows={3}
              className="resize-none rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-leaf" />
          </div>
        </div>
      </div>

      <button
        onClick={enviarPorWhatsApp}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90 sm:w-auto"
      >
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Enviar pedido por WhatsApp
      </button>
    </div>
  )
}
