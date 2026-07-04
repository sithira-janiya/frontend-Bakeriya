// 2D hero centerpiece for the Home page — pure SVG, no WebGL/three.js.
// A warm bakery still-life (plate + croissant + cupcake) with rising steam
// wisps. Entrance is staggered via the shared anim-pop / anim-d-* classes and
// steam reuses the loader-steam keyframe from animations.css. Everything
// animates transform/opacity only and honours prefers-reduced-motion (handled
// by those shared classes). Decorative and non-interactive.

export default function HeroScene2D() {
  // transform-origin fix so anim-pop scales groups about their own centre.
  const popOrigin = { transformBox: 'fill-box', transformOrigin: 'center' }

  return (
    <div aria-hidden="true" className="relative h-full w-full select-none">
      <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible" fill="none">
        {/* Soft plate glow */}
        <g className="anim-pop" style={popOrigin}>
          <ellipse cx="200" cy="330" rx="150" ry="34" fill="rgb(var(--c-200) / 0.7)" />
          <circle cx="200" cy="200" r="140" fill="rgb(var(--c-100) / 0.55)" />
        </g>

        {/* Croissant */}
        <g className="anim-pop anim-d-2" style={popOrigin} transform="translate(96 176) rotate(-8)">
          <path
            d="M8 44C14 20 34 6 62 6c-8 8-11 16-11 26 8-3 16-2 22 3-8 3-13 8-15 16-5-8-13-11-21-11 3 8 3 17-2 25-5-8-14-16-27-16 8-6 15-9 20-11z"
            transform="scale(1.6)"
            fill="#e8702a"
            stroke="#b2430f"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </g>

        {/* Cupcake */}
        <g className="anim-pop anim-d-3" style={popOrigin} transform="translate(214 150)">
          <path d="M8 40h64l-10 46a6 6 0 01-6 5H24a6 6 0 01-6-5z" fill="#f6c68a" stroke="#d6551a" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M40 4c16 0 30 12 30 26 0 8-6 12-14 12H24c-8 0-14-4-14-12C10 16 24 4 40 4z" fill="#c96b4a" stroke="#8c5524" strokeWidth="1.4" strokeLinejoin="round" />
          <circle cx="40" cy="8" r="5" fill="#e8702a" />
        </g>

        {/* Steam wisps — reuse loader-steam (bk-steam) keyframes */}
        <g stroke="rgb(var(--c-500) / 0.5)" strokeWidth="5" strokeLinecap="round" fill="none">
          <path className="loader-steam" style={popOrigin} d="M150 120c-8-10 8-18 0-30" />
          <path className="loader-steam loader-steam--2" style={popOrigin} d="M205 108c-8-10 8-18 0-30" />
          <path className="loader-steam loader-steam--3" style={popOrigin} d="M258 122c-8-10 8-18 0-30" />
        </g>
      </svg>
    </div>
  )
}
