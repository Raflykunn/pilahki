import { cva } from 'class-variance-authority'

export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-emerald-600 text-white shadow-xs hover:bg-emerald-700',
        secondary: 'border-transparent bg-zinc-100 text-zinc-800 hover:bg-zinc-200',
        destructive: 'border-transparent bg-red-100 text-red-700 border-red-200',
        outline: 'text-zinc-700 border-zinc-200 bg-white/70',
        organik: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-medium',
        anorganik: 'bg-blue-50 text-blue-800 border-blue-200/80 font-medium',
        b3: 'bg-amber-50 text-amber-800 border-amber-200/80 font-medium',
        residu: 'bg-zinc-100 text-zinc-800 border-zinc-300 font-medium',
        success: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)
