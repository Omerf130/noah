'use client'

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from 'react'
import styles from './ConfirmDialog.module.scss'

export function supportsNativeDialog(): boolean {
  if (typeof HTMLDialogElement === 'undefined') {
    return false
  }

  return typeof HTMLDialogElement.prototype.showModal === 'function'
}

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  onClose: () => void
  confirmDisabled?: boolean
  isPending?: boolean
  destructive?: boolean
  children?: ReactNode
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  )
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'ביטול',
  onConfirm,
  onClose,
  confirmDisabled = false,
  isPending = false,
  destructive = false,
  children,
}: ConfirmDialogProps) {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const useNativeDialog = supportsNativeDialog()

  const closeDialog = useCallback(() => {
    if (isPending) {
      return
    }

    onClose()
  }, [isPending, onClose])

  useEffect(() => {
    if (!open) {
      if (useNativeDialog && dialogRef.current?.open) {
        dialogRef.current.close()
      }

      if (triggerRef.current) {
        triggerRef.current.focus()
        triggerRef.current = null
      }

      return
    }

    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null

    const focusContainer = useNativeDialog ? dialogRef.current : panelRef.current
    if (!focusContainer) {
      return
    }

    const focusable = getFocusableElements(focusContainer)
    focusable[0]?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeDialog()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeDialog, open, useNativeDialog])

  useEffect(() => {
    if (!open || !useNativeDialog || !dialogRef.current) {
      return
    }

    if (!dialogRef.current.open) {
      dialogRef.current.showModal()
    }
  }, [open, useNativeDialog])

  if (!open) {
    return null
  }

  const content = (
    <>
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      <p id={descriptionId} className={styles.description}>
        {description}
      </p>
      {children ? <div className={styles.body}>{children}</div> : null}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={closeDialog}
          disabled={isPending}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className={[
            styles.confirmButton,
            destructive ? styles.confirmButtonDestructive : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={onConfirm}
          disabled={confirmDisabled || isPending}
        >
          {isPending ? 'מבצע...' : confirmLabel}
        </button>
      </div>
    </>
  )

  if (useNativeDialog) {
    return (
      <dialog
        ref={dialogRef}
        className={styles.backdrop}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onCancel={(event) => {
          event.preventDefault()
          closeDialog()
        }}
        onClose={closeDialog}
      >
        <div className={styles.panel}>{content}</div>
      </dialog>
    )
  }

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closeDialog()
        }
      }}
    >
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        {content}
      </div>
    </div>
  )
}
