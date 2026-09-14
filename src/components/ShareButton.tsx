'use client'
import { useState } from 'react'
export function ShareButton({ title }: { title: string }) {
  const [message, setMessage] = useState('')
  return (
    <>
      <button
        className="button button-quiet"
        type="button"
        onClick={async () => {
          try {
            if (navigator.share) await navigator.share({ title, url: location.href })
            else {
              await navigator.clipboard.writeText(location.href)
              setMessage('Link copied')
            }
          } catch {
            setMessage('Copy the address from your browser to share.')
          }
        }}
      >
        Share
      </button>
      <span className="text-meta" role="status">
        {message}
      </span>
    </>
  )
}
