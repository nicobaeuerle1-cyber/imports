import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center font-sans text-2xs font-medium tracking-widest uppercase px-2.5 py-1 rounded-sm',
  {
    variants: {
      variant: {
        available:
          'bg-success/10 text-success border border-success/20',
        reserved:
          'bg-warning/10 text-warning border border-warning/20',
        sold: 'bg-destructive/10 text-destructive border border-destructive/20',
        draft:
          'bg-surface-elevated text-subtle border border-border',
        performance:
          'bg-gold/10 text-gold border border-gold/20',
        luxury:
          'bg-foreground/5 text-foreground border border-border',
        german_from_korea:
          'bg-foreground/5 text-muted border border-border',
        default:
          'bg-surface-elevated text-muted border border-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  )
}

export { badgeVariants, type BadgeVariant }
