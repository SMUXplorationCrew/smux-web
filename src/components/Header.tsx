import Link from 'next/link'
import { MobileNav } from '@/components/MobileNav'
import { NAV_LINKS } from '@/components/nav-links'
import { getSiteSettings } from '@/lib/payload'

export const Header = async () => {
  const settings = await getSiteSettings()
  const banner = settings?.banner

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      {banner?.enabled && banner.text ? (
        <div className="bg-ink text-paper">
          <div className="mx-auto flex max-w-7xl items-center justify-center px-5 py-2">
            {banner.url ? (
              <Link className="text-meta underline underline-offset-2" href={banner.url}>
                {banner.text}
              </Link>
            ) : (
              <p className="text-meta">{banner.text}</p>
            )}
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex h-[var(--header-h)] max-w-7xl items-center justify-between px-5">
        <Link className="flex min-h-11 items-center" href="/">
          <span className="font-display text-card tracking-tight text-ink uppercase">
            SMU<span className="text-orange-text">X</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  className="flex min-h-11 items-center font-display text-eyebrow tracking-eyebrow text-ink uppercase hover:text-orange-text"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <MobileNav links={NAV_LINKS} />
      </div>
    </header>
  )
}
