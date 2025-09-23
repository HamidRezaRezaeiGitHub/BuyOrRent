import { Moon, Sun } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/hooks/use-theme'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Determine if we should show dark mode
    if (theme === 'dark') {
      setIsDark(true)
    } else if (theme === 'light') {
      setIsDark(false)
    } else {
      // system theme - check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(prefersDark)
    }
  }, [theme])

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light')
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4" />
      <Switch
        checked={isDark}
        onCheckedChange={handleToggle}
        className="relative"
        aria-label="Toggle theme"
      />
      <Moon className="h-4 w-4" />
    </div>
  )
}
