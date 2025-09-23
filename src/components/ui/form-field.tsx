import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FormFieldProps<T extends FieldValues> {
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

export function FormField<T extends FieldValues>({
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
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('space-y-2', className)}>
          <Label htmlFor={name}>{label}</Label>
          <div className="relative">
            {prefix && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {prefix}
              </div>
            )}
            <Input
              {...field}
              id={name}
              type={type}
              step={step}
              min={min}
              max={max}
              placeholder={placeholder}
              className={cn(
                prefix && 'pl-8',
                suffix && 'pr-8',
                error && 'border-destructive'
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
          {description && !error && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {error && (
            <p className="text-xs text-destructive">{error.message}</p>
          )}
        </div>
      )}
    />
  )
}