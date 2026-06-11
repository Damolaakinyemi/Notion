"use client"

import { memo } from "react"
import { Pencil, Trash2, Calendar } from "lucide-react"
import type { Entry } from "@/lib/types"
import { StatusBadge } from "./status-badge"

interface EntryTableProps {
  entries: Entry[]
  onEdit: (entry: Entry) => void
  onDelete: (id: string) => void
}

function formatDate(iso: string) {
  if (!iso) return "—"
  const d = new Date(iso + "T00:00:00")
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function EntryTableComponent({ entries, onEdit, onDelete }: EntryTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      {/* Header — desktop only */}
      <div className="hidden grid-cols-[1fr_160px_150px_88px] gap-4 border-b border-border bg-surface px-4 py-2.5 text-xs font-medium text-muted md:grid">
        <span>Title</span>
        <span>Date</span>
        <span>Status</span>
        <span className="text-right">Actions</span>
      </div>

      <ul>
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="group grid grid-cols-1 gap-2 border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-surface-hover md:grid-cols-[1fr_160px_150px_88px] md:items-center md:gap-4"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{entry.title}</p>
              {entry.notes && <p className="mt-0.5 truncate text-xs text-muted">{entry.notes}</p>}
            </div>

            <div className="flex items-center gap-1.5 text-sm text-muted">
              <Calendar className="h-3.5 w-3.5 md:hidden" />
              {formatDate(entry.date)}
            </div>

            <div>
              <StatusBadge status={entry.status} />
            </div>

            <div className="flex items-center gap-1 md:justify-end md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
              <button
                type="button"
                onClick={() => onEdit(entry)}
                aria-label={`Edit ${entry.title}`}
                className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(entry.id)}
                aria-label={`Delete ${entry.title}`}
                className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const EntryTable = memo(EntryTableComponent)
