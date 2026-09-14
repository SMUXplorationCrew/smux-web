import type { Metadata } from 'next'
import { EditorialPage } from '@/components/EditorialPage'
import { getPageBySlug } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('join')
  return {
    title: page?.title ?? 'Join',
    description: page?.intro ?? 'How to join SMUXploration Crew.',
  }
}

export default async function JoinPage() {
  const page = await getPageBySlug('join')

  return (
    <EditorialPage
      fallbackNote='Create a Page in the CMS with the slug "join" and its content will appear here.'
      fallbackTitle="Join SMUX"
      page={page}
    />
  )
}
