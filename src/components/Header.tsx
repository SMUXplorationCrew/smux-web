import Link from 'next/link'
import { DesktopNav } from '@/components/DesktopNav'
import { MobileNav } from '@/components/MobileNav'
import { resolveNavLinks } from '@/components/nav-links'
import { getSiteSettings } from '@/lib/payload'
import { safeUrl } from '@/lib/url'

export const Header = async () => {
  const settings = await getSiteSettings()
  const banner = settings?.banner
  const links = resolveNavLinks(settings?.nav)
  const bannerHref = safeUrl(banner?.url)

  return (
    <header className="site-header sticky top-0 z-50 border-b border-line bg-paper">
      {banner?.enabled && banner.text ? (
        <div className="bg-ink text-paper">
          <div className="mx-auto flex max-w-7xl items-center justify-center px-5 py-2">
            {bannerHref ? (
              <Link
                className="text-meta underline decoration-orange-lift underline-offset-4 transition-colors hover:text-orange-lift"
                href={bannerHref}
              >
                {banner.text}
              </Link>
            ) : (
              <p className="text-meta">{banner.text}</p>
            )}
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex h-[var(--header-h)] max-w-7xl items-center justify-between px-5">
        <Link aria-label="SMUX home" className="flex min-h-11 items-center" href="/">
          <span className="font-display text-card tracking-tight text-ink uppercase">
            SMU<span className="text-orange-text">X</span>
          </span>
        </Link>

        <DesktopNav links={links} />
        <MobileNav links={links} />
      </div>
    </header>
  )
}
