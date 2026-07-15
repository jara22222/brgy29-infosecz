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
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    FileText,
    Printer,
    Search,
} from 'lucide-react';
import { useState } from 'react';

interface Certificate {
    id: number;
    name: string;
    address: string;
    purpose: string;
    document_name: string;
    status: string;
    userstatus: string;
    created_at: string;
    updated_at: string;
    approved_at?: string;
    completed_at?: string;
    remarks?: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface PageProps {
    certificates?: {
        data: Certificate[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        prev_page_url: string | null;
        next_page_url: string | null;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    certificate?: Certificate;
    auth?: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    [key: string]: any; // Add index signature for Inertia
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Request History',
        href: '#',
    },
];

export default function RequestHistory() {
    const { props } = usePage<PageProps>();
    const { certificates, certificate } = props;

    // State for search and filters
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    // Handle different data sources: paginated certificates, array of certificates, or single certificate
    const certificatesList =
        certificates?.data || (certificate ? [certificate] : []);
    const paginationData = certificates?.data ? certificates : null;

    // Filter certificates based on search and date filters
    const filteredCertificates = certificatesList.filter((cert) => {
        // Enhanced date search functionality
        const createdDate = new Date(cert.created_at);
        const completedDate = cert.completed_at
            ? new Date(cert.completed_at)
            : null;

        // Multiple date formats for search
        const dateSearchTerms = [
            createdDate.toLocaleDateString(), // "12/6/2025"
            createdDate.toLocaleDateString('en-US'), // "12/6/2025"
            createdDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }), // "Dec 6, 2025"
            createdDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            }), // "December 6, 2025"
            createdDate.toISOString().split('T')[0], // "2025-12-06"
            createdDate.getFullYear().toString(), // "2025"
            (createdDate.getMonth() + 1).toString(), // "12"
            createdDate.getDate().toString(), // "6"
            createdDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            }), // "Dec 6"
            createdDate.toLocaleDateString('en-US', { month: 'long' }), // "December"
        ];

        // Add completed date formats if exists
        if (completedDate) {
            dateSearchTerms.push(
                completedDate.toLocaleDateString(),
                completedDate.toLocaleDateString('en-US'),
                completedDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                }),
                completedDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                }),
                completedDate.toISOString().split('T')[0],
                completedDate.getFullYear().toString(),
                (completedDate.getMonth() + 1).toString(),
                completedDate.getDate().toString(),
            );
        }

        const matchesSearch =
            cert.document_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            cert.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dateSearchTerms.some(
                (dateTerm) =>
                    dateTerm.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    searchTerm.toLowerCase().includes(dateTerm.toLowerCase()),
            );

        const matchesDateFrom = !dateFrom || createdDate >= new Date(dateFrom);
        const matchesDateTo =
            !dateTo || createdDate <= new Date(dateTo + 'T23:59:59');

        return matchesSearch && matchesDateFrom && matchesDateTo;
    });

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
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Request History" />

            <div className="flex min-h-screen w-full px-2 pt-8 pb-4 font-inter sm:px-4 sm:pt-10 sm:pb-6 md:px-6 md:pt-12 md:pb-8 lg:px-8 lg:pt-14 lg:pb-10 xl:px-12 xl:pt-16 2xl:px-16">
                <div className="flex w-full flex-col">
                    {/* Main Card with Blue Header */}
                    <div className="flex w-full flex-col rounded-lg bg-background shadow-lg">
                        {/* Blue Header Section */}
                        <div className="overflow-visible bg-blue-900">
                            <div className="overflow-visible px-6 py-4">
                                <div className="flex flex-col items-center justify-between gap-4 overflow-visible sm:flex-row">
                                    {/* Request History Label on the left */}
                                    <h2 className="flex gap-2 text-xl font-semibold text-white">
                                        <FileText /> Request History Logs
                                    </h2>

                                    {/* Search and Date inputs on the right before Export */}
                                    <div className="flex w-auto flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
                                        {/* Search Input */}
                                        <div className="relative sm:w-64">
                                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                            <Input
                                                placeholder="Search..."
                                                value={searchTerm}
                                                onChange={(e) =>
                                                    setSearchTerm(
                                                        e.target.value,
                                                    )
                                                }
                                                className="border-border bg-background pl-10 text-foreground placeholder-gray-500"
                                            />
                                        </div>

                                        {/* Date Range Picker */}
                                        <div className="flex flex-col gap-2 overflow-visible sm:flex-row sm:items-center sm:gap-2">
                                            <div className="relative z-50 overflow-visible">
                                                <label className="absolute -top-3 left-2 z-10 rounded bg-background px-2 text-xs text-muted-foreground shadow-sm">
                                                    From
                                                </label>
                                                <Calendar className="absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                                <Input
                                                    type="date"
                                                    placeholder="From"
                                                    value={dateFrom}
                                                    onChange={(e) =>
                                                        setDateFrom(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-48 border-border bg-background pl-10 text-foreground placeholder-gray-500 sm:w-52"
                                                />
                                            </div>
                                            <div className="relative z-50 overflow-visible">
                                                <label className="absolute -top-3 left-2 z-10 rounded bg-background px-2 text-xs text-muted-foreground shadow-sm">
                                                    To
                                                </label>
                                                <Calendar className="absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                                <Input
                                                    type="date"
                                                    placeholder="To"
                                                    value={dateTo}
                                                    onChange={(e) =>
                                                        setDateTo(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-48 border-border bg-background pl-10 text-foreground placeholder-gray-500 sm:w-52"
                                                />
                                            </div>
                                        </div>

                                        {/* Export/Download Button */}
                                        <Button className="bg-background px-3 py-2 font-medium text-blue-900 hover:bg-accent hover:text-accent-foreground sm:px-4">
                                            <Download className="mr-2 h-4 w-4" />
                                            <span className="hidden sm:inline">
                                                Export
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Yellow Accent Line */}
                            <div className="h-1 bg-yellow-500"></div>
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
                                                    No certificate requests
                                                    found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredCertificates.map((cert) => (
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
                                                            variant={
                                                                cert.status ===
                                                                'completed'
                                                                    ? 'default'
                                                                    : cert.status ===
                                                                        'pending'
                                                                      ? 'secondary'
                                                                      : cert.status ===
                                                                          'approved'
                                                                        ? 'default'
                                                                        : 'destructive'
                                                            }
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
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-border text-muted-foreground hover:bg-muted"
                                                            >
                                                                <Eye className="mr-1 h-4 w-4" />
                                                                View Details
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-border p-2 text-muted-foreground hover:bg-muted"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                            {cert.status ===
                                                                'completed' && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="border-border p-2 text-muted-foreground hover:bg-muted"
                                                                >
                                                                    <Printer className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
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
                                    {paginationData.to} of{' '}
                                    {paginationData.total} results
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            paginationData.prev_page_url &&
                                            router.get(
                                                paginationData.prev_page_url,
                                            )
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
                                            router.get(
                                                paginationData.next_page_url,
                                            )
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
            </div>
        </AppLayout>
    );
}
