import './App.css'
import { Navigation } from '@/components/navigation'
import { BuyOrRentForm } from '@/components/buy-or-rent-form'
import type { BuyOrRentInputs } from '@/types/inputs'

function App() {
  const handleFormSubmit = (data: BuyOrRentInputs) => {
    console.log('Form submitted with data:', data)
    // Here you would typically calculate the buy vs rent analysis
    // For now, we'll just log the data
  }

  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      <main className="container mx-auto py-8 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-foreground mb-4 text-4xl font-bold">
              Buy or Rent Calculator
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Enter your financial details to see whether buying or renting makes more sense for you
            </p>
          </div>
          
          <BuyOrRentForm onSubmit={handleFormSubmit} />
        </div>
      </main>
    </div>
  )
}

export default App
