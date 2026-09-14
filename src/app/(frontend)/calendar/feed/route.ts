import { calendarFile } from '@/lib/ical'
import { getClubs, getEvents } from '@/lib/payload'
import { siteUrl } from '@/lib/site'
export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get('club')
  const clubs = await getClubs()
  const club = slug ? clubs.find((c) => c.slug === slug) : null
  if (slug && !club) return new Response('Unknown club', { status: 404 })
  const events = await getEvents(club ? { clubId: club.id } : {})
  return new Response(calendarFile(events, siteUrl, club?.name || 'SMUX events'), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'Content-Disposition': 'inline; filename="smux-calendar.ics"',
    },
  })
}
