import { usePage } from '@inertiajs/react';

interface CertificateInfoProps {
    documentName?: string;
}

export default function CertificateInfo({
    documentName,
}: CertificateInfoProps) {
    const { url_params } = usePage().props as any;
    const selectedDocumentName =
        documentName || url_params?.document_name || 'Barangay Certificate';
    return (
        <div className="w-full py-6 font-sans md:py-8 lg:py-12">
            {/* Header Section */}
            <section className="mb-12 text-center">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                        What is a {selectedDocumentName}?
                    </h1>
                    <p className="text-lg text-muted-foreground md:text-xl">
                        Ano ang {selectedDocumentName}?
                    </p>
                </div>

                <div className="mx-auto mt-8 rounded-xl bg-blue-50 p-8 text-left shadow-lg md:p-10">
                    <p className="mb-4 text-base leading-relaxed text-foreground md:text-lg">
                        A {selectedDocumentName} is an official document issued
                        by the barangay that serves as formal proof that a
                        person is a legitimate resident of the barangay. It also
                        certifies that the individual is of good moral
                        character, maintains harmonious relationships within the
                        community, and has no pending complaints or cases filed
                        in the barangay.
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground italic md:text-base">
                        Ang {selectedDocumentName} ay isang opisyal na
                        dokumentong ibinibigay ng barangay na nagsisilbing
                        pormal na patunay na ang isang tao ay lehitimong
                        residente ng barangay. Pinatutunayan din nito na ang
                        indibidwal ay may mabuting asal, may maayos na
                        pakikitungo sa kapwa sa loob ng komunidad, at walang
                        nakabinbing reklamo o kasong isinampa sa barangay.
                    </p>
                </div>
            </section>

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Left Column: Purpose */}
                <section className="flex flex-col">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                            Purpose of {selectedDocumentName}
                        </h2>
                        <p className="text-base text-muted-foreground md:text-lg">
                            Layunin ng {selectedDocumentName}
                        </p>
                    </div>

                    <div className="flex-1 rounded-xl bg-blue-50 p-8 shadow-lg md:p-10">
                        <p className="text-base leading-relaxed text-foreground md:text-lg">
                            To certify residency, identity, and good moral
                            character of individuals within the barangay for
                            various personal, legal, and official transactions.
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground italic md:text-base">
                            Upang sertipikuhin ang paninirahan, pagkakakilanlan,
                            at mabuting asal ng mga indibidwal sa loob ng
                            barangay para sa iba't ibang personal, legal, o
                            opisyal na transaksyon.
                        </p>
                    </div>
                </section>

                {/* Right Column: Common Uses */}
                <section className="flex flex-col">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                            Common Uses
                        </h2>
                        <p className="text-base text-muted-foreground md:text-lg">
                            Karaniwang Paggagamitan
                        </p>
                    </div>

                    <div className="flex-1 rounded-xl bg-blue-50 p-8 shadow-lg md:p-10">
                        <div className="mb-6">
                            <p className="text-lg font-semibold text-foreground md:text-xl">
                                Required for:
                            </p>
                            <p className="text-sm text-muted-foreground italic md:text-base">
                                Kinakailangan para sa:
                            </p>
                        </div>

                        <ul className="list-disc space-y-3 pl-6 text-base text-foreground md:text-lg">
                            <li>Job applications</li>
                            <li>Business permit applications</li>
                            <li>School requirements</li>
                            <li>Police/NBI clearance</li>
                            <li>Government program applications</li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
}
