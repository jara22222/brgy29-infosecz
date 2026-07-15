import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] w-[95vw] max-w-4xl overflow-y-auto sm:w-full">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl">
                        Terms and Conditions
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Effective Date: [Insert Date]
                    </DialogDescription>
                    <DialogDescription className="text-center">
                        Barangay 29-C Online Portal Management System
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 px-4 py-2">
                    <section>
                        <h3 className="mb-2 font-semibold">
                            1. Acceptance of Terms
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            By accessing or using the Barangay 29-C Online
                            Portal (the 'Portal'), you agree to comply with and
                            be bound by these Terms and Conditions. If you do
                            not agree, please do not use the Portal.
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-2 font-semibold">
                            2. Purpose of the Portal
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            The Portal is provided to help residents
                            conveniently request barangay services such as
                            certificates, clearances, and other official
                            documents online. It aims to make barangay
                            transactions faster, easier, and more transparent.
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-2 font-semibold">
                            3. User Responsibilities
                        </h3>
                        <p className="mb-2 text-sm text-muted-foreground">
                            Residents using the Portal agree to:
                        </p>
                        <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                            <li>
                                Provide complete, accurate, and truthful
                                information in all forms and uploads.
                            </li>
                            <li>
                                Use the Portal only for lawful and legitimate
                                barangay transactions.
                            </li>
                            <li>
                                Keep their login credentials (username and
                                password) secure and confidential.
                            </li>
                            <li>
                                Refrain from misusing, tampering, or attempting
                                to hack the system in any way.
                            </li>
                        </ul>
                        <p className="mt-2 text-sm text-muted-foreground">
                            The barangay reserves the right to reject, cancel,
                            or suspend requests that contain false or misleading
                            information.
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-2 font-semibold">
                            4. Account Registration
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            To access certain services, users must create an
                            account by providing personal, contact, and address
                            information.
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            You are responsible for maintaining the
                            confidentiality of your account and for all
                            activities under your account.
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-2 font-semibold">
                            5. Verification of Requests
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            All online requests are subject to verification.
                            Barangay staff may contact you to confirm your
                            information or request additional documents. Some
                            documents may still require in-person validation
                            upon pickup to ensure authenticity.
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-2 font-semibold">
                            6. Data Privacy and Security
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Your personal information will be collected and used
                            only for official barangay purposes in accordance
                            with the Data Privacy Act of 2012 (RA 10173).
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            We take appropriate measures to protect your data
                            from unauthorized access, use, or disclosure.
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-2 font-semibold">
                            7. Processing Time and Limitations
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Processing times may vary depending on the volume of
                            requests or verification requirements.
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            The barangay is not responsible for delays caused by
                            incomplete information, system maintenance, or
                            technical issues beyond its control.
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-2 font-semibold">
                            8. Misuse and Violations
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Any misuse of the Portal, such as submitting false
                            information, impersonation, or unauthorized access,
                            may result in suspension of your account and
                            possible legal action under applicable laws.
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-2 font-semibold">
                            9. Updates to Terms
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Barangay 29-C may update these Terms and Conditions
                            at any time without prior notice. Updated terms will
                            be posted on the Portal, and continued use of the
                            service means you accept those changes.
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-2 font-semibold">
                            10. Contact Information
                        </h3>
                        <p className="mb-2 text-sm text-muted-foreground">
                            For questions or assistance, you may contact:
                        </p>
                        <p className="mb-2 text-sm font-semibold text-muted-foreground">
                            Barangay 29-C Office
                        </p>
                        <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                            <li>[Address]</li>
                            <li>[Contact Number]</li>
                            <li>[Email Address]</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="mb-2 font-semibold">11. Agreement</h3>
                        <p className="text-sm text-muted-foreground">
                            By clicking 'I Agree' or continuing to use the
                            Barangay 29-C Online Portal, you acknowledge that
                            you have read, understood, and accepted these Terms
                            and Conditions.
                        </p>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
}
