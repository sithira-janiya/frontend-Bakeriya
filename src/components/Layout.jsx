import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import SceneBackground2D from "./SceneBackground2D.jsx";
import KitchenStatusBanner from "./KitchenStatusBanner.jsx";
import PageTransition from "./anim/PageTransition.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <SceneBackground2D />
      <Navbar />
      <KitchenStatusBanner />
      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}
