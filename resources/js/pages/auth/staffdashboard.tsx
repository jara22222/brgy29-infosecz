import GenerateDocumentModal from '@/components/registerComponents/generateDocumentModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Download,
    FileText,
    Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '../../contexts/toast-context';

interface Certificate {
    id: number;
    document_name: string;
    status: string;
    created_at: string;
    completed_at?: string;
    purpose: string;
    user?: {
        name: string;
        email: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Request Management',
        href: dashboard().url,
    },
];

export default function StaffDashboard() {
    const page = usePage().props as any;
    const { certificates, flash } = page;
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [verifyingIds, setVerifyingIds] = useState<number[]>([]);
    const [showGenerateDocumentModal, setShowGenerateDocumentModal] =
        useState(false);
    const [selectedCertificate, setSelectedCertificate] =
        useState<Certificate | null>(null);

    // Show flash messages as toasts
    useEffect(() => {
        if (flash?.success) {
            addToast(flash.success, 'success');
        }
        if (flash?.error) {
            addToast(flash.error, 'error');
        }
    }, [flash, addToast]);

    // Handle different data sources: paginated certificates or array of certificates
    const certificatesList = certificates?.data || certificates || [];
    const paginationData = certificates?.data ? certificates : null;

    // Filter certificates based on search
    const filteredCertificates = certificatesList.filter(
        (cert: Certificate) => {
            const matchesSearch =
                cert.document_name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                cert.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cert.purpose
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                cert.user?.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                cert.user?.email
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());
            return matchesSearch;
        },
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-50 text-yellow-700';
            case 'approved':
                return 'bg-blue-50 text-blue-700';
            case 'rejected':
                return 'bg-red-50 text-red-700';
            case 'completed':
                return 'bg-green-50 text-green-700';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleVerify = (certificateId: number) => {
        setVerifyingIds([...verifyingIds, certificateId]);

        router.post(
            '/staff/verify-certificate',
            { certificateId },
            {
                onFinish: () => {
                    setVerifyingIds(
                        verifyingIds.filter((id) => id !== certificateId),
                    );
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Request Management" />
            <GenerateDocumentModal
                isOpen={showGenerateDocumentModal}
                onClose={() => {
                    setShowGenerateDocumentModal(false);
                    setSelectedCertificate(null);
                }}
                certificate={
                    selectedCertificate
                        ? {
                              user: selectedCertificate.user,
                              purpose: selectedCertificate.purpose,
                          }
                        : undefined
                }
            />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Main Card with Blue Header */}
                <div className="flex w-full flex-col rounded-lg bg-background shadow-lg">
                    {/* Blue Header Section */}
                    <div className="bg-blue-900">
                        <div className="px-6 py-4">
                            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                                {/* Request Management Label on the left */}
                                <h2 className="flex gap-2 text-xl font-semibold text-white">
                                    <FileText /> Request Management
                                </h2>

                                {/* Search Input on the right */}
                                <div className="flex w-auto flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
                                    <div className="relative sm:w-64">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                        <Input
                                            placeholder="Search..."
                                            value={searchTerm}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>,
                                            ) => setSearchTerm(e.target.value)}
                                            className="border-border bg-background pl-10 text-foreground placeholder-gray-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="p-6">
                        <div className="overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border">
                                        <TableHead className="font-semibold text-foreground">
                                            Certificate Name
                                        </TableHead>
                                        <TableHead className="font-semibold text-foreground">
                                            Status
                                        </TableHead>
                                        <TableHead className="font-semibold text-foreground">
                                            Date Requested
                                        </TableHead>
                                        <TableHead className="font-semibold text-foreground">
                                            Date Completed
                                        </TableHead>
                                        <TableHead className="font-semibold text-foreground">
                                            Purpose
                                        </TableHead>
                                        <TableHead className="text-right font-semibold text-foreground">
                                            Action
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCertificates.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                No certificate requests found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredCertificates.map(
                                            (cert: Certificate) => (
                                                <TableRow
                                                    key={cert.id}
                                                    className="border-border hover:bg-muted"
                                                >
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                                                <FileText className="h-4 w-4 text-blue-600" />
                                                            </div>
                                                            <span className="text-foreground">
                                                                {
                                                                    cert.document_name
                                                                }
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={`${getStatusColor(cert.status)} rounded-sm border-0 capitalize`}
                                                        >
                                                            {cert.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {formatDate(
                                                            cert.created_at,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {formatDate(
                                                            cert.completed_at,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="max-w-xs truncate text-muted-foreground">
                                                        {cert.purpose}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {cert.status ===
                                                        'completed' ? (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedCertificate(
                                                                        cert,
                                                                    );
                                                                    setShowGenerateDocumentModal(
                                                                        true,
                                                                    );
                                                                }}
                                                                className="border-border p-2 text-muted-foreground hover:cursor-pointer hover:bg-muted"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-blue-900 bg-blue-900 text-white hover:cursor-pointer hover:bg-blue-800"
                                                                onClick={() =>
                                                                    handleVerify(
                                                                        cert.id,
                                                                    )
                                                                }
                                                                disabled={verifyingIds.includes(
                                                                    cert.id,
                                                                )}
                                                            >
                                                                <Check className="mr-1 h-4 w-4" />
                                                                {verifyingIds.includes(
                                                                    cert.id,
                                                                )
                                                                    ? 'Verifying...'
                                                                    : 'Verify'}
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {paginationData && (
                        <div className="mt-auto flex items-center justify-between border-t px-6 py-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {paginationData.from} to{' '}
                                {paginationData.to} of {paginationData.total}{' '}
                                results
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        paginationData.prev_page_url &&
                                        router.get(paginationData.prev_page_url)
                                    }
                                    disabled={!paginationData.prev_page_url}
                                    className="flex items-center gap-1 rounded-md border border-border px-3 py-1 text-sm text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </button>
                                <span className="text-sm text-muted-foreground">
                                    Page {paginationData.current_page} of{' '}
                                    {paginationData.last_page}
                                </span>
                                <button
                                    onClick={() =>
                                        paginationData.next_page_url &&
                                        router.get(paginationData.next_page_url)
                                    }
                                    disabled={!paginationData.next_page_url}
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
        </AppLayout>
    );
}
