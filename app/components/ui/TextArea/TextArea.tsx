import type { TextareaHTMLAttributes } from 'react'
import styles from './TextArea.module.scss'

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
}

export default function TextArea({ label, id, className = '', ...props }: TextAreaProps) {
  const textareaId = id || props.name

  return (
    <div className={[styles.group, className].filter(Boolean).join(' ')}>
      <label htmlFor={textareaId}>{label}</label>
      <textarea id={textareaId} {...props} />
    </div>
  )
}
