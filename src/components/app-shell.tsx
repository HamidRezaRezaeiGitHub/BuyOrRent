import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { BuyOrRentInputsSection } from '@/components/buy-or-rent-inputs'
import { BuyOrRentOutputsSection } from '@/components/buy-or-rent-outputs'
import type { BuyOrRentInputs } from '@/types/inputs'

interface AppShellProps {
  onInputsChange?: (data: BuyOrRentInputs) => void
}

export function AppShell({ onInputsChange }: AppShellProps) {
  const [inputsOpen, setInputsOpen] = useState(true)
  const [outputsOpen, setOutputsOpen] = useState(false)
  const [currentInputs, setCurrentInputs] = useState<BuyOrRentInputs | null>(null)

  const handleInputsSubmit = (data: BuyOrRentInputs) => {
    setCurrentInputs(data)
    onInputsChange?.(data)
    
    // When inputs are submitted, expand outputs section
    setOutputsOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Inputs Section */}
      <Collapsible open={inputsOpen} onOpenChange={setInputsOpen}>
        <Card>
          <CardHeader className="pb-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex w-full justify-between p-0 h-auto">
                <CardTitle className="text-xl">Inputs</CardTitle>
                {inputsOpen ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <BuyOrRentInputsSection onSubmit={handleInputsSubmit} />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Outputs Section */}
      <Collapsible open={outputsOpen} onOpenChange={setOutputsOpen}>
        <Card>
          <CardHeader className="pb-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex w-full justify-between p-0 h-auto">
                <CardTitle className="text-xl">Outputs</CardTitle>
                {outputsOpen ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <BuyOrRentOutputsSection inputs={currentInputs} />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  )
}