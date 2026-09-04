import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import { richTextConverters } from '@/components/richTextConverters'

interface RichTextProps {
  data: SerializedEditorState | null | undefined
  className?: string
}

/**
 * Wraps Payload's Lexical renderer so pages never have to null-check editor state, and
 * so prose styling lives in one place. Returns nothing at all for empty content rather
 * than an empty wrapper that would still take up grid space.
 *
 * The converters are ours rather than Payload's defaults — see richTextConverters for
 * what each one changes and why.
 */
export const RichText = ({ data, className = '' }: RichTextProps) => {
  if (!data) return null

  return (
    <div className={`rich-text ${className}`}>
      <LexicalRichText converters={richTextConverters} data={data} />
    </div>
  )
}
