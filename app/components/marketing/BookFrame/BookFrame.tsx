import Image from 'next/image'
import styles from './BookFrame.module.scss'

type BookFrameProps = {
  src: string
  alt: string
  priority?: boolean
  className?: string
}

export default function BookFrame({ src, alt, priority = false, className = '' }: BookFrameProps) {
  return (
    <div className={[styles.frame, className].filter(Boolean).join(' ')}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.accentRing} aria-hidden="true" />
      <div className={styles.imageWrap}>
        <Image src={src} alt={alt} width={520} height={640} className={styles.image} priority={priority} />
      </div>
    </div>
  )
}
