import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import TermsModal from './termsModal';
import PrivacyModal from './privacyModal';

interface TermsConditionProps {
    accepted: boolean;
    onAcceptChange: (accepted: boolean) => void;
}

export default function TermsCondition({
    accepted,
    onAcceptChange,
}: TermsConditionProps) {
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

    return (
        <>
            <div className="flex w-full flex-col gap-4">
                <div className="flex w-full flex-1 items-start gap-5 rounded-md border p-5">
                    <Checkbox
                        id="agree"
                        checked={accepted}
                        onCheckedChange={(checked) =>
                            onAcceptChange(checked === true)
                        }
                        className="mt-1 data-[state=checked]:border-[#4b6bec] data-[state=checked]:bg-[#172F92]"
                    />
                    <Label
                        htmlFor="agree"
                        className="cursor-pointer text-sm leading-snug"
                    >
                        Agree to the{' '}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsTermsModalOpen(true);
                            }}
                            className="font-bold text-blue-600 underline hover:text-blue-800"
                        >
                            Terms and Condition
                        </button>{' '}
                        and{' '}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsPrivacyModalOpen(true);
                            }}
                            className="font-bold text-blue-600 underline hover:text-blue-800"
                        >
                            the Privacy Policy
                        </button>{' '}
                        of 29-C Barangay Online Portal
                    </Label>
                </div>
            </div>

            <TermsModal
                isOpen={isTermsModalOpen}
                onClose={() => setIsTermsModalOpen(false)}
            />
            <PrivacyModal
                isOpen={isPrivacyModalOpen}
                onClose={() => setIsPrivacyModalOpen(false)}
            />
        </>
    );
}
