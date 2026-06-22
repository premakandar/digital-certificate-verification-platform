import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[7px] text-[18px] font-medium whitespace-nowrap outline-none select-none disabled:pointer-events-none disabled:bg-disabled disabled:text-fg-disabled disabled:border disabled:border-light disabled:shadow-none disabled:opacity-100 disabled:cursor-not-allowed aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "btn-fill",
        secondary: "btn-fill btn-secondary",
        tertiary: "btn-fill btn-tertiary",
        destructive: "btn-fill btn-danger",
        ghost: "bg-transparent text-heading border-transparent hover:bg-neutral-secondary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-medium focus-visible:outline-offset-2",
        link: "text-fg-brand underline-offset-4 hover:no-underline underline font-medium",
      },
      size: {
        default: "h-auto py-[10px] px-[40px]",
        sm: "h-auto py-[8px] px-[20px] text-[14px]",
        xs: "h-auto py-[6px] px-[12px] text-[12px]",
        lg: "h-auto py-[12px] px-[48px]",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
