import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import { CartProvider } from './context/CartContext.jsx'
import Home from './pages/Home.jsx'
import Productos from './pages/Productos.jsx'
import Packs from './pages/Packs.jsx'
import PackDetail from './pages/PackDetail.jsx'
import Zonas from './pages/Zonas.jsx'
import Carrito from './pages/Carrito.jsx'
import SobreNosotros from './pages/SobreNosotros.jsx'

export default function App() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/packs" element={<Packs />} />
            <Route path="/packs/:packId" element={<PackDetail />} />
            <Route path="/zonas" element={<Zonas />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}
