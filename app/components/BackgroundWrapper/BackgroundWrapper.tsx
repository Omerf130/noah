import styles from './BackgroundWrapper.module.scss'

export default function BackgroundWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.backgroundWrapper}>
      {children}
    </div>
  )
}

