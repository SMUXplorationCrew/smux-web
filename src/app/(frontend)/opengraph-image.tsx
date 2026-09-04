import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og'

export const alt = 'SMUX — SMUXploration Crew'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  return ogImage({
    eyebrow: 'Singapore Management University',
    title: 'SMUXploration Crew',
    meta: 'Six clubs. Diving, kayaking, trekking, biking, skating, XSeed.',
  })
}
