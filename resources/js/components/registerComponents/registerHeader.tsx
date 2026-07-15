export default function RegisterHeader(props: {
    headerDesc: any;
    steps: number;
}) {
    const { headerDesc, steps = 1 } = props;

    return (
        <>
            <div className="flex w-full flex-col gap-2 font-inter">
                <div className="mt-2 flex items-center gap-2 font-inter text-base font-semibold sm:text-lg">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-800 text-sm text-white sm:h-8 sm:w-8 sm:text-base">
                        {steps}
                    </div>
                    {steps === 1 && (
                        <h3 className="break-words">Basic Information</h3>
                    )}
                    {steps === 2 && (
                        <h3 className="break-words">Address Information</h3>
                    )}
                    {steps === 3 && (
                        <h3 className="break-words">Contact Information</h3>
                    )}
                    {steps === 4 && (
                        <h3 className="break-words">Account Information</h3>
                    )}
                    {steps === 5 && (
                        <h3 className="break-words">
                            Terms and Condition & Privacy Policy
                        </h3>
                    )}
                </div>
                {steps === 1 && (
                    <span className="text-sm sm:text-base">
                        {headerDesc.basicInfo}
                    </span>
                )}
                {steps === 2 && (
                    <span className="text-sm sm:text-base">
                        {headerDesc.addressInfo}
                    </span>
                )}
                {steps === 3 && (
                    <span className="text-sm sm:text-base">
                        {headerDesc.contactInfo}
                    </span>
                )}
                {steps === 4 && (
                    <span className="text-sm sm:text-base">
                        {headerDesc.accountInfo}
                    </span>
                )}
                {steps === 5 && (
                    <span className="text-sm sm:text-base">
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

                <span className="text-sm text-red-500 sm:text-base">
                    {steps !== 5 && <> * All fields required unless noted.</>}
                </span>
            </div>
        </>
    );
}
