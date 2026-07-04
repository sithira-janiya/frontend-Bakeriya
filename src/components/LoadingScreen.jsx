import { useEffect, useState } from "react";

export default function LoadingScreen({
  minDurationMs = 1500,
  ready = true,
  onDone,
}) {
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpening(true), minDurationMs);
    return () => clearTimeout(t);
  }, [minDurationMs]);

  const shouldOpen = opening && ready;

  useEffect(() => {
    if (!shouldOpen) return;
    const t = setTimeout(() => {
      setGone(true);
      onDone?.();
    }, 700);
    return () => clearTimeout(t);
  }, [shouldOpen, onDone]);

  if (gone) return null;

  return (
    <div
      className="fixed inset-0 z-[100]"
      role="status"
      aria-label="Bakeriya is warming up"
    >
      {/* top oven door */}
      <div
        className={`loader-door loader-door--top absolute inset-x-0 top-0 h-1/2 bg-crust-100 ${
          shouldOpen ? "is-opening" : ""
        }`}
      />
      {/* bottom oven door */}
      <div
        className={`loader-door loader-door--bottom absolute inset-x-0 bottom-0 h-1/2 bg-crust-100 ${
          shouldOpen ? "is-opening" : ""
        }`}
      />

      {/* centre content */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-4 transition-opacity duration-300 ${
          shouldOpen ? "opacity-0" : "opacity-100"
        }`}
      >
        <div
          className="flex gap-2 text-crust-400 text-xl select-none"
          aria-hidden="true"
        >
          <span className="loader-steam">〜</span>
          <span className="loader-steam loader-steam--2">〜</span>
          <span className="loader-steam loader-steam--3">〜</span>
        </div>

        <span
          className="loader-croissant text-6xl select-none"
          aria-hidden="true"
        >
          🥐
        </span>

        <p className="font-display font-semibold text-crust-800 text-lg">
          Bakeriya
        </p>
        <p className="font-body text-crust-500 text-sm -mt-3">
          Fresh baked, just for you
        </p>

        <div
          className="w-40 h-1.5 rounded-full bg-crust-200 overflow-hidden"
          aria-hidden="true"
        >
          <div className="loader-bar h-full w-full rounded-full bg-oven-500" />
        </div>
      </div>
    </div>
  );
}
