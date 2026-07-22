import type { ReactElement } from 'react'

export type IconName = 'book' | 'calendar' | 'heart' | 'checklist' | 'sparkle' | 'chart'

type IconProps = {
  name: IconName
  className?: string
  size?: number
}

export default function Icon({ name, className = '', size = 24 }: IconProps) {
  const icons: Record<IconName, ReactElement> = {
    book: (
      <path
        fill="currentColor"
        d="M6 4a2 2 0 0 1 2-2h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a2 2 0 0 0-2 2V4zm2 0v14h9V3H8z"
      />
    ),
    calendar: (
      <path
        fill="currentColor"
        d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1zm11 8H6v8h12v-8z"
      />
    ),
    heart: (
      <path
        fill="currentColor"
        d="M12 20.5l-1.1-1C5.4 14.9 2 12.1 2 8.5 2 5.9 4 4 6.5 4c1.5 0 2.9.7 3.8 1.8L12 7.5l1.7-1.7C14.6 4.7 16 4 17.5 4 20 4 22 5.9 22 8.5c0 3.6-3.4 6.4-8.9 11L12 20.5z"
      />
    ),
    checklist: (
      <path
        fill="currentColor"
        d="M7 3a1 1 0 0 1 1 1v1h10V4a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V4a1 1 0 0 1 1-1zm0 8a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H7zm5-1a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1zm-5 5a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H7zm5-1a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1z"
      />
    ),
    sparkle: (
      <path
        fill="currentColor"
        d="M12 2l1.8 5.5L19 9l-5.2 1.5L12 16l-1.8-5.5L5 9l5.2-1.5L12 2zm6 10 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zM5 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z"
      />
    ),
    chart: (
      <path
        fill="currentColor"
        d="M5 20a1 1 0 0 1-1-1V10a1 1 0 1 1 2 0v9h13a1 1 0 1 1 0 2H5zm4-6a1 1 0 0 1-1-1V6a1 1 0 1 1 2 0v7H9zm4 3a1 1 0 0 1-1-1V9a1 1 0 1 1 2 0v7h-1zm4-5a1 1 0 0 1-1-1V4a1 1 0 1 1 2 0v7h-1z"
      />
    ),
  }

  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}
