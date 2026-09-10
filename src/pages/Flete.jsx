import React from 'react'
import RouteMark from '../components/RouteMark.jsx'

const WHATSAPP_NUMBER = '5493814571329'

const mensajeConsulta = encodeURIComponent(
  '🚛 Hola! Quiero consultar por el servicio de flete para compras mayoristas por bulto/cajón.'
)

export default function Flete() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
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
        kilo, con precio minorista y envío incluido. Acá comprás por bulto a precio mayorista, y
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

      <div className="mt-8 rounded-card border border-leaf/20 bg-leaf/5 p-5">
        <h2 className="font-display text-lg font-semibold text-leaf flex items-center gap-2">
          <span>📋</span> ¿Para quién es?
        </h2>
        <p className="mt-2 text-sm text-charcoal/75">
          Restaurantes, rotiserías, verdulerías u otros locales que necesiten comprar fruta y
          verdura en cantidad, para uno o varios puntos de entrega. El pedido se arma a medida,
          así que te pedimos que nos escribas para cotizarlo.
        </p>
      </div>

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${mensajeConsulta}`}
        target="_blank"
        rel="noreferrer"
        className="mt-8 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90 sm:inline-flex"
      >
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Consultar por WhatsApp
      </a>
    </div>
  )
}
