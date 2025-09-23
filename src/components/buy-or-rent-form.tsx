import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { buyOrRentSchema, type BuyOrRentFormData } from '@/schemas/buyOrRentSchema'
import type { BuyOrRentInputs } from '@/types/inputs'
import { InputPersistenceService } from '@/services/inputPersistence'
import { FormField } from '@/components/ui/form-field'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BuyOrRentFormProps {
  onSubmit?: (data: BuyOrRentInputs) => void
  className?: string
}

export function BuyOrRentForm({ onSubmit, className }: BuyOrRentFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<BuyOrRentFormData>({
    resolver: zodResolver(buyOrRentSchema),
    defaultValues: InputPersistenceService.loadInputs(),
    mode: 'onChange'
  })

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
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={cn('space-y-6', className)}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Property Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Property Information</h3>
          <FormField
            control={control}
            name="homePrice"
            label="Home Price"
            type="number"
            step="1000"
            min="1"
            prefix="$"
            placeholder="500000"
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
          <h3 className="text-lg font-semibold">Mortgage Information</h3>
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

        {/* Rental Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Rental Information</h3>
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

        {/* Investment Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Investment Information</h3>
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

        {/* Other Costs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Other Costs</h3>
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
            step="10"
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
            suffix="% of home value"
            placeholder="1"
            description="Annual maintenance cost as percentage of home value"
          />
        </div>

        {/* Tax & Analysis Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Tax & Analysis</h3>
          <FormField
            control={control}
            name="taxRate"
            label="Income Tax Rate"
            type="number"
            step="0.1"
            min="0"
            max="50"
            suffix="%"
            placeholder="25"
            description="Your marginal income tax rate"
          />
          <FormField
            control={control}
            name="yearsToAnalyze"
            label="Years to Analyze"
            type="number"
            step="1"
            min="1"
            max="50"
            suffix="years"
            placeholder="10"
            description="How many years to run the analysis"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Calculating...' : 'Calculate'}
        </Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          Reset to Defaults
        </Button>
      </div>

      {/* Show validation errors summary */}
      {Object.keys(errors).length > 0 && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-4">
          <h4 className="font-medium text-destructive">Please fix the following errors:</h4>
          <ul className="mt-2 list-inside list-disc text-sm text-destructive">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>
                {field}: {error?.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  )
}