import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'
import { forwardRef } from 'react'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 font-sans text-sm font-medium',
    'transition-all duration-200 ease-luxury',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-40',
    'whitespace-nowrap tracking-wide',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98]',
        ghost: 'bg-transparent text-muted hover:text-foreground hover:bg-surface-elevated',
        outline: 'border border-border text-foreground hover:bg-surface-elevated hover:border-subtle active:scale-[0.98]',
        gold: 'bg-gold text-background hover:bg-gold-light active:scale-[0.98]',
        danger: 'bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-sm',
        md: 'h-10 px-6 rounded-sm',
        lg: 'h-12 px-8 text-base rounded-sm',
        xl: 'h-14 px-10 text-base tracking-widest uppercase text-xs rounded-sm',
        icon: 'h-10 w-10 rounded-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonVariants }
