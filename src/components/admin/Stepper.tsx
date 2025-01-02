import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";

interface StepperProps {
    steps: string[];
    currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
    const router = useRouter();

    return (
        <div className="relative flex items-center justify-center w-full mb-8">
            {/* Button for navigation */}
            <Button
                type="button"
                variant="outline"
                onClick={() => {
                    router.back();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-0 w-8 h-8 rounded-full flex items-center justify-center"
            >
                <IoIosArrowRoundBack className="w-10 h-10" />
            </Button>

            {/* Steps */}
            <div className="flex items-center w-fit">
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
                            {index < currentStep ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
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
        </div>
    );
}
