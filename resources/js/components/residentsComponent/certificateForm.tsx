import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import RequirementsModal from './requirementsModal';

interface PageProps {
    auth: {
        user: User;
    };
    documents?: Array<{
        id: number;
        documentName: string;
        documentType: string;
    }>;
    [key: string]: any; // Add index signature for Inertia
}

interface FormErrors {
    [key: string]: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    address?: {
        street: string;
        barangay: string;
        city: string;
        province: string;
    };
    // Alternative flat structure for address fields
    street?: string;
    barangay?: string;
    city?: string;
    province?: string;
}

export default function CertificateForm() {
    const { auth, documents } = usePage<PageProps>().props;
    const currentUser = auth.user as User;

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        purpose: '',
        document_name: '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Debug: Log current user data

        // Get URL parameters for document info
        const urlParams = new URLSearchParams(window.location.search);
        const documentName = urlParams.get('document_name') || '';

        // Check if user has resident role and populate data
        if (currentUser && currentUser.role === 'resident') {
            const userName = currentUser.name || '';

            // Format address if available - check multiple possible address structures
            let formattedAddress = '';

            // Check if address exists as an object with street, barangay, city, province properties
            if (
                currentUser.address &&
                typeof currentUser.address === 'object' &&
                (currentUser.address.street ||
                    currentUser.address.barangay ||
                    currentUser.address.city ||
                    currentUser.address.province)
            ) {
                const { street, barangay, city, province } =
                    currentUser.address;
                const addressParts = [street, barangay, city, province].filter(
                    Boolean,
                );
                formattedAddress = addressParts.join(', ');
            }
            // Alternative: Check if address is a string
            else if (
                currentUser.address &&
                typeof currentUser.address === 'string'
            ) {
                formattedAddress = currentUser.address;
            }
            // Alternative: Check for individual address properties directly on user object
            else if (
                currentUser.street ||
                currentUser.barangay ||
                currentUser.city ||
                currentUser.province
            ) {
                const addressParts = [
                    currentUser.street,
                    currentUser.barangay,
                    currentUser.city,
                    currentUser.province,
                ].filter(Boolean);
                formattedAddress = addressParts.join(', ');
            }
            // Fallback: Use empty string if no address found
            else {
                formattedAddress = '';
            }

            setFormData((prev) => ({
                ...prev,
                name: userName,
                address: formattedAddress,
                document_name: documentName,
            }));
        }
    }, [currentUser]);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form data
        if (
            !formData.name ||
            !formData.address ||
            !formData.purpose ||
            !formData.document_name
        ) {
            alert(
                'Please fill in all required fields. Document should be auto-populated when accessed from the documents page.',
            );
            return;
        }

        // Set submitting state to disable form
        setIsSubmitting(true);

        // Submit data to backend using Inertia
        router.post('/requested-certificates', formData, {
            onSuccess: () => {
                // Show success modal after successful submission
                setIsModalOpen(true);
                // Reset form on successful submission
                setFormData({
                    name:
                        currentUser && currentUser.role === 'resident'
                            ? currentUser.name
                            : '',
                    address: '',
                    purpose: '',
                    document_name: '',
                });
                // Reset submitting state
                setIsSubmitting(false);
            },
            onError: (errors: FormErrors) => {
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
            },
        });
    };

    const handleConfirmSubmission = () => {
        // Close the modal after user confirms seeing the success message
        setIsModalOpen(false);
        // Redirect to resident dashboard
        router.visit('/resident-dashboard');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="w-full py-6 font-sans md:py-8 lg:py-12">
            {/* Main Header */}
            <div className="mb-12 text-center">
                <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                    Barangay Certificate Application Form
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl">
                    Paraan ng pag proseso sa dokumento
                </p>
            </div>

            {/* Form Container */}
            <div className="mx-auto max-w-3xl">
                <form
                    onSubmit={handleSubmit}
                    className="overflow-hidden rounded-xl shadow-lg"
                >
                    {/* Card Header */}
                    <div className="bg-[#1e3a8a] px-6 py-4 md:px-8 md:py-6">
                        <h2 className="text-center text-lg font-semibold text-white md:text-xl">
                            Barangay Certificate Application Form
                        </h2>
                    </div>

                    {/* Yellow Border Strip */}
                    <div className="h-2 bg-yellow-400"></div>

                    {/* Card Body */}
                    <div className="bg-background p-6 md:p-8">
                        {/* Required Note */}
                        <p className="mb-6 text-sm text-red-500">
                            * All fields required unless noted.
                        </p>

                        {/* Form Fields */}
                        <div className="space-y-6">
                            {/* Field 1: Name */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-medium text-muted-foreground"
                                >
                                    Name of Requestor*
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    required
                                    disabled={isSubmitting}
                                    className="w-full rounded-lg border border-border px-4 py-3 text-foreground placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                                />
                            </div>

                            {/* Field 2: Document Name (Auto-populated) */}
                            <div>
                                <label
                                    htmlFor="document_name"
                                    className="mb-2 block text-sm font-medium text-muted-foreground"
                                >
                                    Document Requested*
                                </label>
                                <input
                                    type="text"
                                    id="document_name"
                                    name="document_name"
                                    value={formData.document_name}
                                    readOnly
                                    disabled={isSubmitting}
                                    className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-muted-foreground focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                                    placeholder="Document will be auto-populated"
                                />
                            </div>

                            {/* Field 3: Address (Auto-populated) */}
                            <div>
                                <label
                                    htmlFor="address"
                                    className="mb-2 block text-sm font-medium text-muted-foreground"
                                >
                                    Address*
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-muted-foreground focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                                    placeholder="Address will be auto-populated from your profile"
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
                                    placeholder="Enter your purpose"
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
