interface GenerateDocumentProps {
    userName?: string;
    userAddress?: string;
    purpose?: string;
}

const GenerateDocument = ({
    userName = 'MS. BENNETTE TE NUNEZ',
    userAddress = 'Barangay 29-C',
    purpose = 'MEDICAL/MEDICINE Assistance for MALASAKIT CENTER', // Removed "purposes" from default
}: GenerateDocumentProps) => {
    // Get today's date with proper ordinal suffix
    const today = new Date();
    const day = today.getDate();
    const getOrdinalSuffix = (day: number) => {
        if (day > 3 && day < 21) return 'TH';
        switch (day % 10) {
            case 1:
                return 'ST';
            case 2:
                return 'ND';
            case 3:
                return 'RD';
            default:
                return 'TH';
        }
    };
    const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;
    const monthNames = [
        'JANUARY',
        'FEBRUARY',
        'MARCH',
        'APRIL',
        'MAY',
        'JUNE',
        'JULY',
        'AUGUST',
        'SEPTEMBER',
        'OCTOBER',
        'NOVEMBER',
        'DECEMBER',
    ];
    const currentMonth = monthNames[today.getMonth()];
    const currentYear = today.getFullYear();

    return (
        /* Main A4 Container - Removed outer wrapper to eliminate "card" look */
        /* mx-auto centers it on wide screens, but it's just a white page now */
        <div className="mx-auto box-border flex min-h-[297mm] w-[210mm] flex-row bg-background p-8 font-serif print:m-0 print:min-h-screen print:w-full print:p-8">
            {/* LEFT COLUMN: Logo & Officials */}
            <div className="flex w-[28%] flex-col border-r-2 border-border pr-2">
                {/* Logo Placeholder */}
                <div className="mb-4 flex aspect-square w-full items-center justify-center">
                    {/* REPLACE THIS DIV WITH YOUR IMG TAG LATER */}
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-gray-400 bg-gray-200 text-center font-sans text-xs text-muted-foreground">
                        <img src="myassets/BarangayLogo.png" alt="" />
                    </div>
                </div>

                {/* Officials Header */}
                <div className="mb-6 text-center">
                    <h2 className="text-[10px] font-bold tracking-wide uppercase">
                        Barangay Officials
                    </h2>
                    <p className="text-[10px]">FY 2025-2026</p>
                </div>

                {/* List of Officials */}
                <div className="space-y-4 text-center">
                    <OfficialItem
                        name="HON. MARIA ESTRELLA S. ONG"
                        title="PUNONG BARANGAY"
                    />
                    <OfficialItem
                        name="HON. MA. LUISA S. ONG"
                        title="BARANGAY KAGAWAD"
                    />
                    <OfficialItem
                        name="HON. MARY ROSE D. PAMPLONA"
                        title="BARANGAY KAGAWAD"
                    />
                    <OfficialItem
                        name="HON. HARLEY Y. CLAPANO"
                        title="BARANGAY KAGAWAD"
                    />
                    <OfficialItem
                        name="HON. JOSEPH B. JARA"
                        title="BARANGAY KAGAWAD"
                    />
                    <OfficialItem
                        name="HON. RAUL D. CODILAN"
                        title="BARANGAY KAGAWAD"
                    />
                    <OfficialItem
                        name="HON. WILSON I. BUHIAN"
                        title="BARANGAY KAGAWAD"
                    />
                    <OfficialItem
                        name="HON. EDDIE C. FUENTES"
                        title="BARANGAY KAGAWAD"
                    />
                    <OfficialItem
                        name="HON. RALPH GABRIEL E. BAJO"
                        title="SK CHAIRPERSON"
                    />

                    <div className="pt-4">
                        <OfficialItem
                            name="BABY RUTH B. ORTIZ"
                            title="BARANGAY TREASURER"
                        />
                    </div>
                    <div>
                        <OfficialItem
                            name="NOVA J. PEDROZO"
                            title="BARANGAY SECRETARY"
                        />
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Header & Certificate Body */}
            <div className="relative flex w-[72%] flex-col pl-6">
                {/* Header Text */}
                <div className="mb-12 text-center">
                    <p className="text-sm">Republic of the Philippines</p>
                    <p className="text-sm">City of Davao</p>
                    <h1 className="text-sm font-bold uppercase">
                        OFFICE OF THE SANGGUNIANG BARANGAY
                    </h1>
                    <p className="text-sm font-bold">
                        Barangay 29-C, Poblacion District,
                    </p>
                    <p className="text-sm font-bold">
                        L. Ma. Guerrero Street, Davao City
                    </p>
                    <p className="text-sm font-bold">Tel No. 322-3084</p>
                </div>

                {/* Certificate Title */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold tracking-tighter uppercase underline decoration-2 underline-offset-4">
                        BARANGAY CERTIFICATE
                    </h1>
                </div>

                {/* Content Body */}
                <div className="space-y-8 px-2 text-justify leading-relaxed">
                    <p className="text-sm font-bold uppercase">
                        TO WHOM IT MAY CONCERN:
                    </p>

                    <p className="indent-8 text-base">
                        This is to certify that{' '}
                        <span className="font-bold uppercase underline">
                            {userName}
                        </span>{' '}
                        of legal age, a Filipino, currently residing at{' '}
                        <span className="font-bold underline">
                            {userAddress}
                        </span>
                        .
                    </p>

                    <p className="indent-8 text-base">
                        This certification is issued upon the request of{' '}
                        <span className="font-bold uppercase underline">
                            {userName}
                        </span>{' '}
                        for{' '}
                        <span className="font-bold uppercase underline">
                            {purpose ||
                                'MEDICAL/MEDICINE Assistance for MALASAKIT CENTER'}
                        </span>{' '}
                        purposes only.
                    </p>

                    <p className="text-base">
                        Given this{' '}
                        <span className="font-bold">{dayWithSuffix}</span> day
                        of
                        <span className="font-bold"> {currentMonth}</span>{' '}
                        <span className="font-bold uppercase underline">
                            {currentYear}
                        </span>{' '}
                        at Barangay Barangay 29-C, Poblacion District, Davao
                        City, Philippines.
                    </p>
                </div>

                {/* Signatures */}
                <div className="mt-16 flex flex-col items-end pr-8">
                    <div className="text-center">
                        <p className="mb-4 text-sm font-bold">Attested by:</p>
                        <p className="mt-8 text-sm font-bold uppercase">
                            HON. MARIA ESTRELLA S. ONG
                        </p>
                        <p className="text-sm font-bold">Punong Barangay</p>
                    </div>
                </div>

                {/* Footer Disclaimer */}
                <div className="mt-auto pt-12 text-center text-xs italic">
                    This certification is only valid 30 days.
                </div>
            </div>
        </div>
    );
};

// Helper Component for the Officials List to keep code clean
const OfficialItem = ({ name, title }: { name: string; title: string }) => (
    <div className="flex flex-col items-center">
        <p className="border-b border-black text-[9px] leading-tight font-bold uppercase">
            {name}
        </p>
        <p className="text-[8px] uppercase">{title}</p>
    </div>
);

export default GenerateDocument;
