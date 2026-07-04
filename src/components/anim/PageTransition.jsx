import { useLocation } from "react-router-dom";

export default function PageTransition({ children, className = "" }) {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className={`anim-page ${className}`}>
      {children}
    </div>
  );
}
