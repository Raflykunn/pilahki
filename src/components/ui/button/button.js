import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 active:scale-[0.98]',
        destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-600/20 active:scale-[0.98]',
        outline: 'border border-zinc-200 bg-white hover:bg-zinc-100/80 hover:text-zinc-900 text-zinc-700 active:scale-[0.98]',
        secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200/80 active:scale-[0.98]',
        ghost: 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 active:scale-[0.98]',
        link: 'text-emerald-600 underline-offset-4 hover:underline p-0 h-auto font-semibold',
        accent: 'bg-emerald-50 text-emerald-700 border border-emerald-200/70 hover:bg-emerald-100 active:scale-[0.98]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        xs: 'h-7 rounded-md px-2.5 text-xs',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-6 text-base font-semibold',
        icon: 'h-9 w-9 p-0',
        'icon-sm': 'h-7 w-7 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
