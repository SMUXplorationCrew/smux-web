import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { CALENDAR_EVENTS, MC_EVENTS } from './calendar-events'
import { CLUBS, SITE } from './content'
import { uploadImage } from './media'
import { richText } from './richText'

/**
 * Seeds the site with SMUX's real content and photo library.
 *
 * Club copy, FAQs, sessions, socials and achievements are theirs, transcribed from the
 * Vivace 2026 listings. Events come from the committee's own SMUX Calendar (2026).xlsx,
 * with Management Committee meetings excluded. Costs and venues the sources did not
 * state stay in [BRACKETS] so they are greppable.
 *
 * Safe to re-run: it clears the collections it owns first.
 */

const AY = 'AY26/27'

const seed = async () => {
  const payload = await getPayload({ config })

  console.log('Clearing existing content…')
  for (const collection of ['events', 'albums', 'people', 'pages', 'media', 'clubs'] as const) {
    await payload.delete({ collection, where: { id: { exists: true } } })
  }
  await payload.delete({
    collection: 'users',
    where: { email: { in: ['mc@smux.test', 'trekking@smux.test', 'member@smux.test'] } },
  })

  const clubIds = new Map<string, number | string>()

  for (const club of CLUBS) {
    console.log(`\n${club.name}`)

    const created = await payload.create({
      collection: 'clubs',
      data: {
        name: club.name,
        slug: club.slug,
        accent: club.slug,
        tagline: club.tagline,
        whoWeAre: richText(...club.whoWeAre),
        typicalSession: richText(...club.sessions),
        beginnerNotes: richText(...club.howToJoin),
        howToJoin: richText(...club.howToJoin),
        gearAndCost: richText(
          'Equipment is provided or available to loan for most sessions. See the FAQs below, or ask us before you come.',
        ),
        keyEvents: club.keyEvents.map((e) => ({ title: e.title, description: e.description })),
        faqs: club.faqs.map((f) => ({ question: f.question, answer: f.answer })),
        achievements: club.achievements.map((text) => ({ text })),
        socials: club.socials,
        _status: 'published',
      },
    })
    clubIds.set(club.slug, created.id)

    // Images are uploaded after the club exists so each one can be attributed to it,
    // which is what lets that club's editor manage its own media.
    console.log('  uploading hero…')
    const hero = await uploadImage(payload, club.hero.file, club.hero.alt, created.id)
    if (hero) {
      await payload.update({
        collection: 'clubs',
        id: created.id,
        data: { hero: hero.id as number },
      })
    }

    console.log(`  uploading ${club.gallery.length} gallery photos…`)
    const photoIds: number[] = []
    for (const photo of club.gallery) {
      const uploaded = await uploadImage(payload, photo.file, photo.alt, created.id)
      if (uploaded) photoIds.push(uploaded.id as number)
    }

    if (photoIds.length > 0) {
      await payload.create({
        collection: 'albums',
        data: {
          title: `${club.name} — highlights`,
          club: created.id as number,
          date: '2026-08-01T00:00:00.000Z',
          photos: photoIds,
        },
      })
    }

    console.log(`  uploading ${club.people.length} committee photos…`)
    for (const person of club.people) {
      const photo = await uploadImage(
        payload,
        person.file,
        `${person.name}, ${person.role} of ${club.name}`,
        created.id,
      )
      await payload.create({
        collection: 'people',
        data: {
          name: person.name,
          role: person.role,
          club: created.id as number,
          ay: AY,
          ...(photo ? { photo: photo.id as number } : {}),
        },
      })
    }
  }

  console.log(`\nCreating ${CALENDAR_EVENTS.length} events from the committee calendar…`)
  for (const event of CALENDAR_EVENTS) {
    // Nominal 10am SGT. Never displayed — `timeTbc` makes the site render the date
    // alone — but a datetime column still needs a value, and midnight would sort and
    // group oddly around timezone boundaries.
    const startsAt = new Date(`${event.date}T10:00:00+08:00`).toISOString()

    /**
     * The calendar carries no sign-up windows, so these are derived by one stated
     * rule: open three weeks ahead, close two days before. That keeps the three
     * sign-up states honest relative to today rather than hand-picked per event, and
     * it is the only field here not taken from the spreadsheet.
     */
    const start = new Date(startsAt)
    const signupOpens = new Date(start.getTime() - 21 * 86400000).toISOString()
    const signupCloses = new Date(start.getTime() - 2 * 86400000).toISOString()

    await payload.create({
      collection: 'events',
      data: {
        title: event.title,
        slug: event.slug,
        club: clubIds.get(event.club) as number,
        startsAt,
        timeTbc: true,
        location: '[VENUE TBC]',
        cost: '[COST TBC]',
        signupUrl: 'https://example.com/[SIGN-UP FORM TO BE LINKED]',
        signupOpens,
        signupCloses,
        description: richText(
          `${event.title} — run by ${CLUBS.find((c) => c.slug === event.club)?.name ?? 'SMUX'}. Full details to follow.`,
        ),
        _status: 'published',
      },
    })
  }

  // The main committee sits above the six clubs: its photo and people carry no club,
  // which is what puts them on /committee rather than any club page.
  console.log('\nMain Committee')
  const mcPhoto = await uploadImage(
    payload,
    '../SMUX MC Photo.png',
    'The SMUX main committee, who run SMUX across all six clubs',
  )
  console.log(`Creating ${MC_EVENTS.length} SMUX-wide events…`)
  for (const event of MC_EVENTS) {
    const startsAt = new Date(`${event.date}T10:00:00+08:00`).toISOString()
    const start = new Date(startsAt)

    await payload.create({
      collection: 'events',
      data: {
        title: event.title,
        slug: event.slug,
        // No club: run by the main committee for all of SMUX.
        timeTbc: true,
        startsAt,
        location: '[VENUE TBC]',
        cost: '[COST TBC]',
        signupUrl: 'https://example.com/[SIGN-UP FORM TO BE LINKED]',
        signupOpens: new Date(start.getTime() - 21 * 86400000).toISOString(),
        signupCloses: new Date(start.getTime() - 2 * 86400000).toISOString(),
        description: richText(`${event.title} — a SMUX-wide event. Full details to follow.`),
        _status: 'published',
      },
    })
  }

  console.log('Creating pages…')
  await payload.create({
    collection: 'pages',
    data: {
      title: 'About SMUX',
      slug: 'about',
      intro: 'The outdoor and adventure wing of SMU, since 2000.',
      blocks: [
        { blockType: 'richText', content: richText(...SITE.about) },
        {
          blockType: 'faq',
          items: SITE.faqs.map((f) => ({ question: f.question, answer: richText(f.answer) })),
        },
      ],
      _status: 'published',
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Join SMUX',
      slug: 'join',
      intro: 'No experience needed. Bring an open mind and your spirit for adventure.',
      blocks: [
        {
          blockType: 'richText',
          content: richText(
            'Our activities are open to all SMU students — you do not need to be a member to join in. Pick a club below, follow their Telegram and Instagram, and sign up when their events open.',
            'If you would like priority sign-ups, member-exclusive benefits and discounts on selected events and merchandise, you can purchase a membership from any SMUX club. Club members are automatically recognised as SMUX members and enjoy both club-specific and SMUX-wide benefits.',
          ),
        },
        {
          blockType: 'cta',
          heading: 'Find your club',
          body: 'Six clubs, all welcoming beginners. Start with whichever one sounds most like you.',
          buttonLabel: 'Browse the clubs',
          buttonUrl: '/clubs',
        },
      ],
      _status: 'published',
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Contact',
      slug: 'contact',
      intro: 'Reach the main committee, or go straight to a club.',
      blocks: [
        {
          blockType: 'richText',
          content: richText(
            `The fastest way to reach us is by email at ${SITE.socials.email}, or through our Telegram and Instagram. For anything club-specific, contact the club directly using the details below.`,
          ),
        },
      ],
      _status: 'published',
    },
  })

  console.log('Creating site settings…')
  await payload.updateGlobal({
    slug: 'siteSettings',
    data: {
      motto: SITE.motto,
      about: richText(...SITE.about),
      ...(mcPhoto ? { committeePhoto: mcPhoto.id as number } : {}),
      stats: SITE.stats,
      socials: SITE.socials,
      faqs: SITE.faqs,
      banner: { enabled: false, text: '', url: '' },
    },
  })

  console.log('Creating users…')
  await payload.create({
    collection: 'users',
    data: { email: 'mc@smux.test', password: 'test1234', name: 'Main Committee', role: 'mc' },
  })
  await payload.create({
    collection: 'users',
    data: {
      email: 'trekking@smux.test',
      password: 'test1234',
      name: 'Trekking Editor',
      role: 'editor',
      club: clubIds.get('trekking') as number,
    },
  })
  await payload.create({
    collection: 'users',
    data: { email: 'member@smux.test', password: 'test1234', name: 'Member', role: 'member' },
  })

  console.log('\nSeed complete.')
  console.log('  mc@smux.test / test1234        (full access)')
  console.log('  trekking@smux.test / test1234  (Trekking only)')
  console.log('  member@smux.test / test1234    (resources only)')
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
