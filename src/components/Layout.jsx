import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import SceneBackground from './three/SceneBackground.jsx'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <SceneBackground />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
