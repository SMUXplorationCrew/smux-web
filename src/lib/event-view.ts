import type { Event } from '@/payload-types'
/** Strip rich text, internal fields and unrelated club content at the client boundary. */
export const eventView = (event: Event): Event => ({
  id: event.id,
  title: event.title,
  slug: event.slug,
  startsAt: event.startsAt,
  endsAt: event.endsAt,
  timeTbc: event.timeTbc,
  location: event.location,
  cost: event.cost,
  capacity: event.capacity,
  spotsTaken: event.spotsTaken,
  signupUrl: event.signupUrl,
  signupOpens: event.signupOpens,
  signupCloses: event.signupCloses,
  cover: event.cover,
  updatedAt: event.updatedAt,
  createdAt: event.createdAt,
  cancelled: event.cancelled,
  registrationMode: event.registrationMode,
  activity: event.activity,
  beginnerFriendly: event.beginnerFriendly,
  club:
    typeof event.club === 'object' && event.club
      ? {
          id: event.club.id,
          name: event.club.name,
          slug: event.club.slug,
          accent: event.club.accent,
          updatedAt: event.club.updatedAt,
          createdAt: event.club.createdAt,
        }
      : event.club,
})
