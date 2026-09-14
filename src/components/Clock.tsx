'use client'
import { useSyncExternalStore } from 'react'

let now = Date.now()
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | undefined
const refresh = () => {
  now = Date.now()
  for (const notify of listeners) notify()
}
const subscribe = (notify: () => void) => {
  listeners.add(notify)
  if (listeners.size === 1) {
    timer = setInterval(refresh, 15000)
    document.addEventListener('visibilitychange', refresh)
    window.addEventListener('focus', refresh)
    refresh()
  }
  return () => {
    listeners.delete(notify)
    if (!listeners.size) {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', refresh)
      window.removeEventListener('focus', refresh)
    }
  }
}
/** All time-sensitive controls share one clock. A stable server snapshot avoids hydration drift. */
export const useClock = (initial: number) =>
  useSyncExternalStore(
    subscribe,
    () => now,
    () => initial,
  )
