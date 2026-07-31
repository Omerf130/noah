'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import { useEffect, useRef, useState } from 'react'
import { richTextExtensions } from '../../../../../../lib/courses/rendering/rich-text-extensions'
import type { RichTextValidatedDocument } from '../../../../../../lib/courses/validators/content-block/rich-text-document'
import styles from './RichTextEditor.module.scss'

type RichTextEditorProps = {
  initialDocumentJson: string
  fieldName?: string
  disabled?: boolean
  onDocumentChange?: (documentJson: string) => void
}

function parseInitialDocument(documentJson: string): RichTextValidatedDocument {
  try {
    return JSON.parse(documentJson) as RichTextValidatedDocument
  } catch {
    return {
      type: 'doc',
      content: [{ type: 'paragraph' }],
    }
  }
}

export default function RichTextEditor({
  initialDocumentJson,
  fieldName = 'documentJson',
  disabled = false,
  onDocumentChange,
}: RichTextEditorProps) {
  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const [linkUrl, setLinkUrl] = useState('')
  const initialDocument = parseInitialDocument(initialDocumentJson)

  const editor = useEditor({
    extensions: richTextExtensions,
    content: initialDocument,
    immediatelyRender: false,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: styles.editorContent,
        dir: 'rtl',
        'aria-label': 'עורך טקסט עשיר',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      const json = JSON.stringify(currentEditor.getJSON())
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = json
      }
      onDocumentChange?.(json)
    },
  })

  useEffect(() => {
    if (!editor) {
      return
    }

    editor.setEditable(!disabled)
  }, [disabled, editor])

  useEffect(() => {
    if (!editor || !hiddenInputRef.current) {
      return
    }

    hiddenInputRef.current.value = JSON.stringify(editor.getJSON())
  }, [editor])

  if (!editor) {
    return null
  }

  const setLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      setLinkUrl('')
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl.trim() }).run()
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar} role="toolbar" aria-label="עיצוב טקסט">
        <button
          type="button"
          className={editor.isActive('paragraph') ? styles.toolbarButtonActive : styles.toolbarButton}
          onClick={() => editor.chain().focus().setParagraph().run()}
          disabled={disabled}
          aria-label="פסקה"
        >
          P
        </button>
        <button
          type="button"
          className={
            editor.isActive('heading', { level: 2 }) ? styles.toolbarButtonActive : styles.toolbarButton
          }
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={disabled}
          aria-label="כותרת 2"
        >
          H2
        </button>
        <button
          type="button"
          className={
            editor.isActive('heading', { level: 3 }) ? styles.toolbarButtonActive : styles.toolbarButton
          }
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          disabled={disabled}
          aria-label="כותרת 3"
        >
          H3
        </button>
        <button
          type="button"
          className={editor.isActive('bold') ? styles.toolbarButtonActive : styles.toolbarButton}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          aria-label="מודגש"
        >
          B
        </button>
        <button
          type="button"
          className={editor.isActive('italic') ? styles.toolbarButtonActive : styles.toolbarButton}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          aria-label="נטוי"
        >
          I
        </button>
        <button
          type="button"
          className={editor.isActive('bulletList') ? styles.toolbarButtonActive : styles.toolbarButton}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          aria-label="רשימת תבליטים"
        >
          •
        </button>
        <button
          type="button"
          className={editor.isActive('orderedList') ? styles.toolbarButtonActive : styles.toolbarButton}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          aria-label="רשימה ממוספרת"
        >
          1.
        </button>
        <button
          type="button"
          className={editor.isActive('blockquote') ? styles.toolbarButtonActive : styles.toolbarButton}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={disabled}
          aria-label="ציטוט"
        >
          "
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled || !editor.can().chain().focus().undo().run()}
          aria-label="בטל"
        >
          ↶
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().chain().focus().redo().run()}
          aria-label="בצע שוב"
        >
          ↷
        </button>
      </div>

      <div className={styles.linkControls}>
        <input
          type="url"
          className={styles.linkInput}
          value={linkUrl}
          onChange={(event) => setLinkUrl(event.target.value)}
          placeholder="https://example.com"
          aria-label="כתובת קישור"
          disabled={disabled}
        />
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={setLink}
          disabled={disabled}
          aria-label="הוסף או הסר קישור"
        >
          קישור
        </button>
      </div>

      <div className={styles.editorShell}>
        <EditorContent editor={editor} />
      </div>

      <input
        ref={hiddenInputRef}
        type="hidden"
        name={fieldName}
        defaultValue={initialDocumentJson}
        className={styles.hiddenInput}
        readOnly
      />
    </div>
  )
}
