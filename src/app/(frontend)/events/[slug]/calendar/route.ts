import { calendarFile } from '@/lib/ical'
import { getEventBySlug } from '@/lib/payload'
import { siteUrl } from '@/lib/site'
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return new Response('Not found', { status: 404 })
  return new Response(calendarFile([event], siteUrl), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="event-${event.id}.ics"`,
      'Cache-Control': 'public, max-age=300',
    },
  })
}
