import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface PrivacyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] w-[95vw] max-w-4xl overflow-y-auto sm:w-full">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl">
                        Privacy Policy
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        (Effective Date: [Insert Date])
                    </DialogDescription>
                    <DialogDescription className="text-center">
                        Barangay 29-C Online Portal Management System
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 px-4 py-2">
                    <section>
                        <h3 className="mb-2 font-semibold">
                            1. Purpose of This Policy
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            This policy explains how Barangay 29-C collects,
                            uses, stores, and protects your personal information
                            through our Online Portal. We are committed to
                            keeping your data safe and handling it only for
                            official and legitimate barangay purposes.
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-2 font-semibold">
                            2. Information We Collect
                        </h3>
                        <p className="mb-2 text-sm text-muted-foreground">
                            When you register or request a service through the
                            Portal, we may collect:
                        </p>
                        <ul className="ml-6 space-y-3 text-sm text-muted-foreground">
                            <li>
                                <strong>Personal Information:</strong> Full
                                name, birth date, gender, civil status, and
                                valid ID details.
                            </li>
                            <li>
                                <strong>Address Information:</strong> House
                                number, street, purok or zone,
                                city/municipality, and province.
                            </li>
                            <li>
                                <strong>Contact Information:</strong> Email
                                address, mobile number, and emergency contact
                                (if provided).
                            </li>
                            <li>
                                <strong>Account Information:</strong> Username,
                                password, and activity logs related to your
                                requests.
                            </li>
                            <li>
                                <strong>Uploaded Files:</strong> Photos or scans
                                of valid IDs, proof of residency, and other
                                supporting documents.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="mb-2 font-semibold">
                            3. How We Use Your Information
                        </h3>
                        <p className="mb-2 text-sm text-muted-foreground">
                            We use your personal data to:
                        </p>
                        <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                            <li>Verify your identity and residency.</li>
                            <li>
                                Process your online requests for certificates
                                and clearances.
                            </li>
                            <li>
                                Contact you for verification or updates on your
                                requests.
                            </li>
                            <li>
                                Improve barangay services and maintain accurate
                                records.
                            </li>
                            <li>
                                Comply with government rules and reporting
                                requirements.
                            </li>
                        </ul>
                        <p className="mt-2 text-sm text-muted-foreground">
                            We will not share, sell, or use your information for
                            any purpose unrelated to official barangay
                            functions.
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-2 font-semibold">
                            4. Data Protection and Security
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            We apply strict security measures to protect your
                            data from unauthorized access, loss, or misuse. Only
                            authorized barangay personnel can access your
                            personal information, and all transactions are
                            recorded and monitored for accountability.
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-2 font-semibold">
                            5. Data Retention
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            We store your information only as long as necessary
                            to complete your transactions and comply with
                            government record-keeping policies. After this
                            period, your data will be securely deleted or
                            archived.
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-2 font-semibold">
                            6. Your Rights Under the Data Privacy Act
                        </h3>
                        <p className="mb-2 text-sm text-muted-foreground">
                            As a resident, you have the right to:
                        </p>
                        <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                            <li>
                                Access and review your personal information.
                            </li>
                            <li>
                                Request corrections to inaccurate or outdated
                                data.
                            </li>
                            <li>
                                Withdraw consent for data processing (subject to
                                legal and service limitations).
                            </li>
                            <li>
                                File a complaint with the National Privacy
                                Commission (NPC) if your data privacy rights
                                have been violated.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="mb-2 font-semibold">
                            7. Third-Party Services
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            If the Portal uses third-party tools (e.g., email or
                            SMS notifications), we ensure that these providers
                            comply with data privacy and security standards.
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-2 font-semibold">
                            8. Changes to This Policy
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Barangay 29-C may update this Privacy Policy at any
                            time to improve our practices or comply with new
                            laws. Any changes will be posted on our website,
                            with the date of revision clearly indicated.
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-2 font-semibold">
                            9. Contact Information
                        </h3>
                        <p className="mb-2 text-sm text-muted-foreground">
                            For questions or concerns about this Privacy Policy
                            or how we handle your data, please contact:
                        </p>
                        <p className="mb-2 text-sm font-semibold text-muted-foreground">
                            Barangay 29-C Data Protection Officer
                        </p>
                        <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                            <li>[Office Address]</li>
                            <li>[Contact Number]</li>
                            <li>[Official Barangay Email]</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="mb-2 font-semibold">10. Consent</h3>
                        <p className="text-sm text-muted-foreground">
                            By creating an account or submitting a request
                            through the Barangay 29-C Online Portal, you give
                            consent to the collection and processing of your
                            personal information in accordance with this Privacy
                            Policy.
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-2 font-semibold">11. Agreement</h3>
                        <p className="text-sm text-muted-foreground">
                            By clicking "I Agree" or continuing to use the
                            Barangay 29-C Online Portal, you acknowledge that
                            you have read, understood, and accepted the Terms
                            and Conditions.
                        </p>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
}
