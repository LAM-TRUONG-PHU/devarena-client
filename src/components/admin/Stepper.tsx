import { Check } from 'lucide-react'
import { cn } from "@/lib/utils"

interface StepperProps {
  steps: string[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center w-full mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full border-2",
              index < currentStep
                ? "bg-primary border-primary text-primary-foreground"
                : index === currentStep
                ? "border-primary text-primary"
                : "border-gray-300 text-gray-300"
            )}
          >
            {index < currentStep ? (
              <Check className="w-5 h-5" />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-12 h-1 mx-2",
                index < currentStep ? "bg-primary" : "bg-gray-300"
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

