import { router, usePage } from '@inertiajs/react';
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Download,
    FileText,
    MoreVertical,
} from 'lucide-react';

export default function RequestStatus() {
    const { auth, certificates, completedCertificates } = usePage<any>().props;
    const currentUser = auth.user;

    const getStatusSteps = (status: string) => {
        const steps = [
            { key: 'request', short: 'Req', full: 'Request', completed: true },
            {
                key: 'verification',
                short: 'Ver',
                full: 'Verification',
                completed: false,
            },
            {
                key: 'processing',
                short: 'Proc',
                full: 'Processing',
                completed: false,
            },
            {
                key: 'completed',
                short: 'Done',
                full: 'Completed',
                completed: false,
            },
        ];

        const statusIndex = steps.findIndex((step) => step.key === status);
        if (statusIndex !== -1) {
            for (let i = 0; i <= statusIndex; i++) {
                steps[i].completed = true;
            }
        }

        return steps;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const truncateDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    // Custom tooltip component
    const DateTooltip = ({
        date,
        children,
    }: {
        date: string;
        children: React.ReactNode;
    }) => {
        return (
            <div className="group relative inline-block">
                {children}
                <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white group-hover:block">
                    {formatDate(date)}
                    <div className="absolute top-full left-1/2 -mt-1 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
            </div>
        );
    };
    return (
        <div className="w-full">
            {/* Header Section */}
            <div className="mb-4 text-center sm:mb-6 md:mb-8">
                <h1 className="mb-2 text-xl font-bold text-foreground sm:text-2xl md:text-3xl lg:text-4xl">
                    Mabuhay, {currentUser.name}!
                </h1>
                <h2 className="mb-3 text-base font-medium text-foreground sm:text-lg md:text-xl lg:text-2xl">
                    Welcome to Barangay 29-C Online Portal!
                </h2>
                <p className="mx-auto max-w-2xl text-xs text-muted-foreground sm:text-sm md:text-base">
                    Dito sa aming barangay website, maaari ka nang mag-request
                    ng Barangay Certificate at Barangay Clearance nang mabilis
                    at madali online!
                </p>
            </div>

            {/* Request Cards Grid */}
            <div className="grid grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-2 xl:gap-8">
                {/* Left Panel: Request Status Card */}
                <div className="rounded-lg bg-background p-4 shadow-md sm:p-6">
                    <h3 className="mb-3 text-base font-semibold text-foreground sm:mb-4 sm:text-lg">
                        Request Status
                    </h3>

                    {/* Table Headers */}
                    <div className="mb-2 hidden grid-cols-4 gap-2 text-xs font-medium text-muted-foreground sm:mb-3 sm:grid sm:gap-4 md:gap-6">
                        <div>Document Name</div>
                        <div className="col-span-2">Status</div>
                        <div>Date Requested</div>
                    </div>

                    {/* Request Items */}
                    {certificates &&
                    certificates.data &&
                    certificates.data.length > 0 ? (
                        certificates.data.map((certificate: any) => {
                            const steps = getStatusSteps(certificate.status);
                            return (
                                <div
                                    key={certificate.id}
                                    className="rounded-lg border p-3 sm:p-4"
                                >
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:items-start sm:gap-6">
                                        {/* File Icon and Info */}
                                        <div className="flex items-center gap-2 sm:col-span-1">
                                            <div className="rounded bg-blue-100 p-2">
                                                <FileText className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-foreground">
                                                    {certificate.document_name ||
                                                        certificate.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Certificate
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress Stepper */}
                                        <div className="sm:col-span-2">
                                            <div className="relative flex items-center justify-between px-1 sm:px-2">
                                                {/* Progress Line */}
                                                <div className="absolute top-2 right-1 left-1 z-0 h-0.5 bg-gray-200 sm:right-2 sm:left-2"></div>
                                                {steps.map((step, index) => (
                                                    <div
                                                        key={step.key}
                                                        className="absolute top-2 z-0 h-0.5 bg-green-500"
                                                        style={{
                                                            left: `${(index / (steps.length - 1)) * 100}%`,
                                                            width:
                                                                index ===
                                                                steps.length - 1
                                                                    ? '0'
                                                                    : `${100 / steps.length}%`,
                                                            display:
                                                                step.completed &&
                                                                index <
                                                                    steps.length -
                                                                        1
                                                                    ? 'block'
                                                                    : 'none',
                                                        }}
                                                    ></div>
                                                ))}

                                                {/* Steps */}
                                                <div className="relative z-10 flex w-full items-center justify-between">
                                                    {steps.map((step) => (
                                                        <div
                                                            key={step.key}
                                                            className="group flex flex-col items-center"
                                                        >
                                                            <div
                                                                className={`flex h-3 w-3 items-center justify-center rounded-full sm:h-4 sm:w-4 ${
                                                                    step.completed
                                                                        ? 'bg-green-500'
                                                                        : 'bg-gray-300'
                                                                }`}
                                                            >
                                                                {step.completed && (
                                                                    <Check className="h-1.5 w-1.5 text-white sm:h-2 sm:w-2" />
                                                                )}
                                                            </div>
                                                            <span className="mt-1 text-[10px] text-muted-foreground group-hover:hidden sm:text-[12px]">
                                                                {step.short}
                                                            </span>
                                                            <span className="mt-1 hidden text-[10px] text-muted-foreground group-hover:block sm:text-[12px]">
                                                                {step.full}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Date and Action */}
                                        <div className="flex flex-col items-end justify-between sm:col-span-1">
                                            <div className="flex items-center gap-2">
                                                <DateTooltip
                                                    date={
                                                        certificate.created_at
                                                    }
                                                >
                                                    <div className="cursor-help text-sm text-muted-foreground transition-colors hover:text-muted-foreground">
                                                        {truncateDate(
                                                            certificate.created_at,
                                                        )}
                                                    </div>
                                                </DateTooltip>
                                                <button className="rounded p-1 hover:bg-accent hover:text-accent-foreground">
                                                    <MoreVertical className="h-4 w-4 text-gray-400" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="rounded-lg border p-8 text-center text-muted-foreground">
                            <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                            <p>No certificate requests found.</p>
                            <p className="text-sm">
                                Start by requesting a document from the options
                                below.
                            </p>
                        </div>
                    )}

                    <div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-xs text-muted-foreground sm:text-sm">
                            Showing {certificates.from} to {certificates.to} of{' '}
                            {certificates.total} results
                        </div>
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                            <button
                                onClick={() =>
                                    router.get(certificates.prev_page_url)
                                }
                                disabled={!certificates.prev_page_url}
                                className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
                            >
                                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">
                                    Previous
                                </span>
                                <span className="sm:hidden">Prev</span>
                            </button>
                            <span className="text-xs text-muted-foreground sm:text-sm">
                                {certificates.current_page}/
                                {certificates.last_page}
                            </span>
                            <button
                                onClick={() =>
                                    router.get(certificates.next_page_url)
                                }
                                disabled={!certificates.next_page_url}
                                className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
                            >
                                <span className="hidden sm:inline">Next</span>
                                <span className="sm:hidden">Next</span>
                                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Request History Card */}
                <div className="rounded-lg bg-background p-4 shadow-md sm:p-6">
                    {/* Header */}
                    <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-semibold text-foreground sm:text-lg">
                                Request History
                            </h3>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                        <button className="flex items-center gap-2 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted sm:px-3 sm:py-1 sm:text-sm">
                            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">
                                Download All
                            </span>
                            <span className="sm:hidden">All</span>
                        </button>
                    </div>

                    {/* Table Headers - Hidden on mobile */}
                    <div className="mb-3 hidden grid-cols-4 gap-2 text-xs font-medium text-muted-foreground sm:mb-4 sm:grid sm:gap-4">
                        <div>Document Name</div>
                        <div>Status</div>
                        <div>Date uploaded</div>
                        <div>Last updated</div>
                        <div></div>
                    </div>

                    {/* Request History Items */}
                    {completedCertificates &&
                    completedCertificates.data &&
                    completedCertificates.data.length > 0 ? (
                        completedCertificates.data.map((certificate: any) => (
                            <div
                                key={certificate.id}
                                className="flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center sm:gap-3 sm:p-3"
                            >
                                {/* Mobile-friendly layout */}
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                        <Check className="h-3 w-3" />
                                        Completed
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="rounded bg-blue-100 p-1">
                                            <FileText className="h-3 w-3 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-foreground">
                                                {certificate.document_name ||
                                                    certificate.name}
                                                .pdf
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Certificate
                                            </div>
                                        </div>
                                    </div>
                                    <DateTooltip date={certificate.created_at}>
                                        <div className="cursor-help text-xs text-muted-foreground transition-colors hover:text-muted-foreground">
                                            {truncateDate(
                                                certificate.created_at,
                                            )}
                                        </div>
                                    </DateTooltip>
                                </div>
                                <button className="self-end rounded p-1 hover:bg-accent hover:text-accent-foreground sm:self-auto">
                                    <Download className="h-4 w-4 text-gray-400" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-lg border p-8 text-center text-muted-foreground">
                            <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                            <p>No completed requests found.</p>
                            <p className="text-sm">
                                Your completed certificate requests will appear
                                here.
                            </p>
                        </div>
                    )}

                    {/* Request History Pagination */}
                    {completedCertificates &&
                        completedCertificates.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {completedCertificates.from} to{' '}
                                    {completedCertificates.to} of{' '}
                                    {completedCertificates.total} results
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            router.get(
                                                completedCertificates.prev_page_url,
                                            )
                                        }
                                        disabled={
                                            !completedCertificates.prev_page_url
                                        }
                                        className="flex items-center gap-1 rounded-md border border-border px-3 py-1 text-sm text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </button>
                                    <span className="text-sm text-muted-foreground">
                                        Page{' '}
                                        {completedCertificates.current_page} of{' '}
                                        {completedCertificates.last_page}
                                    </span>
                                    <button
                                        onClick={() =>
                                            router.get(
                                                completedCertificates.next_page_url,
                                            )
                                        }
                                        disabled={
                                            !completedCertificates.next_page_url
                                        }
                                        className="flex items-center gap-1 rounded-md border border-border px-3 py-1 text-sm text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}
