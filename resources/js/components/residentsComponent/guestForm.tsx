import { router, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import RequirementsModal from './requirementsModal';
import { RecaptchaErrorAlert } from '@/components/auth/recaptcha-error-alert';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

interface FormErrors {
    [key: string]: string;
}

export default function GuestForm() {
    const { url } = usePage();
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const documentId = urlParams.get('document_id');
    const documentName = urlParams.get('document_name');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        purpose: '',
        document_id: documentId ? parseInt(documentId, 10) : '',
        document_name: documentName || '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
    const [backendErrors, setBackendErrors] = useState<FormErrors>({});
    const { executeRecaptcha } = useGoogleReCaptcha();

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setRecaptchaError(null);
        setBackendErrors({});

        // Validate form data
        if (!formData.name || !formData.address || !formData.purpose) {
            alert('Please fill in all required fields.');
            return;
        }

        // Set submitting state to disable form
        setIsSubmitting(true);

        let token = 'development_bypass_token';

        if (executeRecaptcha) {
            try {
                token = await executeRecaptcha('guest_request');
            } catch {
                setRecaptchaError('Security verification could not be completed. Please refresh and try again.');
                setIsSubmitting(false);
                return;
            }
        }

        try {

            // Create submission data without email field
            const submissionData = {
                name: formData.name,
                address: formData.address,
                purpose: formData.purpose,
                document_id: formData.document_id
                    ? parseInt(formData.document_id.toString(), 10)
                    : null,
                document_name: formData.document_name,
                recaptcha_token: token,
            };

            // Submit data to backend using Inertia
            router.post('/guest-certificate-request', submissionData, {
                onSuccess: () => {
                    // Show success modal after successful submission
                    setIsModalOpen(true);
                    // Reset form on successful submission
                    setFormData({
                        name: '',
                        email: '',
                        address: '',
                        purpose: '',
                        document_id: documentId || '',
                        document_name: documentName || '',
                    });
                    // Reset submitting state
                    setIsSubmitting(false);
                },
                onError: (errors: FormErrors) => {
                    setBackendErrors(errors);
                    // Display specific error messages
                    if (errors && typeof errors === 'object') {
                        const errorMessages = Object.values(errors).flat();
                        alert(
                            `Error submitting certificate request:\n${errorMessages.join('\n')}`,
                        );
                    } else {
                        alert(
                            'Error submitting certificate request. Please try again.',
                        );
                    }

                    // Reset submitting state on error
                    setIsSubmitting(false);
                    // Do NOT show modal on error
                },
            });
        } catch (error) {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        router.visit('/');
    };

    const handleConfirmSubmission = () => {
        // Close the modal after user confirms seeing the success message
        setIsModalOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const recaptchaFailureMessage = backendErrors.recaptcha_token ?? recaptchaError ?? undefined;

    return (
        <div className="w-full py-6 font-sans md:py-8 lg:py-12">
            {/* Main Header with Back Button */}
            <div className="mb-12">
                {/* Back Button */}
                <div className="mb-6">
                    <Button
                        onClick={handleBack}
                        variant="outline"
                        className="flex items-center gap-2 border-border bg-background text-muted-foreground hover:bg-muted"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </div>

                {/* Header Content */}
                <div className="text-center">
                    <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                        Guest Certificate Application Form
                    </h1>
                    <p className="text-lg text-muted-foreground md:text-xl">
                        Paraan ng pag proseso sa dokumento para sa mga
                        non-resident
                    </p>
                </div>
            </div>

            {/* Document Information */}
            {documentName && (
                <div className="mb-8 text-center">
                    <div className="mx-auto inline-block rounded-lg bg-blue-50 px-6 py-3">
                        <p className="text-sm text-blue-600">
                            Requesting Document:
                        </p>
                        <p className="text-lg font-semibold text-blue-800">
                            {documentName}
                        </p>
                    </div>
                </div>
            )}

            {/* Form Container */}
            <div className="mx-auto max-w-3xl">
                <form
                    onSubmit={handleSubmit}
                    className="overflow-hidden rounded-xl shadow-lg"
                >
                    {/* Card Header */}
                    <div className="bg-[#1e3a8a] px-6 py-4 md:px-8 md:py-6">
                        <h2 className="text-xl font-semibold text-white md:text-2xl">
                            Request Information
                        </h2>
                        <p className="mt-1 text-sm text-blue-100">
                            Please provide your details for the certificate
                            request
                        </p>
                    </div>

                    {/* Form Body */}
                    <div className="bg-background px-6 py-6 md:px-8 md:py-8">
                        {recaptchaFailureMessage && (
                            <div className="mb-6">
                                <RecaptchaErrorAlert message={recaptchaFailureMessage} />
                            </div>
                        )}
                        <div className="space-y-6">
                            {/* Field 1: Name */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-medium text-muted-foreground"
                                >
                                    Full Name*
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Juan Dela Cruz"
                                    required
                                    disabled={isSubmitting}
                                    className="w-full rounded-lg border border-border px-4 py-3 text-foreground placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                                />
                            </div>

                            {/* Field 2: Email (Optional) */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-muted-foreground"
                                >
                                    Email Address (Optional)
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="juan.delacruz@example.com"
                                    disabled={isSubmitting}
                                    className="w-full rounded-lg border border-border px-4 py-3 text-foreground placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                                />
                            </div>

                            {/* Field 3: Address */}
                            <div>
                                <label
                                    htmlFor="address"
                                    className="mb-2 block text-sm font-medium text-muted-foreground"
                                >
                                    Complete Address*
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Juan Luna Street, 29-C, Davao City, Davao Del Sur"
                                    required
                                    disabled={isSubmitting}
                                    className="w-full rounded-lg border border-border px-4 py-3 text-foreground placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                                />
                            </div>

                            {/* Field 4: Purpose */}
                            <div>
                                <label
                                    htmlFor="purpose"
                                    className="mb-2 block text-sm font-medium text-muted-foreground"
                                >
                                    Purpose of Request*
                                </label>
                                <textarea
                                    id="purpose"
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleInputChange}
                                    placeholder="Enter your purpose for requesting this certificate"
                                    required
                                    rows={4}
                                    disabled={isSubmitting}
                                    className="w-full resize-none rounded-lg border border-border px-4 py-3 text-foreground placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full cursor-pointer rounded-lg bg-[#1e3a8a] px-6 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
                            >
                                {isSubmitting
                                    ? 'Submitting...'
                                    : 'Request Document'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Requirements Modal */}
            <RequirementsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmSubmission}
            />
        </div>
    );
}
