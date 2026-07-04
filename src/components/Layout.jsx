import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import SceneBackground from './SceneBackground2D.jsx'
import KitchenStatusBanner from './KitchenStatusBanner.jsx'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <SceneBackground />
      <Navbar />
      <KitchenStatusBanner />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
