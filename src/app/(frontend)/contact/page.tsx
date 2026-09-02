import type { Metadata } from 'next'
import { EditorialPage } from '@/components/EditorialPage'
import { Container, Section } from '@/components/Section'
import { getClubs, getPageBySlug } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('contact')
  return {
    title: page?.title ?? 'Contact',
    description: page?.intro ?? 'How to reach SMUX and each of the six clubs.',
  }
}

export default async function ContactPage() {
  const [page, clubs] = await Promise.all([getPageBySlug('contact'), getClubs()])

  return (
    <>
      <EditorialPage
        fallbackNote='Create a Page in the CMS with the slug "contact" to add an introduction here.'
        fallbackTitle="Contact"
        page={page}
      />

      <Section className="bg-off" eyebrow="By club" title="Reach a club directly">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club) => (
            <div className="bg-paper p-6" data-club={club.accent ?? club.slug} key={club.id}>
              <h3 className="text-card text-accent">{club.name}</h3>
              <ul className="mt-3 flex flex-col gap-1">
                {club.socials?.email ? (
                  <li>
                    <a
                      className="flex min-h-11 items-center text-meta break-words text-orange-text underline underline-offset-2"
                      href={`mailto:${club.socials.email}`}
                    >
                      {club.socials.email}
                    </a>
                  </li>
                ) : null}
                {club.socials?.telegram ? (
                  <li className="text-meta text-copy">{club.socials.telegram}</li>
                ) : null}
                {club.socials?.instagram ? (
                  <li className="text-meta text-copy">
                    @{club.socials.instagram.replace(/^@/, '')}
                  </li>
                ) : null}
                {!club.socials?.email && !club.socials?.telegram && !club.socials?.instagram ? (
                  <li className="text-meta text-muted">[CONTACT TO BE CONFIRMED]</li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>

        {clubs.length === 0 ? (
          <Container className="px-0">
            <p className="text-meta text-muted">Club contacts will appear here once added.</p>
          </Container>
        ) : null}
      </Section>
    </>
  )
}
