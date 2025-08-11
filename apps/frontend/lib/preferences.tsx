"use client"

import React from "react"

type Density = "comfortable" | "compact"
type Preferences = {
  density: Density
  setDensity: (d: Density) => void
  language: "en"
}

const PreferencesContext = React.createContext<Preferences | null>(null)
const KEY = "classboard:prefs"

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [density, setDensityState] = React.useState<Density>("comfortable")
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        const v = JSON.parse(raw)
        if (v.density) setDensityState(v.density)
      }
    } catch {}
  }, [])
  const setDensity = (d: Density) => {
    setDensityState(d)
    try {
      localStorage.setItem(KEY, JSON.stringify({ density: d }))
    } catch {}
  }
  return (
    <PreferencesContext.Provider value={{ density, setDensity, language: "en" }}>
      <div className={density === "compact" ? "density-compact" : ""}>{children}</div>
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const ctx = React.useContext(PreferencesContext)
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider")
  return ctx
}
