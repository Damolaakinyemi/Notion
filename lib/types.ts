export type Status = "todo" | "in-progress" | "done"

export interface Entry {
  id: string
  title: string
  date: string // ISO yyyy-mm-dd
  status: Status
  notes?: string
}

export const STATUS_META: Record<Status, { label: string; bg: string; fg: string; dot: string }> = {
  todo: {
    label: "Not started",
    bg: "var(--status-todo-bg)",
    fg: "var(--status-todo-fg)",
    dot: "#9b9a97",
  },
  "in-progress": {
    label: "In progress",
    bg: "var(--status-progress-bg)",
    fg: "var(--status-progress-fg)",
    dot: "#d9730d",
  },
  done: {
    label: "Done",
    bg: "var(--status-done-bg)",
    fg: "var(--status-done-fg)",
    dot: "#448361",
  },
}

export const STATUS_ORDER: Status[] = ["todo", "in-progress", "done"]
