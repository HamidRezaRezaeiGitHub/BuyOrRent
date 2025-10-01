import { FlexibleNavbar } from './components/navbar'

function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Flexible Navbar */}
      <FlexibleNavbar
        brandText="BuyOrRent"
        showAuthButtons={false}
        showThemeToggle={false}
      />
      
      {/* Main content - Empty home page as requested */}
      <main className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to BuyOrRent
          </h1>
          <p className="text-lg text-muted-foreground">
            Home page content coming soon...
          </p>
        </div>
      </main>
    </div>
  )
}

export default App
