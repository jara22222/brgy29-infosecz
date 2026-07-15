import { CircleAlert } from 'lucide-react';

export default function RegisterHeader(props: {
    headerDesc: any;
    steps: number;
}) {
    const { headerDesc, steps } = props;
    return (
        <>
            <div className="flex w-full flex-col gap-2 font-inter">
                <div className="mt-2 flex items-center gap-1 font-inter text-[18px] font-semibold">
                    <CircleAlert />
                    {steps === 1 && <h3>Basic Information</h3>}
                    {steps === 2 && <h3>Address Information</h3>}
                    {steps === 3 && <h3>Contact Information</h3>}
                    {steps === 4 && <h3>Account Information</h3>}
                    {steps === 5 && (
                        <h3>Terms and Condition & Privacy Policy</h3>
                    )}
                </div>
                {steps === 1 && (
                    <span className="text-[16px]">{headerDesc.basicInfo}</span>
                )}
                {steps === 2 && (
                    <span className="text-[16px]">
                        {headerDesc.addressInfo}
                    </span>
                )}
                {steps === 3 && (
                    <span className="text-[16px]">
                        {headerDesc.contactInfo}
                    </span>
                )}
                {steps === 4 && (
                    <span className="text-[16px]">
                        {headerDesc.accountInfo}
                    </span>
                )}
                {steps === 5 && (
                    <span className="text-[16px]">
                        By using this website, you agree to follow the rules set
                        by Barangay 29-C to ensure safe and proper use of our
                        online services. Please make sure all information you
                        provide is true and complete. <br />
                        <br />
                        Barangay 29-C respects your privacy and keeps your
                        personal data secure. The information you provide will
                        be used only for official barangay transactions and will
                        not be shared without your consent.
                    </span>
                )}

                <span className="text-[16px] text-red-500">
                    {steps !== 5 && <> * All fields required unless noted.</>}
                </span>
            </div>
        </>
    );
}
