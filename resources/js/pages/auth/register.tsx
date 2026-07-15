import AccountInfo from '@/components/registerComponents/accountInfo';
import AddressInfo from '@/components/registerComponents/addressInfo';
import BasicInfo from '@/components/registerComponents/basicInfo';
import ContactsInfo from '@/components/registerComponents/contactsInfo';
import RegisterHeader from '@/components/registerComponents/registerHeader';
import TermsCondition from '@/components/registerComponents/termsCondition';
import { Button } from '@/components/ui/button';
import Stepperz from '@/components/ui/stepper';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { RecaptchaErrorAlert } from '@/components/auth/recaptcha-error-alert';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

// Constants
const REGISTRATION_STEPS = [
    'Basic info',
    'Address info',
    'Contact info',
    'Account info',
    'Verification',
];

const HEADER_DESCRIPTIONS = {
    basicInfo:
        'Please provide your personal details so we can identify you correctly. This information helps the barangay confirm your identity and maintain accurate records.',
    addressInfo:
        'Tell us where you currently live within the barangay. Your address helps us verify your residency and process your requests properly.',
    contactInfo:
        'Create your login details to access your barangay account anytime. Keep your password safe to protect your personal information.',
    accountInfo:
        'Create your login details to access your barangay account anytime. Keep your password safe to protect your personal information.',
};

const INITIAL_FORM_DATA = {
    name: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    civilStatus: '',
    dateOfBirth: '',
    birthMonth: '',
    birthDate: '',
    birthYear: '',
    street: '',
    purok: '',
    barangay: '',
    city: '',
    province: '',
    postal: '',
    email: '',
    mobileNo: '',
    userName: '',
    password: '',
    password_confirmation: '',
    recaptcha_token: '',
};

const TOTAL_STEPS = REGISTRATION_STEPS.length;

// Helper Functions
const formatDateOfBirth = (
    year: string,
    month: string,
    date: string,
): string => {
    const paddedMonth = String(month).padStart(2, '0');
    const paddedDate = String(date).padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDate}`;
};

const getStepWithError = (
    errors: Record<string, string | undefined>,
): number => {
    if (
        errors.firstName ||
        errors.lastName ||
        errors.dateOfBirth ||
        errors.civilStatus ||
        errors.gender
    ) {
        return 1;
    }
    if (
        errors.street ||
        errors.purok ||
        errors.barangay ||
        errors.city ||
        errors.province ||
        errors.postal
    ) {
        return 2;
    }
    if (errors.email || errors.mobileNo) {
        return 3;
    }
    if (errors.name) {
        return 1;
    }
    if (errors.userName || errors.password || errors.password_confirmation) {
        return 4;
    }
    return 1; // Default to first step
};

export default function Register() {
    // State
    const [currentStep, setCurrentStep] = useState(1);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
    const { executeRecaptcha } = useGoogleReCaptcha();

    // Form
    const { data, setData, post, processing, errors, reset, setError, clearErrors, transform } =
        useForm(INITIAL_FORM_DATA);

    // Auto-update dateOfBirth when birth fields change
    useEffect(() => {
        const { birthMonth, birthDate, birthYear, dateOfBirth } = data;

        if (birthMonth && birthDate && birthYear && !dateOfBirth) {
            const formattedDate = formatDateOfBirth(
                birthYear,
                birthMonth,
                birthDate,
            );
            setData('dateOfBirth', formattedDate);
        }
    }, [
        data.birthMonth,
        data.birthDate,
        data.birthYear,
        data.dateOfBirth,
        setData,
    ]);

    // Validation
    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                return !!(
                    data.firstName &&
                    data.lastName &&
                    data.birthMonth &&
                    data.birthDate &&
                    data.birthYear &&
                    data.civilStatus
                );
            case 2:
                return !!(
                    data.street &&
                    data.purok &&
                    data.barangay &&
                    data.city &&
                    data.province &&
                    data.postal
                );
            case 3: {
                const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
                const isValidMobile = data.mobileNo && data.mobileNo.length >= 12;
                const emailAvailable = !errors.email;
                return !!(data.email && isValidEmail && isValidMobile && emailAvailable);
            }
            case 4:
                const pw = data.password;
                const isValidPassword = 
                    pw.length >= 12 && 
                    /[A-Z]/.test(pw) && 
                    /[a-z]/.test(pw) && 
                    /[0-9]/.test(pw) && 
                    /[^A-Za-z0-9]/.test(pw) && 
                    !pw.toLowerCase().includes('admin');
                
                return !!(
                    data.userName &&
                    data.password &&
                    isValidPassword &&
                    data.password_confirmation &&
                    data.password === data.password_confirmation
                );
            case 5:
                return termsAccepted;
            default:
                return false;
        }
    };

    // Navigation Handlers
    const handleNext = () => {
        if (validateStep(currentStep) && currentStep < TOTAL_STEPS) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Form Submission
    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        setRecaptchaError(null);

        if (!validateStep(TOTAL_STEPS)) {
            return;
        }

        let token = 'development_bypass_token';

        if (executeRecaptcha) {
            try {
                token = await executeRecaptcha('register');
            } catch {
                setRecaptchaError(
                    'Security verification could not be completed. Please refresh and try again.',
                );
                return;
            }
        }

            transform((current) => {
                let finalDateOfBirth = current.dateOfBirth;
                if (!finalDateOfBirth && current.birthMonth && current.birthDate && current.birthYear) {
                    finalDateOfBirth = formatDateOfBirth(
                        current.birthYear,
                        current.birthMonth,
                        current.birthDate,
                    );
                }

                let finalName = current.name;
                if (!finalName) {
                    finalName = `${current.firstName} ${current.lastName}`.trim();
                }

                return {
                    ...current,
                    dateOfBirth: finalDateOfBirth,
                    name: finalName,
                    recaptcha_token: token,
                };
            });

            post('/register', {
                onFinish: () => reset('password', 'password_confirmation', 'recaptcha_token'),
                onError: (submissionErrors) => {
                    setData('recaptcha_token', '');
                    const errorStep = getStepWithError(submissionErrors);
                    setCurrentStep(errorStep);
                },
            });
    };

    // Step Content Renderer
    const renderStepContent = () => {
        const formProps = { data, setData, errors, setError, clearErrors };

        switch (currentStep) {
            case 1:
                return <BasicInfo form={formProps} />;
            case 2:
                return <AddressInfo form={formProps} />;
            case 3:
                return <ContactsInfo form={formProps} />;
            case 4:
                return <AccountInfo form={formProps} />;
            case 5:
                return (
                    <TermsCondition
                        accepted={termsAccepted}
                        onAcceptChange={setTermsAccepted}
                    />
                );
            default:
                return null;
        }
    };

    // Error Display Component
    const ErrorDisplay = () => {
        const errorKeys = Object.keys(errors);
        if (errorKeys.length === 0) return null;

        return (
            <div className="mb-4 rounded-md bg-red-50 p-4">
                <h3 className="mb-2 text-sm font-medium text-red-800">
                    Please fix the following errors:
                </h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-red-700">
                    {errorKeys.map((key) => {
                        const errorMessage = errors[key as keyof typeof errors];
                        return (
                            <li key={key}>
                                <strong>{key}:</strong> {String(errorMessage)}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

    // Navigation Buttons Component
    const NavigationButtons = () => (
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            {currentStep > 1 && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={processing}
                    className="w-full sm:w-auto"
                >
                    Back
                </Button>
            )}
            <div
                className={
                    currentStep > 1
                        ? 'w-full border sm:ml-auto sm:w-auto'
                        : 'flex w-full justify-end sm:ml-auto'
                }
            >
                {currentStep < TOTAL_STEPS ? (
                    <Button
                        type="button"
                        onClick={handleNext}
                        disabled={processing || !validateStep(currentStep)}
                        className="w-full bg-[#172F92] hover:bg-[#1a3ba8] sm:w-auto"
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        disabled={processing || !validateStep(TOTAL_STEPS)}
                        className="w-full bg-[#172F92] hover:bg-[#1a3ba8] sm:w-auto"
                    >
                        Register Account
                    </Button>
                )}
            </div>
        </div>
    );

    const recaptchaFailureMessage =
        errors.recaptcha_token ?? recaptchaError ?? undefined;

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted p-4 sm:p-6 lg:p-8">
            <Head title="Landing Page - Register" />

            {/* 2. CARD CONTAINER: Increased max-width to 'max-w-5xl' for the stepper */}
            <div className="flex w-full max-w-5xl flex-col items-center rounded-2xl border border-border bg-background shadow-xl">
                {/* 3. INNER CONTENT: Added xl:px-12 for better spacing on large screens */}
                <div className="flex w-full flex-col items-center px-4 py-8 sm:px-10 sm:py-10 xl:px-12">
                    {/* Logo */}
                    <div className="mb-6 flex justify-center sm:mb-8">
                        <img
                            src="/myassets/Logo.png"
                            alt="BRGY. 29-C ONLINE PORTAL"
                            className="h-16 w-auto sm:h-20"
                        />
                    </div>

                    {/* Title Section */}
                    <div className="mb-8 text-center sm:mb-10">
                        <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
                            Join the Barangay Online Portal
                        </h1>
                        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                            Sign up now to request documents easily and securely
                            online.
                        </p>
                    </div>

                    {/* Progress Stepper - Now has room to stretch across the 5xl container */}
                    <div className="mb-10 w-full px-2 sm:px-4">
                        <Stepperz
                            stepsCount={currentStep}
                            steps={REGISTRATION_STEPS}
                        />
                    </div>

                    {/* Form Container - Constrained slightly so inputs don't look too wide */}
                    <div className="w-full max-w-4xl">
                        <form onSubmit={handleSubmit}>
                            {recaptchaFailureMessage && (
                                <div className="mb-4">
                                    <RecaptchaErrorAlert message={recaptchaFailureMessage as string} />
                                </div>
                            )}
                            <ErrorDisplay />

                            <div className="mb-6">
                                <RegisterHeader
                                    headerDesc={HEADER_DESCRIPTIONS}
                                    steps={currentStep}
                                />
                            </div>

                            {/* Dynamic Height for Step Content */}
                            <div className="mb-8 min-h-[300px]">
                                {renderStepContent()}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="mt-6 flex w-full justify-center">
                                <div className="w-full max-w-4xl">
                                    <NavigationButtons />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
