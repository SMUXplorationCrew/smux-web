import Link from 'next/link'
import { Section } from '@/components/Section'
export default function NotFound() {
  return (
    <Section
      title="This trail ends here"
      titleAs="h1"
      intro="The page may have moved or is not available yet."
    >
      <div className="flex flex-wrap gap-3">
        <Link href="/events" className="button button-primary">
          Find an event
        </Link>
        <Link href="/clubs" className="button button-quiet">
          Explore clubs
        </Link>
        <Link href="/search" className="button button-quiet">
          Search SMUX
        </Link>
      </div>
    </Section>
  )
}
