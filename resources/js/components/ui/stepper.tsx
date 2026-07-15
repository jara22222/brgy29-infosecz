import { cn } from "@/lib/utils"; // Adjust path to your utils
import { Check } from "lucide-react";
import React from "react";


export default function Stepperz(props:{ stepsCount:number, steps:Array<string> }) {
    const { stepsCount, steps } = props;
    
    return (
        
        <div className="mt-5 flex w-full items-start justify-between font-inter">
            {steps.map((label, index) => {
                const currentStep = stepsCount;
                const stepIndex = index + 1;
                const totalSteps = steps.length;
                const isActive = currentStep === stepIndex;
                const isCompleted = currentStep > stepIndex;

                return (
                    <React.Fragment key={index}>
                        <div className="flex flex-1 flex-col items-center gap-1 sm:gap-2">
                            <div
                                className={cn(
                                    'flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-medium transition-colors sm:h-8 sm:w-8 sm:text-sm',
                                    isActive
                                        ? 'border-gray-800 bg-gray-800 text-white'
                                        : isCompleted
                                          ? 'border-[#172F92] bg-[#172F92] text-white'
                                          : 'border-border bg-background text-gray-400',
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                                ) : (
                                    <span>{stepIndex}</span>
                                )}
                            </div>
                            <span
                                className={cn(
                                    'hidden text-[10px] font-medium sm:block sm:text-xs',
                                    isActive
                                        ? 'text-foreground'
                                        : isCompleted
                                          ? 'text-muted-foreground'
                                          : 'text-gray-400',
                                )}
                            >
                                <span className="mt-2 text-xs sm:text-sm md:text-base whitespace-nowrap">
                                     {label}
                                </span>
                               
                            </span>
                        </div>
                        {stepIndex < totalSteps && (
                            <div
                                className={cn(
                                    'mx-1 h-0.5 flex-1 transition-colors sm:mx-2',
                                    isCompleted ? 'bg-[#172F92]' : 'bg-gray-300',
                                )}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}