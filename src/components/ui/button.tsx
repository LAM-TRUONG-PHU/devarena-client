import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default: "border bg-pink_primary text-primary-foreground hover:brightness-95",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-foreground  bg-transparent hover:border-pink_primary hover:text-pink_primary hover:bg-white text-foreground ",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:text-pink_primary ",
                link: "text-primary underline-offset-4 hover:underline",
                submit: "text-white bg-[#2BC672] hover:brightness-95",
                "run-dark": "text-foreground bg-white hover:brightness-95",
                "run-light": "text-white bg-foreground hover:brightness-95",
                cancel: "font-semibold text-foreground bg-gray-100 hover:brightness-95  rounded-lg ",
            },
            size: {
                default: "h-8 px-12 py-2 rounded-xl",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "px-4 py-2 rounded-xl",
                editor: "h-8 w-40 py-2 rounded-xl",
                account: "h-fit w-full px-14 py-2  rounded-lg",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
