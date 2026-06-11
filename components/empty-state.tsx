import { FileText, Plus } from "lucide-react"

export function EmptyState({ onAdd, filtered }: { onAdd: () => void; filtered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-hover">
        <FileText className="h-6 w-6 text-muted" />
      </div>
      <h3 className="text-base font-semibold text-foreground">
        {filtered ? "No matching entries" : "No entries yet"}
      </h3>
      <p className="mt-1 max-w-xs text-sm text-pretty text-muted">
        {filtered
          ? "Try adjusting your search or status filter to find what you're looking for."
          : "Create your first entry to start tracking your work, tasks, and notes."}
      </p>
      {!filtered && (
        <button
          type="button"
          onClick={onAdd}
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New entry
        </button>
      )}
    </div>
  )
}
