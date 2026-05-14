import { cn } from '@/lib/utils/cn'
import { forwardRef } from 'react'

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'min-h-[120px] w-full rounded-sm border bg-surface px-4 py-3',
            'font-sans text-sm text-foreground placeholder:text-subtle',
            'border-border focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30',
            'transition-colors duration-200 resize-y',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive/60 focus:border-destructive',
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

Textarea.displayName = 'Textarea'

export { Textarea }
