"use client"

import { useMemo, useState } from "react"
import { Plus, Search, Menu } from "lucide-react"
import type { Entry, Status } from "@/lib/types"
import { useEntries } from "@/lib/use-entries"
import { Sidebar } from "@/components/sidebar"
import { EntryTable } from "@/components/entry-table"
import { EntryDialog } from "@/components/entry-dialog"
import { EmptyState } from "@/components/empty-state"

export default function Page() {
  const { entries, loaded, addEntry, updateEntry, deleteEntry } = useEntries()
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<"all" | Status>("all")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Entry | null>(null)

  const counts = useMemo(() => {
    const c: Record<"all" | Status, number> = { all: entries.length, todo: 0, "in-progress": 0, done: 0 }
    for (const e of entries) c[e.status]++
    return c
  }, [entries])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return entries.filter((e) => {
      if (filter !== "all" && e.status !== filter) return false
      if (!q) return true
      return e.title.toLowerCase().includes(q) || (e.notes ?? "").toLowerCase().includes(q)
    })
  }, [entries, query, filter])

  const openNew = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const openEdit = (entry: Entry) => {
    setEditing(entry)
    setDialogOpen(true)
  }

  const handleSave = (data: Omit<Entry, "id">) => {
    if (editing) updateEntry(editing.id, data)
    else addEntry(data)
  }

  const isFiltered = query.trim().length > 0 || filter !== "all"

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        counts={counts}
        active={filter}
        onSelect={setFilter}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top header */}
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur md:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="rounded-md p-1.5 text-muted hover:bg-surface-hover hover:text-foreground md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <h1 className="hidden text-sm font-semibold text-foreground sm:block">
            {filter === "all" ? "All entries" : { todo: "Not started", "in-progress": "In progress", done: "Done" }[filter]}
          </h1>

          <div className="relative ml-auto w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search entries..."
              className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
            />
          </div>

          <button
            type="button"
            onClick={openNew}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New</span>
          </button>
        </header>

        {/* Content */}
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 md:px-6 md:py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-balance text-foreground">My Workspace</h2>
            <p className="mt-1 text-sm text-muted">
              {loaded ? `${counts.all} ${counts.all === 1 ? "entry" : "entries"} tracked` : "Loading..."}
            </p>
          </div>

          {!loaded ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl border border-border bg-surface" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <EmptyState onAdd={openNew} filtered={isFiltered} />
          ) : (
            <EntryTable entries={visible} onEdit={openEdit} onDelete={deleteEntry} />
          )}
        </main>
      </div>

      <EntryDialog
        open={dialogOpen}
        initial={editing}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}
