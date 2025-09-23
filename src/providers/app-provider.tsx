import React from 'react'
import { ThemeProvider } from '@/hooks/use-theme'

interface AppProviderProps {
  children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="buyorrent-theme">
      {children}
    </ThemeProvider>
  )
}
