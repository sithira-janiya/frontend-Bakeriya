// Site-wide ambient background — pure CSS/SVG, no WebGL/three.js, so it stays
// smooth on low-end phones. A fixed, non-interactive layer that sits behind
// every page (mounted once in Layout). It replaces the old 3D SceneBackground.
//
// A crust-toned gradient paints the base (themed via the --c-* CSS variables,
// so light/dark just work), and a few faint bakery shapes drift very slowly.
// Every animation touches transform/opacity only (GPU compositor) and is fully
// disabled under prefers-reduced-motion.

const SHAPES = {
  // Simple bakery silhouettes drawn in a 0..24 viewBox.
  croissant: (
    <path d="M3 15c2-7 8-11 15-11-3 3-4 6-4 9 3-1 6-1 8 1-3 1-5 3-6 6-2-3-5-4-8-4 1 3 1 6-1 9-2-3-5-6-11-6 3-2 6-3 8-4z" />
  ),
  wheat: (
    <path d="M12 2v20M12 6c-3-1-5 1-6 4 3 1 5-1 6-4zm0 0c3-1 5 1 6 4-3 1-5-1-6-4zm0 5c-3-1-5 1-6 4 3 1 5-1 6-4zm0 0c3-1 5 1 6 4-3 1-5-1-6-4zm0 5c-3-1-5 1-6 4 3 1 5-1 6-4zm0 0c3-1 5 1 6 4-3 1-5-1-6-4z" />
  ),
  bun: <path d="M4 15a8 5 0 0116 0c0 1-1 2-2 2H6c-1 0-2-1-2-2zm3-1c1-3 3-4 5-4s4 1 5 4" />,
  pretzel: (
    <path d="M12 4a6 6 0 016 6c0 4-4 6-6 6s-6-2-6-6a6 6 0 016-6zm-3 4l6 8m0-8l-6 8" />
  ),
}

// left/top in %, a shape key, size in px, and independent drift timing so the
// motion never looks synchronized. Kept to 4 elements to stay cheap.
const FLOATERS = [
  { shape: 'croissant', left: '10%', top: '18%', size: 92, dur: 22, delay: 0, drift: 'a' },
  { shape: 'wheat', left: '78%', top: '28%', size: 78, dur: 26, delay: 3, drift: 'b' },
  { shape: 'bun', left: '22%', top: '72%', size: 84, dur: 24, delay: 6, drift: 'b' },
  { shape: 'pretzel', left: '68%', top: '78%', size: 88, dur: 28, delay: 2, drift: 'a' },
]

export default function SceneBackground2D() {
  return (
    <div aria-hidden="true" className="scene2d pointer-events-none fixed inset-0 -z-[1] overflow-hidden">
      {FLOATERS.map((f, i) => (
        <svg
          key={i}
          className={`scene2d__shape scene2d__drift-${f.drift}`}
          viewBox="0 0 24 24"
          width={f.size}
          height={f.size}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ left: f.left, top: f.top, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }}
        >
          {SHAPES[f.shape]}
        </svg>
      ))}

      <style>{`
        .scene2d {
          background:
            radial-gradient(120% 100% at 15% 0%, rgb(var(--c-100) / 0.9), transparent 55%),
            radial-gradient(120% 100% at 85% 100%, rgb(var(--c-200) / 0.7), transparent 55%),
            linear-gradient(160deg, rgb(var(--c-50) / 1) 0%, rgb(var(--c-100) / 1) 100%);
        }
        .scene2d__shape {
          position: absolute;
          color: rgb(var(--c-500) / 0.16);
          will-change: transform;
        }
        .scene2d__drift-a { animation: scene2d-drift-a linear infinite; }
        .scene2d__drift-b { animation: scene2d-drift-b linear infinite; }
        @keyframes scene2d-drift-a {
          0%   { transform: translate3d(0, 0, 0) rotate(0deg); }
          50%  { transform: translate3d(18px, -22px, 0) rotate(8deg); }
          100% { transform: translate3d(0, 0, 0) rotate(0deg); }
        }
        @keyframes scene2d-drift-b {
          0%   { transform: translate3d(0, 0, 0) rotate(0deg); }
          50%  { transform: translate3d(-20px, 16px, 0) rotate(-7deg); }
          100% { transform: translate3d(0, 0, 0) rotate(0deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .scene2d__shape { animation: none; }
        }
      `}</style>
    </div>
  )
}
