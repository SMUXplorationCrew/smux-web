import { httpUrl } from '@/lib/url'
import type { Event } from '@/payload-types'
export interface ReadinessIssue {
  field: string
  message: string
  severity: 'error' | 'warning'
}
export const eventReadiness = (event: Partial<Event>): ReadinessIssue[] => {
  const issues: ReadinessIssue[] = []
  const add = (field: string, message: string, severity: 'error' | 'warning' = 'warning') =>
    issues.push({ field, message, severity })
  if (!event.title?.trim()) add('title', 'Add an event title.', 'error')
  if (!event.startsAt || !Number.isFinite(Date.parse(event.startsAt)))
    add('startsAt', 'Set a valid date.', 'error')
  if (event.endsAt && event.startsAt && Date.parse(event.endsAt) < Date.parse(event.startsAt))
    add('endsAt', 'End must be after start.', 'error')
  if (event.signupUrl && !httpUrl(event.signupUrl))
    add('signupUrl', 'Use a valid HTTP or HTTPS signup URL.', 'error')
  if (event.registrationMode !== 'native' && !httpUrl(event.signupUrl))
    add(
      'signupUrl',
      'Add the registration link when confirmed; visitors currently see details coming soon.',
    )
  if (!event.cover) add('cover', 'Choose a representative event photo.')
  if (!event.location)
    add('location', 'Confirm the meeting place or describe when it will be announced.')
  if (event.timeTbc) add('timeTbc', 'Event time is still unconfirmed.')
  if (!event.organizerContact) add('organizerContact', 'Add an organizer contact for questions.')
  if (!event.cost) add('cost', 'Confirm whether this activity is free or paid.')
  return issues
}
