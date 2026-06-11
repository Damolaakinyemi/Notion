"use client"

import { useCallback, useEffect, useState } from "react"
import type { Entry } from "./types"

const STORAGE_KEY = "tracker-entries-v1"

function seed(): Entry[] {
  const today = new Date().toISOString().slice(0, 10)
  return [
    { id: "1", title: "Welcome to your tracker", date: today, status: "done", notes: "Edit or delete this entry to get started." },
    { id: "2", title: "Draft Q3 project roadmap", date: today, status: "in-progress", notes: "" },
    { id: "3", title: "Review onboarding checklist", date: today, status: "todo", notes: "" },
  ]
}

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      setEntries(raw ? (JSON.parse(raw) as Entry[]) : seed())
    } catch {
      setEntries(seed())
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch {
      /* ignore quota errors */
    }
  }, [entries, loaded])

  const addEntry = useCallback((data: Omit<Entry, "id">) => {
    setEntries((prev) => [{ ...data, id: crypto.randomUUID() }, ...prev])
  }, [])

  const updateEntry = useCallback((id: string, data: Partial<Omit<Entry, "id">>) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)))
  }, [])

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  return { entries, loaded, addEntry, updateEntry, deleteEntry }
}
