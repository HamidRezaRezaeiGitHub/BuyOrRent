import { Github } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer className="border-t bg-background py-6">
      <div className="container mx-auto flex items-center justify-center px-4">
        <Button variant="ghost" size="sm" asChild>
          <a 
            href="https://github.com/HamidRezaRezaeiGitHub/BuyOrRent" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2"
          >
            <Github className="h-4 w-4" />
            <span>View on GitHub</span>
          </a>
        </Button>
      </div>
    </footer>
  )
}