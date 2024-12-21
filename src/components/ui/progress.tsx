"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";
import { ELanguages } from "@/types/language";

const Progress = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
        variant?: ELanguages;
    }
>(({ className, value, variant, ...props }, ref) => (
    <ProgressPrimitive.Root
        ref={ref}
        className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
        {...props}
    >
        <ProgressPrimitive.Indicator
            className={`h-full w-full flex-1 ${
                variant == ELanguages.C
                    ? "bg-[#3949AB]"
                    : variant == ELanguages.Java
                    ? "bg-[#EA2D2E]"
                    : variant == ELanguages.Cpp
                    ? "bg-[#00599C"
                    : "bg-pink_primary"
            } transition-all`}
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
    </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
