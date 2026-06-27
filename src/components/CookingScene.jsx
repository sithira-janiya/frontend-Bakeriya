// Animated cooking scene: a chef leaning over a soup pot, dipping a spoon in
// and lifting it to taste. Hand-drawn SVG (not emoji) so every part — head,
// hat, torso, shoulder, arm, spoon, pot — stays anchored together at every
// frame. Only the forearm+spoon group rotates (pivoting at the shoulder);
// everything else is static, which is what keeps the scene feeling like one
// connected illustration instead of floating pieces.
//
// The rotation arc (0deg -> -195deg) was hand-tuned by rendering both
// extremes to PNG and visually checking that the spoon lands in the soup at
// 0deg and right at the chef's mouth at -195deg before this was finalized.

const BOX = { sm: 90, lg: 220 }

export default function CookingScene({ size = 'lg', className = '' }) {
  const px = BOX[size] ?? BOX.lg

  return (
    <div className={`mx-auto select-none ${className}`} style={{ width: px, height: px }} aria-hidden="true">
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {/* steam */}
        <g stroke="#f3ddb3" strokeWidth="4" fill="none" strokeLinecap="round">
          <path className="steam-path steam-path-1" d="M62,128 Q58,118 64,108 Q70,98 64,90" />
          <path className="steam-path steam-path-2" d="M78,124 Q74,114 80,104 Q86,94 80,86" />
          <path className="steam-path steam-path-3" d="M94,128 Q90,118 96,108 Q102,98 96,90" />
        </g>

        {/* pot */}
        <rect x="42" y="150" width="72" height="44" rx="14" fill="#6f4422" />
        <rect x="24" y="144" width="18" height="12" rx="6" fill="#6f4422" />
        <rect x="114" y="144" width="18" height="12" rx="6" fill="#6f4422" />
        <ellipse cx="78" cy="152" rx="40" ry="10" fill="#8c5524" />
        <ellipse cx="78" cy="151" rx="34" ry="7.5" fill="#e8702a" />
        <circle className="soup-bubble soup-bubble-1" cx="66" cy="149" r="3" fill="#e9c485" />
        <circle className="soup-bubble soup-bubble-2" cx="80" cy="146" r="2.5" fill="#cc8a3a" />
        <circle className="soup-bubble soup-bubble-3" cx="92" cy="150" r="3.2" fill="#e9c485" />

        {/* chef torso */}
        <rect x="120" y="90" width="58" height="95" rx="26" fill="#ffffff" stroke="#e3d9c8" strokeWidth="2" />
        <rect x="143" y="96" width="12" height="68" rx="6" fill="#d6551a" />

        {/* chef head + face */}
        <circle cx="148" cy="68" r="20" fill="#f0c498" />
        <circle cx="138" cy="72" r="3" fill="#e8702a" opacity="0.35" />
        <circle cx="158" cy="72" r="3" fill="#e8702a" opacity="0.35" />
        <path d="M140,65 q3,3 6,0" stroke="#5c391f" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M150,65 q3,3 6,0" stroke="#5c391f" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M141,77 q7,5 14,0" stroke="#5c391f" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* chef hat */}
        <ellipse cx="148" cy="38" rx="20" ry="16" fill="#ffffff" stroke="#e3d9c8" strokeWidth="2" />
        <rect x="130" y="50" width="36" height="10" rx="4" fill="#ffffff" stroke="#e3d9c8" strokeWidth="2" />

        {/* arm + spoon -- pivots at the shoulder (128,110) */}
        <g className="chef-arm">
          <line x1="128" y1="110" x2="95" y2="145" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" />
          <circle cx="95" cy="145" r="7" fill="#f0c498" />
          <line x1="95" y1="145" x2="83" y2="158" stroke="#cfcfcf" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="80" cy="160" rx="7" ry="4.5" fill="#e2e5e7" stroke="#b9bec4" strokeWidth="1" transform="rotate(46,80,160)" />
        </g>
      </svg>
    </div>
  )
}
