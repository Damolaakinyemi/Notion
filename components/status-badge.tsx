import { STATUS_META, type Status } from "@/lib/types"

export function StatusBadge({ status }: { status: Status }) {
  const meta = STATUS_META[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: meta.bg, color: meta.fg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.dot }} aria-hidden />
      {meta.label}
    </span>
  )
}
