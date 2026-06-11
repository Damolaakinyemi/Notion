"use client"

import { LayoutGrid, Sun, Moon, X } from "lucide-react"
import { STATUS_ORDER, STATUS_META, type Status } from "@/lib/types"
import { useTheme } from "@/lib/use-theme"

interface SidebarProps {
  counts: Record<"all" | Status, number>
  active: "all" | Status
  onSelect: (s: "all" | Status) => void
  open: boolean
  onClose: () => void
}

export function Sidebar({ counts, active, onSelect, open, onClose }: SidebarProps) {
  const { theme, toggle, mounted } = useTheme()

  const items: { key: "all" | Status; label: string; dot?: string }[] = [
    { key: "all", label: "All entries" },
    ...STATUS_ORDER.map((s) => ({ key: s, label: STATUS_META[s].label, dot: STATUS_META[s].dot })),
  ]

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={onClose} aria-hidden />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-200 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-white">
              <LayoutGrid className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-foreground">Tracker</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1.5 text-muted hover:bg-surface-hover md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 px-2 py-2">
          <p className="px-2 pb-1.5 text-xs font-medium text-muted">Views</p>
          <ul className="flex flex-col gap-0.5">
            {items.map((item) => {
              const isActive = active === item.key
              return (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(item.key)
                      onClose()
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "bg-surface-hover font-medium text-foreground"
                        : "text-muted hover:bg-surface-hover hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {item.dot ? (
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.dot }} aria-hidden />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-muted" aria-hidden />
                      )}
                      {item.label}
                    </span>
                    <span className="text-xs text-muted">{counts[item.key]}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-2">
          <button
            type="button"
            onClick={toggle}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {mounted && theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </aside>
    </>
  )
}
