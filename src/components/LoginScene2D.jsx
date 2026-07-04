// Pure CSS/SVG ambient scene for the login gate. No WebGL / three.js, so it
// stays smooth on low-end phones. Animations are transform/opacity only (GPU
// friendly) and fully disabled under prefers-reduced-motion.
//
// It's a decorative backdrop: absolutely positioned, non-interactive, and sits
// behind the login card.

const FLOATERS = [
  { emoji: '🥐', left: '8%', size: 44, delay: 0, duration: 13 },
  { emoji: '🍞', left: '22%', size: 52, delay: 3.5, duration: 16 },
  { emoji: '🥖', left: '40%', size: 40, delay: 6, duration: 14 },
  { emoji: '🧁', left: '62%', size: 46, delay: 1.5, duration: 15 },
  { emoji: '🥯', left: '78%', size: 42, delay: 4.5, duration: 12 },
  { emoji: '🍰', left: '90%', size: 48, delay: 8, duration: 17 }
]

export default function LoginScene2D() {
  return (
    <div aria-hidden="true" className="login-scene pointer-events-none absolute inset-0 overflow-hidden">
      {/* Warm oven glow */}
      <div className="login-scene__glow" />

      {/* Drifting bakery treats */}
      {FLOATERS.map((f, i) => (
        <span
          key={i}
          className="login-scene__floater"
          style={{
            left: f.left,
            fontSize: `${f.size}px`,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`
          }}
        >
          {f.emoji}
        </span>
      ))}

      {/* Rising steam wisps */}
      <div className="login-scene__steam">
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ animationDelay: `${i * 1.1}s` }} />
        ))}
      </div>

      <style>{`
        .login-scene {
          background:
            radial-gradient(120% 90% at 50% -10%, rgba(255, 176, 84, 0.35), transparent 60%),
            linear-gradient(180deg, #fff7ed 0%, #ffedd5 45%, #fed7aa 100%);
        }
        :root.dark .login-scene,
        .dark .login-scene {
          background:
            radial-gradient(120% 90% at 50% -10%, rgba(234, 129, 42, 0.30), transparent 60%),
            linear-gradient(180deg, #1c1512 0%, #211711 50%, #2a1c12 100%);
        }
        .login-scene__glow {
          position: absolute;
          top: -18%;
          left: 50%;
          width: 55vmax;
          height: 55vmax;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(249, 168, 84, 0.45) 0%, transparent 65%);
          filter: blur(20px);
          animation: login-pulse 7s ease-in-out infinite;
        }
        .login-scene__floater {
          position: absolute;
          bottom: -70px;
          opacity: 0;
          will-change: transform, opacity;
          animation-name: login-float;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          filter: drop-shadow(0 6px 10px rgba(120, 60, 10, 0.18));
        }
        .login-scene__steam {
          position: absolute;
          left: 50%;
          bottom: 8%;
          transform: translateX(-50%);
          display: flex;
          gap: 14px;
        }
        .login-scene__steam span {
          display: block;
          width: 10px;
          height: 90px;
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(255,255,255,0.55), transparent);
          opacity: 0;
          will-change: transform, opacity;
          animation: login-steam 4.5s ease-in-out infinite;
        }
        :root.dark .login-scene__steam span,
        .dark .login-scene__steam span {
          background: linear-gradient(180deg, rgba(255,255,255,0.22), transparent);
        }
        @keyframes login-float {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.9; }
          90%  { opacity: 0.9; }
          100% { transform: translateY(-115vh) rotate(35deg); opacity: 0; }
        }
        @keyframes login-steam {
          0%   { transform: translateY(0) scaleX(1); opacity: 0; }
          30%  { opacity: 0.8; }
          100% { transform: translateY(-70px) scaleX(1.6); opacity: 0; }
        }
        @keyframes login-pulse {
          0%, 100% { opacity: 0.65; transform: translateX(-50%) scale(1); }
          50%      { opacity: 1;    transform: translateX(-50%) scale(1.08); }
        }
        @media (prefers-reduced-motion: reduce) {
          .login-scene__floater,
          .login-scene__steam span,
          .login-scene__glow {
            animation: none;
          }
          .login-scene__floater { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
