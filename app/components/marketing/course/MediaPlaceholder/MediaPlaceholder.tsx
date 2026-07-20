import styles from './MediaPlaceholder.module.scss'

type MediaPlaceholderProps = {
  videoUrl: string | null
  title?: string
  placeholderText?: string
}

export default function MediaPlaceholder({
  videoUrl,
  title = 'סרטון הסילבוס',
  placeholderText = 'סרטון הסילבוס יעלה בקרוב. אפשר להשאיר פרטים ונעדכן כשיהיה זמין.',
}: MediaPlaceholderProps) {
  if (videoUrl) {
    return (
      <div className={styles.wrapper}>
        <video className={styles.video} controls preload="metadata" src={videoUrl}>
          הדפדפן שלכם לא תומך בתגית וידאו.
        </video>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.placeholder} aria-label={title}>
        <div className={styles.icon} aria-hidden="true">
          ▶
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>{placeholderText}</p>
      </div>
    </div>
  )
}
