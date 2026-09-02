import type { Metadata } from 'next'
import { EditorialPage } from '@/components/EditorialPage'
import { getPageBySlug } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('about')
  return {
    title: page?.title ?? 'About',
    description: page?.intro ?? 'Who SMUXploration Crew are and what we do.',
  }
}

export default async function AboutPage() {
  const page = await getPageBySlug('about')

  return (
    <EditorialPage
      fallbackNote='Create a Page in the CMS with the slug "about" and its content will appear here.'
      fallbackTitle="About SMUX"
      page={page}
    />
  )
}
