"use client"

export function BackgroundOrbs() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[0] overflow-hidden">
      {/* Top-left orb */}
      <div
        className="absolute -left-32 -top-32 h-72 w-72 rounded-full opacity-[0.22] blur-3xl dark:opacity-[0.18]"
        style={{
          background: "radial-gradient(closest-side, hsl(200 90% 60% / 0.8), transparent)",
        }}
      />
      {/* Bottom-right orb */}
      <div
        className="absolute -bottom-32 -right-28 h-80 w-80 rounded-full opacity-[0.18] blur-3xl dark:opacity-[0.16]"
        style={{
          background: "radial-gradient(closest-side, hsl(160 70% 60% / 0.7), transparent)",
        }}
      />
      {/* Soft band */}
      <div
        className="absolute inset-x-0 top-0 h-24 opacity-[0.1] dark:opacity-[0.08]"
        style={{
          background: "linear-gradient(180deg, hsl(0 0% 100% / 0.6), transparent)",
        }}
      />
    </div>
  )
}
