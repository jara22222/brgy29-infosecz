import { Check } from 'lucide-react';

interface RequirementsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function RequirementsModal({
    isOpen,
    onClose,
    onConfirm,
}: RequirementsModalProps) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-xl">
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-8 w-8 text-green-600" />
                    </div>
                </div>

                {/* Heading */}
                <h2 className="mb-4 text-center text-lg font-bold text-foreground">
                    Your request has been submitted!
                </h2>

                {/* English Instructions */}
                <div className="mb-4 text-sm text-muted-foreground">
                    <p className="mb-4">
                        After you submit the request document, bring your{' '}
                        <strong>Barangay Certificate requirements</strong> to
                        the Barangay Hall:
                    </p>
                    <ul className="mb-4 list-disc space-y-2 pl-6">
                        <li>Cedula</li>
                        <li>One valid ID</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">
                        The barangay staff will check your documents and give
                        you the official printed Barangay Certificate when you
                        show them. You won't be paying anything.
                    </p>
                </div>

                {/* Tagalog Instructions */}
                <div className="mb-6 text-sm text-muted-foreground italic">
                    <p className="mb-4">
                        Pagkatapos mong isumite ang kahilingan para sa
                        dokumento, dalhin ang iyong mga kinakailangang
                        requirement para sa Barangay Certificate sa Barangay
                        Hall:
                    </p>
                    <ul className="mb-4 list-disc space-y-2 pl-6">
                        <li>Cedula</li>
                        <li>Isang (1) valid ID</li>
                    </ul>
                    <p className="text-sm">
                        Susuriin ng mga kawani ng barangay ang iyong mga
                        dokumento at ibibigay sa iyo ang opisyal na naka-print
                        na Barangay Certificate kapag ipinakita mo ang mga ito.
                        Hindi ka kailangan magbayad ng anumang halaga.
                    </p>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleConfirm}
                    className="w-full cursor-pointer rounded-lg bg-[#1e3a8a] px-6 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                    Confirm
                </button>
            </div>
        </div>
    );
}
