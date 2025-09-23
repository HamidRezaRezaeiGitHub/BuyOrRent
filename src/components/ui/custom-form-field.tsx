import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormDescription,
  FormField as ShadcnFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'

interface CustomFormFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  placeholder?: string
  type?: string
  step?: string
  min?: string
  max?: string
  className?: string
  description?: string
  prefix?: string
  suffix?: string
}

export function CustomFormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  step,
  min,
  max,
  className,
  description,
  prefix,
  suffix,
}: CustomFormFieldProps<T>) {
  return (
    <ShadcnFormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              {prefix && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {prefix}
                </div>
              )}
              <Input
                {...field}
                type={type}
                step={step}
                min={min}
                max={max}
                placeholder={placeholder}
                className={cn(
                  prefix && 'pl-8',
                  suffix && 'pr-8'
                )}
                onChange={(e) => {
                  const value = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
                  field.onChange(value)
                }}
              />
              {suffix && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {suffix}
                </div>
              )}
            </div>
          </FormControl>
          {description && (
            <FormDescription>
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}