'use client'
import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { formatEventWhen } from '@/lib/format'
import type { Club, Event } from '@/payload-types'

const KEY = 'smux-shortlist-v1'
const subscribe = (listener: () => void) => {
  window.addEventListener('storage', listener)
  window.addEventListener('smux-shortlist', listener)
  return () => {
    window.removeEventListener('storage', listener)
    window.removeEventListener('smux-shortlist', listener)
  }
}
const snapshot = () => {
  try {
    return localStorage.getItem(KEY) || '[]'
  } catch {
    return '[]'
  }
}
export function useShortlist() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => '[]')
  let ids: string[] = []
  try {
    const data = JSON.parse(raw)
    if (Array.isArray(data)) ids = data.filter((x) => typeof x === 'string')
  } catch {}
  return {
    ids,
    set: (items: string[]) => {
      try {
        localStorage.setItem(KEY, JSON.stringify(items))
        window.dispatchEvent(new Event('smux-shortlist'))
      } catch {
        /* Storage can be unavailable in private mode. */
      }
    },
  }
}
export function SaveButton({ kind, id }: { kind: 'event' | 'club'; id: number }) {
  const { ids, set } = useShortlist()
  const key = `${kind}:${id}`
  const saved = ids.includes(key)
  return (
    <button
      type="button"
      className="button button-quiet"
      aria-pressed={saved}
      onClick={() => set(saved ? ids.filter((x) => x !== key) : [...ids, key])}
    >
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}
export function Shortlist({ events, clubs }: { events: Event[]; clubs: Club[] }) {
  const { ids, set } = useShortlist()
  const found = [
    ...clubs
      .filter((c) => ids.includes(`club:${c.id}`))
      .map((c) => ({
        key: `club:${c.id}`,
        href: `/clubs/${c.slug}`,
        title: c.name,
        detail: c.tagline,
      })),
    ...events
      .filter((e) => ids.includes(`event:${e.id}`))
      .map((e) => ({
        key: `event:${e.id}`,
        href: `/events/${e.slug}`,
        title: e.title,
        detail: formatEventWhen(e.startsAt, e.endsAt, e.timeTbc),
      })),
  ]
  return (
    <div>
      <p className="max-w-2xl text-copy">
        Your saved clubs and events stay in this browser. They are not shared across devices. Saving
        an event does not reserve a place.
      </p>
      {found.length ? (
        <>
          <ul className="mt-8 divide-y divide-line">
            {found.map((item) => (
              <li key={item.key} className="flex items-center justify-between gap-4 py-5">
                <div>
                  <Link className="font-display text-card" href={item.href}>
                    {item.title}
                  </Link>
                  <p className="text-meta text-copy">{item.detail}</p>
                </div>
                <button
                  className="button button-quiet"
                  type="button"
                  onClick={() => set(ids.filter((x) => x !== item.key))}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button className="button button-quiet mt-6" onClick={() => set([])} type="button">
            Clear saved adventures
          </button>
        </>
      ) : (
        <div className="notice mt-8">
          Nothing saved yet.{' '}
          <Link className="underline" href="/events">
            Find an event
          </Link>{' '}
          or{' '}
          <Link className="underline" href="/clubs">
            explore the clubs
          </Link>
          .
        </div>
      )}
    </div>
  )
}
