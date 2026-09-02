/**
 * The shape Payload generates for a richText field. Deliberately not
 * `SerializedEditorState` from lexical: the generated field type carries an index
 * signature that the lexical type lacks, so the two are not assignable.
 */
export interface LexicalState {
  [k: string]: unknown
  root: {
    type: string
    children: { [k: string]: unknown; type: string; version: number }[]
    direction: 'ltr' | 'rtl' | null
    format: '' | 'left' | 'start' | 'center' | 'right' | 'end' | 'justify'
    indent: number
    version: number
  }
}

/**
 * Builds the editor state a richText field expects. Hand-writing this JSON at every
 * call site would bury the seed's actual content in boilerplate.
 */
export const richText = (...paragraphs: string[]): LexicalState => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      textFormat: 0,
      children: [
        {
          type: 'text',
          text,
          format: 0,
          style: '',
          mode: 'normal',
          detail: 0,
          version: 1,
        },
      ],
    })),
  },
})
