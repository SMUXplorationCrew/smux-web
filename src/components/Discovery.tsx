'use client'
import Link from 'next/link'
import { useState } from 'react'
import { SaveButton } from '@/components/Shortlist'
import type { Club } from '@/payload-types'
export type SearchItem = {
  id: string
  title: string
  description?: string | null
  href: string
  category: string
  meta?: string | null
}
export function SearchList({
  items,
  label = 'Search',
  empty = 'No results. Try another search.',
}: {
  items: SearchItem[]
  label?: string
  empty?: string
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const results = items.filter(
    (i) =>
      (!category || i.category === category) &&
      `${i.title} ${i.description || ''} ${i.meta || ''}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  )
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-[1fr_16rem]">
        <label className="field">
          {label}
          <input
            className="input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a name or keyword"
          />
        </label>
        <label className="field">
          Category
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {[...new Set(items.map((i) => i.category))].sort().map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-4 text-meta text-copy" role="status">
        {results.length} result{results.length === 1 ? '' : 's'}
      </p>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {results.map((item) => (
          <li key={item.id} className="py-6">
            <p className="font-display text-eyebrow uppercase text-accent-text">
              {item.category}
              {item.meta ? ` · ${item.meta}` : ''}
            </p>
            <Link
              className="mt-1 inline-block font-display text-card underline decoration-line underline-offset-4 hover:decoration-orange"
              href={item.href}
            >
              {item.title}
            </Link>
            {item.description && <p className="mt-2 max-w-3xl text-copy">{item.description}</p>}
          </li>
        ))}
      </ul>
      {!results.length && <p className="notice mt-6">{empty}</p>}
    </div>
  )
}
export function AdventureFinder({ clubs }: { clubs: Club[] }) {
  const [environment, setEnvironment] = useState('')
  const [beginner, setBeginner] = useState(false)
  const [commitment, setCommitment] = useState('')
  const ranked = clubs
    .map((c) => ({
      club: c,
      score:
        (environment && c.discovery?.environment === environment ? 2 : 0) +
        (beginner && c.discovery?.beginnerFriendly ? 2 : 0) +
        (commitment && c.discovery?.commitment?.toLowerCase().includes(commitment.toLowerCase())
          ? 1
          : 0),
    }))
    .sort((a, b) => b.score - a.score)
  return (
    <div>
      <div className="grid gap-5 rounded-sm bg-off p-6 md:grid-cols-3">
        <label className="field">
          Where do you want to explore?
          <select
            className="input"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
          >
            <option value="">Anywhere</option>
            <option value="land">On land</option>
            <option value="water">On water</option>
            <option value="mixed">A bit of everything</option>
          </select>
        </label>
        <label className="field">
          Time you can give
          <input
            className="input"
            value={commitment}
            onChange={(e) => setCommitment(e.target.value)}
            placeholder="For example: weekly"
          />
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={beginner}
            onChange={(e) => setBeginner(e.target.checked)}
          />
          Prioritize beginner-friendly clubs
        </label>
      </div>
      <p className="mt-4 text-meta text-copy">
        Matches use facts entered by each club. An incomplete profile can still be a great fit.
        Compare the details and ask the committee.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {ranked.map(({ club: c, score }) => (
          <article
            className="border-t-2 border-accent py-6"
            data-club={c.accent || c.slug}
            key={c.id}
          >
            <p className="text-meta text-accent-text">
              {score ? 'Matches your preferences' : 'Explore this club'}
            </p>
            <h2 className="mt-2 text-card">
              <Link href={`/clubs/${c.slug}`}>{c.name}</Link>
            </h2>
            <p className="mt-2 text-copy">{c.tagline}</p>
            <dl className="mt-4 grid gap-2 text-meta">
              <div>
                <dt className="inline font-semibold">Commitment: </dt>
                <dd className="inline">{c.discovery?.commitment || 'Ask the club'}</dd>
              </div>
              <div>
                <dt className="inline font-semibold">Cost: </dt>
                <dd className="inline">
                  {c.discovery?.costGuide || 'Varies by activity; ask the club'}
                </dd>
              </div>
            </dl>
            <div className="mt-5 flex gap-3">
              <Link className="button button-primary" href={`/clubs/${c.slug}`}>
                Explore {c.name}
              </Link>
              <SaveButton kind="club" id={c.id} />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
