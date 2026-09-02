import Link from 'next/link'
import { NAV_LINKS } from '@/components/nav-links'
import { getClubs, getSiteSettings } from '@/lib/payload'

export const Footer = async () => {
  const [settings, clubs] = await Promise.all([getSiteSettings(), getClubs()])
  const socials = settings?.socials

  return (
    <footer className="mt-24 bg-ink-deep text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-card uppercase">
            SMU<span className="text-orange-lift">X</span>
          </p>
          {settings?.motto ? (
            <p className="mt-2 text-meta text-paper/70">{settings.motto}</p>
          ) : null}
        </div>

        <nav aria-label="Clubs">
          <h2 className="font-display text-eyebrow tracking-eyebrow text-paper/60 uppercase">
            Clubs
          </h2>
          <ul className="mt-3 flex flex-col">
            {clubs.length > 0 ? (
              clubs.map((club) => (
                <li key={club.id}>
                  <Link
                    className="flex min-h-11 items-center text-meta text-paper/85 hover:text-orange-lift"
                    href={`/clubs/${club.slug}`}
                  >
                    {club.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-meta text-paper/50">Clubs coming soon</li>
            )}
          </ul>
        </nav>

        <nav aria-label="Site">
          <h2 className="font-display text-eyebrow tracking-eyebrow text-paper/60 uppercase">
            Explore
          </h2>
          <ul className="mt-3 flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  className="flex min-h-11 items-center text-meta text-paper/85 hover:text-orange-lift"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-eyebrow tracking-eyebrow text-paper/60 uppercase">
            Get in touch
          </h2>
          <ul className="mt-3 flex flex-col">
            {socials?.email ? (
              <li>
                <a
                  className="flex min-h-11 items-center text-meta text-paper/85 hover:text-orange-lift"
                  href={`mailto:${socials.email}`}
                >
                  {socials.email}
                </a>
              </li>
            ) : null}
            {socials?.telegram ? (
              <li>
                <a
                  className="flex min-h-11 items-center text-meta text-paper/85 hover:text-orange-lift"
                  href={`https://${socials.telegram.replace(/^https?:\/\//, '')}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {socials.telegram}
                </a>
              </li>
            ) : null}
            {socials?.instagram ? (
              <li>
                <a
                  className="flex min-h-11 items-center text-meta text-paper/85 hover:text-orange-lift"
                  href={`https://instagram.com/${socials.instagram.replace(/^@/, '')}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  @{socials.instagram.replace(/^@/, '')}
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/15">
        <div className="mx-auto max-w-7xl px-5 py-6">
          <p className="text-meta text-paper/50">
            SMUXploration Crew, Singapore Management University.
          </p>
        </div>
      </div>
    </footer>
  )
}
