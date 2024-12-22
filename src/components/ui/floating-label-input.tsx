import * as React from "react"
import { cn } from "@/lib/utils"

export interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  label: string
  as?: 'input' | 'select' | 'textarea'
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, FloatingLabelInputProps>(
  ({ className, type, label, as = 'input', ...props }, ref) => {
    const id = React.useId()
    const Component = as

    return (
      <div className="relative">
        <Component
          type={type}
          className={cn(
            "block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer",
            as === 'textarea' && "min-h-[100px]",
            as === 'select' && "h-16",
            className
          )}
          placeholder=" "
          id={id}
          ref={ref as any}
          {...props}
        />
        <label
          htmlFor={id}
          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
        >
          {label}
        </label>
      </div>
    )
  }
)
FloatingLabelInput.displayName = "FloatingLabelInput"

export { FloatingLabelInput }

