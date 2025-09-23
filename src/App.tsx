import './App.css'
import { Navigation } from '@/components/navigation'
import { AppShell } from '@/components/app-shell'
import { Footer } from '@/components/footer'
import { Separator } from '@/components/ui/separator'
import type { BuyOrRentInputs } from '@/types/inputs'

function App() {
  const handleInputsChange = (data: BuyOrRentInputs) => {
    console.log('Inputs changed:', data)
    // Here you can perform any global state updates if needed
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Navigation stays at the top always */}
      <Navigation />
      
      {/* Separator below navbar */}
      <Separator />
      
      {/* Main content with AppShell */}
      <main className="container mx-auto py-8 px-4 flex-1">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-foreground mb-4 text-4xl font-bold">
              Buy or Rent Calculator
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Enter your financial details to see whether buying or renting makes more sense for you
            </p>
          </div>
          
          {/* AppShell with collapsible sections */}
          <AppShell onInputsChange={handleInputsChange} />
        </div>
      </main>
      
      {/* Separator above footer */}
      <Separator />
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
