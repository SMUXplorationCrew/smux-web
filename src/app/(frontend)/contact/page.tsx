import type { Metadata } from 'next'
import Link from 'next/link'
import { EditorialPage } from '@/components/EditorialPage'
import { MediaImage } from '@/components/MediaImage'
import { EmptyState, Section } from '@/components/Section'
import { SocialRow } from '@/components/SocialRow'
import { getClubs, getPageBySlug, getSiteSettings } from '@/lib/payload'
import { toSocialLinks } from '@/lib/socials'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('contact')
  return {
    title: page?.title ?? 'Contact',
    description: page?.intro ?? 'How to reach SMUX and each of the six clubs.',
  }
}

export default async function ContactPage() {
  const [page, clubs, settings] = await Promise.all([
    getPageBySlug('contact'),
    getClubs(),
    getSiteSettings(),
  ])

  const hasSmuxSocials = toSocialLinks(settings?.socials, settings?.extraSocials).length > 0

  return (
    <>
      <EditorialPage
        fallbackNote='Create a Page in the CMS with the slug "contact" to add an introduction here.'
        fallbackTitle="Contact"
        page={page}
      />

      {hasSmuxSocials ? (
        <Section
          eyebrow="SMUX"
          intro="For anything that is not about one specific club — collaborations, sponsorship, or if you are not sure who to ask."
          title="Reach the main committee"
        >
          <SocialRow extra={settings?.extraSocials} socials={settings?.socials} variant="tile" />
        </Section>
      ) : null}

      <Section
        className="bg-off"
        eyebrow="By club"
        intro="Each club runs its own channels. Messaging them directly is always faster than going through us."
        title="Reach a club directly"
      >
        {clubs.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club) => {
              const links = toSocialLinks(club.socials, club.extraSocials)

              return (
                <article
                  className="flex flex-col border border-line bg-paper p-6 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent"
                  data-club={club.accent ?? club.slug}
                  key={club.id}
                >
                  <div className="flex items-center gap-3">
                    {club.logo ? (
                      <div className="relative size-10 shrink-0 overflow-hidden">
                        <MediaImage fill media={club.logo} placeholderLabel="" sizes="40px" />
                      </div>
                    ) : null}
                    <h3 className="text-card text-accent">
                      <Link
                        className="hover:underline underline-offset-4"
                        href={`/clubs/${club.slug}`}
                      >
                        {club.name}
                      </Link>
                    </h3>
                  </div>

                  {club.tagline ? (
                    <p className="mt-2 text-meta text-muted">{club.tagline}</p>
                  ) : null}

                  {links.length > 0 ? (
                    <SocialRow
                      className="mt-4"
                      extra={club.extraSocials}
                      socials={club.socials}
                      variant="inline"
                    />
                  ) : (
                    <p className="mt-4 text-meta text-muted">[CONTACT TO BE CONFIRMED]</p>
                  )}
                </article>
              )
            })}
          </div>
        ) : (
          <EmptyState>Club contacts will appear here once the clubs are added.</EmptyState>
        )}
      </Section>
    </>
  )
}
