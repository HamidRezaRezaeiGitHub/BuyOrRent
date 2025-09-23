import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { buyOrRentSchema, type BuyOrRentFormData } from '@/schemas/buyOrRentSchema'
import type { BuyOrRentInputs } from '@/types/inputs'
import { InputPersistenceService } from '@/services/inputPersistence'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

interface BuyOrRentInputsSectionProps {
  onSubmit?: (data: BuyOrRentInputs) => void
}

export function BuyOrRentInputsSection({ onSubmit }: BuyOrRentInputsSectionProps) {
  const form = useForm<BuyOrRentFormData>({
    resolver: zodResolver(buyOrRentSchema),
    defaultValues: InputPersistenceService.loadInputs(),
    mode: 'onChange'
  })

  const { handleSubmit, reset, watch, control, formState: { isSubmitting } } = form

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
        {/* Empty form - all input fields removed as requested */}
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Form inputs have been cleared. Ready for step-by-step field addition.
          </p>
        </div>

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