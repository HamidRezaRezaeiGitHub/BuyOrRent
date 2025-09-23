import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { buyOrRentSchema, type BuyOrRentFormData } from '@/schemas/buyOrRentSchema'
import type { BuyOrRentInputs } from '@/types/inputs'
import { InputPersistenceService } from '@/services/inputPersistence'
import { FormField } from '@/components/ui/form-field'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Form } from '@/components/ui/form'

interface BuyOrRentInputsSectionProps {
  onSubmit?: (data: BuyOrRentInputs) => void
}

export function BuyOrRentInputsSection({ onSubmit }: BuyOrRentInputsSectionProps) {
  const [buyingOpen, setBuyingOpen] = useState(true)
  const [rentingOpen, setRentingOpen] = useState(true)
  const [otherOpen, setOtherOpen] = useState(false)

  const form = useForm<BuyOrRentFormData>({
    resolver: zodResolver(buyOrRentSchema),
    defaultValues: InputPersistenceService.loadInputs(),
    mode: 'onChange'
  })

  const { control, handleSubmit, reset, watch, formState: { isSubmitting } } = form

  // Watch all form values for auto-save
  const watchedValues = watch()

  // Auto-save to localStorage when form values change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      InputPersistenceService.saveInputs(watchedValues as BuyOrRentInputs)
    }, 500) // Debounce save by 500ms

    return () => clearTimeout(timeoutId)
  }, [watchedValues])

  const handleFormSubmit = (data: BuyOrRentFormData) => {
    InputPersistenceService.saveInputs(data as BuyOrRentInputs)
    onSubmit?.(data as BuyOrRentInputs)
  }

  const handleReset = () => {
    InputPersistenceService.clearInputs()
    reset(InputPersistenceService.loadInputs())
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Buying-related Inputs */}
        <Collapsible open={buyingOpen} onOpenChange={setBuyingOpen}>
          <Card>
            <CardHeader className="pb-3">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex w-full justify-between p-0 h-auto">
                  <CardTitle className="text-lg">Buying Information</CardTitle>
                  {buyingOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Property Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-muted-foreground">Property Details</h4>
                    <FormField
                      control={control}
                      name="homePrice"
                      label="Home Price"
                      type="number"
                      step="1000"
                      min="1"
                      prefix="$"
                      placeholder="500,000"
                      description="Total purchase price of the home"
                    />
                    <FormField
                      control={control}
                      name="downPayment"
                      label="Down Payment"
                      type="number"
                      step="1000"
                      min="0"
                      prefix="$"
                      placeholder="100000"
                      description="Amount you'll pay upfront"
                    />
                  </div>

                  {/* Mortgage Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-muted-foreground">Mortgage Details</h4>
                    <FormField
                      control={control}
                      name="mortgageRate"
                      label="Mortgage Interest Rate"
                      type="number"
                      step="0.1"
                      min="0"
                      max="30"
                      suffix="%"
                      placeholder="6.5"
                      description="Annual interest rate for the mortgage"
                    />
                    <FormField
                      control={control}
                      name="loanTerm"
                      label="Loan Term"
                      type="number"
                      step="1"
                      min="1"
                      max="50"
                      suffix="years"
                      placeholder="30"
                      description="Length of the mortgage in years"
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Renting-related Inputs */}
        <Collapsible open={rentingOpen} onOpenChange={setRentingOpen}>
          <Card>
            <CardHeader className="pb-3">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex w-full justify-between p-0 h-auto">
                  <CardTitle className="text-lg">Renting Information</CardTitle>
                  {rentingOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium text-muted-foreground">Rental Details</h4>
                    <FormField
                      control={control}
                      name="monthlyRent"
                      label="Monthly Rent"
                      type="number"
                      step="50"
                      min="1"
                      prefix="$"
                      placeholder="2500"
                      description="Current monthly rent you're paying or would pay"
                    />
                    <FormField
                      control={control}
                      name="rentGrowthRate"
                      label="Annual Rent Growth Rate"
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      suffix="%"
                      placeholder="3"
                      description="Expected annual increase in rent"
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-muted-foreground">Investment Alternative</h4>
                    <FormField
                      control={control}
                      name="sp500GrowthRate"
                      label="S&P 500 Growth Rate"
                      type="number"
                      step="0.1"
                      min="-10"
                      max="30"
                      suffix="%"
                      placeholder="10"
                      description="Expected annual return from S&P 500 investment"
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Other Costs */}
        <Collapsible open={otherOpen} onOpenChange={setOtherOpen}>
          <Card>
            <CardHeader className="pb-3">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex w-full justify-between p-0 h-auto">
                  <CardTitle className="text-lg">Additional Costs & Settings</CardTitle>
                  {otherOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium text-muted-foreground">Ownership Costs</h4>
                    <FormField
                      control={control}
                      name="propertyTax"
                      label="Annual Property Tax"
                      type="number"
                      step="100"
                      min="0"
                      prefix="$"
                      placeholder="6000"
                      description="Annual property tax amount"
                    />
                    <FormField
                      control={control}
                      name="homeInsurance"
                      label="Annual Home Insurance"
                      type="number"
                      step="50"
                      min="0"
                      prefix="$"
                      placeholder="1200"
                      description="Annual home insurance premium"
                    />
                    <FormField
                      control={control}
                      name="hoa"
                      label="Monthly HOA Fees"
                      type="number"
                      step="25"
                      min="0"
                      prefix="$"
                      placeholder="0"
                      description="Monthly homeowners association fees"
                    />
                    <FormField
                      control={control}
                      name="maintenance"
                      label="Annual Maintenance"
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      suffix="%"
                      placeholder="1"
                      description="Annual maintenance cost as % of home value"
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-muted-foreground">Analysis Settings</h4>
                    <FormField
                      control={control}
                      name="taxRate"
                      label="Income Tax Rate"
                      type="number"
                      step="1"
                      min="0"
                      max="50"
                      suffix="%"
                      placeholder="25"
                      description="Your marginal income tax rate"
                    />
                    <FormField
                      control={control}
                      name="yearsToAnalyze"
                      label="Analysis Period"
                      type="number"
                      step="1"
                      min="1"
                      max="50"
                      suffix="years"
                      placeholder="10"
                      description="How many years to analyze"
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Calculating...' : 'Calculate Results'}
          </Button>
        </div>
      </form>
    </Form>
  )
}