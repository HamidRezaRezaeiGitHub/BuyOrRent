import { useState } from 'react'
import { FlexibleNavbar } from './components/navbar'
import { CompactThemeToggle } from './components/theme'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './components/ui/collapsible'
import { Button } from './components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

function App() {
  const [inputSectionOpen, setInputSectionOpen] = useState(true)
  const [resultsSectionOpen, setResultsSectionOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Flexible Navbar with Compact Theme Toggle */}
      <FlexibleNavbar
        brandText="BuyOrRent"
        showAuthButtons={false}
        showThemeToggle={true}
        ThemeToggleComponent={CompactThemeToggle}
      />
      
      {/* Main content with wrapper card */}
      <main className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">Welcome to BuyOrRent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upper Section - Input Fields (default open) */}
            <Collapsible open={inputSectionOpen} onOpenChange={setInputSectionOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full justify-between"
                >
                  <span className="text-lg font-semibold">Input Fields</span>
                  {inputSectionOpen ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    Input fields for different categories will appear here...
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Lower Section - Results/Reports/Graphs (default closed) */}
            <Collapsible open={resultsSectionOpen} onOpenChange={setResultsSectionOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full justify-between"
                >
                  <span className="text-lg font-semibold">Analysis & Reports</span>
                  {resultsSectionOpen ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    Results of analysis, reports, and graphs will be displayed here...
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default App
