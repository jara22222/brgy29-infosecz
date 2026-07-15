import { Award, Check, ClipboardEdit, Eye, Folder, Send } from 'lucide-react';

interface StepData {
    step: number;
    icon: React.ComponentType<{ className?: string; size?: number }>;
    theme: 'blue' | 'yellow';
    description: string;
}

const steps: StepData[] = [
    {
        step: 1,
        icon: ClipboardEdit,
        theme: 'blue',
        description:
            'Fill out the complete application form for a Barangay Certificate.',
    },
    {
        step: 2,
        icon: Send,
        theme: 'yellow',
        description:
            'Submit the completed form through the provided platform or at the barangay office.',
    },
    {
        step: 3,
        icon: Eye,
        theme: 'blue',
        description:
            'Check the status of your requested document in your account.',
    },
    {
        step: 4,
        icon: Folder,
        theme: 'yellow',
        description:
            'Prepare and bring the necessary requirement to the barangay office.',
    },
    {
        step: 5,
        icon: Check,
        theme: 'blue',
        description:
            'Present your requirements to the barangay staff for verification.',
    },
    {
        step: 6,
        icon: Award,
        theme: 'yellow',
        description:
            'Receive your printed Barangay Certificate — absolutely FREE.',
    },
];

export default function Process() {
    return (
        <div className="w-full py-6 md:py-8 lg:py-12">
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                    Procedure in processing the document
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl">
                    Paraan ng pag proseso sa dokyumento
                </p>
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {steps.map((step) => {
                    const Icon = step.icon;
                    const isBlueTheme = step.theme === 'blue';

                    return (
                        <div
                            key={step.step}
                            className="flex flex-col items-center rounded-xl bg-background p-8 text-center shadow-lg"
                        >
                            {/* Icon Container */}
                            <div
                                className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl md:h-20 md:w-20 ${
                                    isBlueTheme
                                        ? 'bg-blue-100'
                                        : 'bg-yellow-100'
                                }`}
                            >
                                <Icon
                                    size={32}
                                    className={`md:size-40 ${
                                        isBlueTheme
                                            ? 'text-blue-600'
                                            : 'text-yellow-600'
                                    }`}
                                />
                            </div>

                            {/* Step Label */}
                            <h3 className="mb-3 text-lg font-bold text-foreground md:text-xl">
                                Step {step.step}
                            </h3>

                            {/* Description */}
                            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                                {step.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
