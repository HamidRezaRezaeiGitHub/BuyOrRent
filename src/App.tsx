import './App.css'
import { Navigation } from '@/components/navigation'

function App() {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      <main className="container mx-auto py-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-foreground mb-4 text-4xl font-bold">
            Welcome to BuyOrRent
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            A modern React application with shadcn/ui, dark mode support, and
            beautiful design
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">🏠 Buy Properties</h3>
              <p className="text-muted-foreground text-sm">
                Find your dream home with our comprehensive property listings
              </p>
            </div>
            <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">🏢 Rent Spaces</h3>
              <p className="text-muted-foreground text-sm">
                Discover rental properties that fit your lifestyle and budget
              </p>
            </div>
            <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">
                📊 Market Analytics
              </h3>
              <p className="text-muted-foreground text-sm">
                Get insights with our advanced charting and analytics tools
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
