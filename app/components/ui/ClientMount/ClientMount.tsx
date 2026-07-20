'use client'

import { useEffect, useState, type ReactNode } from 'react'

type ClientMountProps = {
  children: ReactNode
  fallback?: ReactNode
}

export default function ClientMount({ children, fallback = null }: ClientMountProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return fallback
  }

  return children
}
