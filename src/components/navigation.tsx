import { Home, Search, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export function Navigation() {
  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-primary text-xl font-bold">BuyOrRent</h1>
          <div className="hidden items-center space-x-2 md:flex">
            <Button variant="ghost" size="sm">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button variant="ghost" size="sm">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button variant="ghost" size="sm">
              <Heart className="mr-2 h-4 w-4" />
              Favorites
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
