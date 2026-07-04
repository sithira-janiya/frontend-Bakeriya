/**
 * Site-wide decorative background: a warm gradient with four faint bakery
 * outline shapes drifting very slowly. Fixed, behind everything,
 * non-interactive. Uses crust text colors so dark mode reskins it
 * automatically.
 *
 * Performance: 4 small SVGs, one shared transform-only keyframe, 18s+
 * cycles. GPU-composited; effectively free even on weak phones.
 */

function Wheat(props) {
  return (
    <svg
      viewBox="0 0 40 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      {...props}
    >
      <path d="M20 78 V18" />
      <path d="M20 26 q -12 -4 -12 -16 q 12 4 12 16" />
      <path d="M20 26 q 12 -4 12 -16 q -12 4 -12 16" />
      <path d="M20 44 q -12 -4 -12 -16 q 12 4 12 16" />
      <path d="M20 44 q 12 -4 12 -16 q -12 4 -12 16" />
    </svg>
  );
}

function Pretzel(props) {
  return (
    <svg
      viewBox="0 0 80 60"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      {...props}
    >
      <circle cx="24" cy="30" r="16" />
      <circle cx="56" cy="30" r="16" />
      <path d="M24 14 q 16 10 32 32" />
      <path d="M56 14 q -16 10 -32 32" />
    </svg>
  );
}

function Steam(props) {
  return (
    <svg
      viewBox="0 0 30 70"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      {...props}
    >
      <path d="M15 65 q -10 -14 0 -28 q 10 -14 0 -28" />
    </svg>
  );
}

function Donut(props) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      stroke="currentColor"
      strokeWidth="10"
      {...props}
    >
      <circle cx="30" cy="30" r="20" />
    </svg>
  );
}

export default function SceneBackground2D() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none
                 bg-gradient-to-b from-crust-50 to-crust-100"
      aria-hidden="true"
    >
      <Wheat
        className="bg-drift absolute text-crust-300/40 w-16 md:w-20"
        style={{ top: "12%", left: "6%", animationDuration: "20s" }}
      />
      <Pretzel
        className="bg-drift absolute text-crust-300/30 w-20 md:w-28"
        style={{
          top: "58%",
          left: "12%",
          animationDuration: "26s",
          animationDelay: "-8s",
        }}
      />
      <Steam
        className="bg-drift absolute text-crust-300/40 w-8 md:w-10"
        style={{
          top: "22%",
          right: "10%",
          animationDuration: "18s",
          animationDelay: "-4s",
        }}
      />
      <Donut
        className="bg-drift absolute text-crust-300/30 w-14 md:w-20"
        style={{
          top: "72%",
          right: "14%",
          animationDuration: "24s",
          animationDelay: "-12s",
        }}
      />
    </div>
  );
}
