'use client'
import Link from 'next/link'
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-20">
      <h1 className="text-section">We couldn’t load this page</h1>
      <p className="mt-5 text-copy">
        Please try again in a moment. Your saved adventures remain in this browser.
      </p>
      <div className="mt-8 flex gap-3">
        <button className="button button-primary" type="button" onClick={reset}>
          Try again
        </button>
        <Link className="button button-quiet" href="/">
          Go home
        </Link>
      </div>
    </section>
  )
}
