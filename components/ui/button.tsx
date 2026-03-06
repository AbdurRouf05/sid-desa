import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
// Note: Radix Slot is optional if we don't need 'asChild', but good for polymorphism.
// I will assume we might need it, but if I don't install @radix-ui/react-slot, I should remove it.
// For now, I'll stick to a standard button without Slot to avoid extra deps unless requested.
// REVISION: Simplest implementation without Radix for now to minimize bloat, unless specified.
// The plan didn't specify Radix.

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
    {
        variants: {
            variant: {
                default: "bg-desa-primary text-white hover:bg-desa-primary-dark shadow-lg shadow-desa-primary/10",
                gold: "bg-gradient-to-r from-desa-accent-light to-desa-accent text-white font-bold hover:shadow-md hover:scale-105",
                outline: "border border-desa-primary text-desa-primary hover:bg-desa-primary/10 bg-transparent",
                ghost: "hover:bg-slate-100 text-slate-700",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-5 py-2",
                sm: "h-9 rounded-full px-4",
                lg: "h-12 rounded-full px-8 text-base",
                icon: "h-10 w-10",
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
        // Simplified: No Slot support yet to keep deps low.
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
