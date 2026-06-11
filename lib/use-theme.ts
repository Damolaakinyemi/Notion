"use client"

import { useEffect, useState } from "react"

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setTheme(isDark ? "dark" : "light")
    setMounted(true)
  }, [])

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark"
      document.documentElement.classList.toggle("dark", next === "dark")
      try {
        localStorage.setItem("tracker-theme", next)
      } catch {
        /* ignore */
      }
      return next
    })
  }

  return { theme, toggle, mounted }
}
