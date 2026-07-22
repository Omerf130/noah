import styles from './AuthFormMessage.module.scss'

type AuthFormMessageProps = {
  message?: string
}

export default function AuthFormMessage({ message }: AuthFormMessageProps) {
  if (!message) {
    return null
  }

  return (
    <p className={styles.formError} role="alert">
      {message}
    </p>
  )
}
