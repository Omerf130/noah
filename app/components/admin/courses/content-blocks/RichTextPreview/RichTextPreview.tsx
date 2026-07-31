import styles from '../RichTextEditor/RichTextEditor.module.scss'

type RichTextPreviewProps = {
  html: string | null
  unavailableMessage?: string | null
}

export default function RichTextPreview({ html, unavailableMessage }: RichTextPreviewProps) {
  if (!html) {
    return (
      <p className={styles.previewUnavailable}>
        {unavailableMessage ?? 'לא ניתן להציג תצוגה מקדימה.'}
      </p>
    )
  }

  return (
    <div
      className={styles.preview}
      dir="rtl"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
