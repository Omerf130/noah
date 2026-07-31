import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

export const richTextExtensions = [
  StarterKit.configure({
    heading: {
      levels: [2, 3],
    },
    blockquote: {},
    bulletList: {},
    orderedList: {},
    listItem: {},
    bold: {},
    italic: {},
    hardBreak: {},
    code: false,
    codeBlock: false,
    horizontalRule: false,
    strike: false,
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    linkOnPaste: true,
    HTMLAttributes: {
      rel: 'noopener noreferrer',
      target: '_blank',
    },
  }),
]
