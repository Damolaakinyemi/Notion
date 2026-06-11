"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { STATUS_ORDER, STATUS_META, type Entry, type Status } from "@/lib/types"

interface EntryDialogProps {
  open: boolean
  initial?: Entry | null
  onClose: () => void
  onSave: (data: Omit<Entry, "id">) => void
}

const today = () => new Date().toISOString().slice(0, 10)

export function EntryDialog({ open, initial, onClose, onSave }: EntryDialogProps) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState(today())
  const [status, setStatus] = useState<Status>("todo")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setTitle(initial?.title ?? "")
    setDate(initial?.date ?? today())
    setStatus(initial?.status ?? "todo")
    setNotes(initial?.notes ?? "")
    setError("")
    const t = setTimeout(() => titleRef.current?.focus(), 50)
    return () => clearTimeout(t)
  }, [open, initial])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError("Title is required")
      titleRef.current?.focus()
      return
    }
    onSave({ title: title.trim(), date, status, notes: notes.trim() })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={initial ? "Edit entry" : "New entry"}
    >
      <div
        className="animate-in w-full max-w-lg rounded-t-2xl border border-border bg-background p-5 shadow-xl sm:rounded-2xl sm:p-6"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{initial ? "Edit entry" : "New entry"}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-xs font-medium text-muted">
              Title
            </label>
            <input
              id="title"
              ref={titleRef}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (error) setError("")
              }}
              placeholder="Untitled"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="date" className="text-xs font-medium text-muted">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="status" className="text-xs font-medium text-muted">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_META[s].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="notes" className="text-xs font-medium text-muted">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a description..."
              rows={3}
              className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
            />
          </div>

          <div className="mt-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {initial ? "Save changes" : "Add entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
