import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background select-none transition-all duration-150 ease-out will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:border-b-0 disabled:translate-y-0 active:translate-y-[3px] active:duration-75 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-[#3b82f6] to-[#2563eb] text-white border border-[#1d4ed8] border-b-[4px] border-b-[#1e40af] shadow-[0_4px_0_#1e40af,0_10px_20px_-6px_rgba(37,99,235,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] hover:from-[#60a5fa] hover:to-[#1d4ed8] hover:-translate-y-[1px] hover:shadow-[0_6px_0_#1e40af,0_14px_28px_-6px_rgba(37,99,235,0.6),inset_0_1px_0_rgba(255,255,255,0.32)] hover:brightness-[1.02] active:shadow-[0_1px_0_#1e40af,0_3px_10px_rgba(37,99,235,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] active:border-b-[2px] dark:from-[#3b82f6] dark:to-[#1d4ed8] dark:border-[#1e40af] dark:border-b-[#1e3a8a] dark:shadow-[0_4px_0_#1e3a8a,0_10px_20px_-6px_rgba(59,130,246,0.45),inset_0_1px_0_rgba(255,255,255,0.18)]",
        destructive:
          "bg-gradient-to-b from-[#f87171] to-[#ef4444] text-white border border-[#dc2626] border-b-[4px] border-b-[#991b1b] shadow-[0_4px_0_#991b1b,0_10px_20px_-6px_rgba(239,68,68,0.45),inset_0_1px_0_rgba(255,255,255,0.22)] hover:from-[#fca5a5] hover:to-[#dc2626] hover:-translate-y-[1px] hover:shadow-[0_6px_0_#991b1b,0_14px_28px_-6px_rgba(239,68,68,0.55),inset_0_1px_0_rgba(255,255,255,0.28)] active:shadow-[0_1px_0_#991b1b,0_3px_10px_rgba(239,68,68,0.35)] active:border-b-[2px]",
        success:
          "bg-gradient-to-b from-[#22c55e] to-[#16a34a] text-white border border-[#15803d] border-b-[4px] border-b-[#166534] shadow-[0_4px_0_#166534,0_10px_20px_-6px_rgba(22,163,74,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] hover:from-[#4ade80] hover:to-[#15803d] hover:-translate-y-[1px] hover:shadow-[0_6px_0_#166534,0_14px_28px_-6px_rgba(22,163,74,0.55),inset_0_1px_0_rgba(255,255,255,0.32)] active:shadow-[0_1px_0_#166534,0_3px_10px_rgba(22,163,74,0.35)] active:border-b-[2px]",
        outline:
          "bg-white text-foreground border-2 border-[#e4e4e7] border-b-[4px] border-b-[#d4d4d8] shadow-[0_4px_0_#d4d4d8,0_6px_12px_-6px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] hover:bg-zinc-50 hover:-translate-y-[1px] hover:shadow-[0_6px_0_#d4d4d8,0_10px_18px_-6px_rgba(0,0,0,0.12)] active:shadow-[0_1px_0_#d4d4d8,0_2px_8px_rgba(0,0,0,0.06)] active:border-b-[2px] dark:bg-zinc-900 dark:text-zinc-100 dark:border-[#3f3f46] dark:border-b-[#27272a] dark:shadow-[0_4px_0_#18181b,0_6px_12px_-6px_rgba(0,0,0,0.35)] dark:hover:bg-zinc-800",
        secondary:
          "bg-gradient-to-b from-white to-[#f4f4f5] text-zinc-900 border border-[#e4e4e7] border-b-[4px] border-b-[#d4d4d8] shadow-[0_4px_0_#d4d4d8,0_6px_14px_-6px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.95)] hover:to-[#e4e4e7] hover:-translate-y-[1px] hover:shadow-[0_6px_0_#d4d4d8,0_10px_18px_-6px_rgba(0,0,0,0.14)] active:shadow-[0_1px_0_#d4d4d8] active:border-b-[2px] dark:from-[#3f3f46] dark:to-[#27272a] dark:text-zinc-100 dark:border-[#52525b] dark:border-b-[#18181b] dark:shadow-[0_4px_0_#18181b,0_6px_14px_-6px_rgba(0,0,0,0.4)] dark:hover:from-[#52525b] dark:hover:to-[#27272a]",
        ghost:
          "bg-transparent border border-transparent border-b-[3px] border-b-transparent shadow-none hover:bg-accent hover:text-accent-foreground hover:border-b-[#e4e4e7] hover:shadow-[0_3px_0_#e4e4e7,0_4px_10px_rgba(0,0,0,0.06)] hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-none active:border-b-[1px] dark:hover:border-b-[#3f3f46] dark:hover:shadow-[0_3px_0_#27272a]",
        link: "text-primary underline-offset-4 hover:underline shadow-none border-none bg-transparent !h-auto !p-0 !rounded-none font-medium active:translate-y-0",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-14 rounded-xl px-8 text-base",
        icon: "h-11 w-11 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
