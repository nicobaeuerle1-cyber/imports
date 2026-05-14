import { cn } from '@/lib/utils/cn'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="font-sans text-xs font-medium tracking-wide text-muted uppercase"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'h-11 w-full rounded-sm border bg-surface px-4',
            'font-sans text-sm text-foreground placeholder:text-subtle',
            'border-border focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30',
            'transition-colors duration-200',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive/60 focus:border-destructive focus:ring-destructive/20',
            className,
          )}
          {...props}
        />
        {error && (
          <p className="font-sans text-xs text-destructive">{error}</p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }
