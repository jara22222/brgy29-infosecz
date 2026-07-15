import { cn } from "@/lib/utils"; // Adjust path to your utils
import { Check } from "lucide-react";


export default function Stepperz(props:{ stepsCount:number, steps:Array<string> }) {
    const { stepsCount, steps } = props;
    
    return (
        
        <div className="w-200 font-inter text-center  flex items-start justify-between mt-5">
            {
                steps.map((label, index) => { 
                    const currentStep = stepsCount;
                    const stepIndex = index + 1;
                    const totalSteps = steps.length;    
                    return (
                        <div key={index} className="flex flex-1 items-start">
                            <div className="flex items-center flex-col" >
                            {
                                 (stepIndex <= totalSteps) && <>
                                    
                                    {currentStep > stepIndex -1 ? <>
                                         <div className="border h-7 bg-[#172F92] text-white w-7 rounded-full">
                                            <span>
                                              {stepIndex} </span>  
                                        </div>   
                                    </> : <>
                                     <div className="border h-7 bg-background border-[#172F92] text-[#172F92] w-7 rounded-full">
                                                <span>
                                                      {stepIndex}   
                                                  </span>
                                        </div>   
                                      </>}
                                        
                                    
                                </> 
                           
                                    
                            }
                            {label}
                        </div>
                        {
                            (stepIndex <= totalSteps - 1) && <>
                                 {currentStep > stepIndex ?
                                    <div className={cn("flex-1 h-1 rounded-full", currentStep > stepIndex ? "bg-[#172F92]" : "bg-gray-300")}></div>
                                    :
                                    <div className={cn("flex-1 h-1 rounded-full", currentStep === stepIndex ? "bg-[#172F92]" : "bg-gray-300")}></div>
                                 }
                         </>  
                        } 
                            </div>
                        
                    );
                })
          }
          
        </div>
    );
}