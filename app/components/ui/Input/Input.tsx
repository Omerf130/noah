import type { InputHTMLAttributes } from 'react'
import styles from './Input.module.scss'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

export default function Input({ label, id, className = '', ...props }: InputProps) {
  const inputId = id || props.name

  return (
    <div className={[styles.group, className].filter(Boolean).join(' ')}>
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} {...props} />
    </div>
  )
}
