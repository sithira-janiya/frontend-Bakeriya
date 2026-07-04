/**
 * 2D hero illustration: a golden croissant, floating gently, with steam
 * and twinkles. One coherent SVG in a single viewBox — every part is
 * positioned relative to the same coordinate space, so nothing can drift
 * apart. Scales to fill its container on any screen.
 *
 * Performance: pure SVG + CSS keyframes (transform/opacity only),
 * zero JavaScript after mount, zero per-frame work on the main thread.
 */
export default function HeroScene2D() {
  return (
    <div
      className="anim-pop w-full max-w-md mx-auto aspect-square"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 400"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
      >
        {/* ground shadow — stays put while the croissant floats */}
        <ellipse
          className="hero-shadow"
          cx="200"
          cy="342"
          rx="112"
          ry="15"
          fill="#8a5a2b"
        />

        {/* everything below floats together */}
        <g className="hero-float">
          {/* steam wisps */}
          <g stroke="#c9a27a" strokeWidth="6" strokeLinecap="round" fill="none">
            <path
              className="hero-steam"
              d="M158 152 q -10 -14 0 -28 q 10 -14 0 -28"
            />
            <path
              className="hero-steam hero-steam--2"
              d="M200 142 q -10 -14 0 -28 q 10 -14 0 -28"
            />
            <path
              className="hero-steam hero-steam--3"
              d="M242 152 q -10 -14 0 -28 q 10 -14 0 -28"
            />
          </g>

          {/* twinkles */}
          <g fill="#e8702a">
            <path
              className="hero-spark"
              d="M108 176 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z"
            />
            <path
              className="hero-spark hero-spark--2"
              d="M300 190 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z"
            />
          </g>

          {/* croissant — built from overlapping ellipses only */}
          {/* outer tips */}
          <ellipse
            cx="86"
            cy="288"
            rx="27"
            ry="18"
            fill="#d08a3e"
            transform="rotate(-38 86 288)"
          />
          <ellipse
            cx="314"
            cy="288"
            rx="27"
            ry="18"
            fill="#d08a3e"
            transform="rotate(38 314 288)"
          />
          {/* side lobes */}
          <ellipse
            cx="130"
            cy="264"
            rx="50"
            ry="36"
            fill="#e09a4b"
            transform="rotate(-20 130 264)"
          />
          <ellipse
            cx="270"
            cy="264"
            rx="50"
            ry="36"
            fill="#e09a4b"
            transform="rotate(20 270 264)"
          />
          {/* main body */}
          <ellipse cx="200" cy="248" rx="76" ry="58" fill="#eda95e" />
          {/* soft top highlight */}
          <ellipse
            cx="184"
            cy="226"
            rx="40"
            ry="20"
            fill="#f6c78d"
            opacity="0.75"
          />
          {/* segment seams */}
          <g
            stroke="#c07429"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          >
            <path d="M152 204 q -12 44 2 84" />
            <path d="M200 194 q -4 54 2 108" />
            <path d="M248 204 q 12 44 -2 84" />
          </g>
        </g>
      </svg>
    </div>
  );
}
