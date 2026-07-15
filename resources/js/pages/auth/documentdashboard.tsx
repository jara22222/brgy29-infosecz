// Document Dashboard Component - Force refresh
import DocumentModal from '@/components/registerComponents/documentModal';
import GenerateDocumentModal from '@/components/registerComponents/generateDocumentModal';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { admindocument } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Download,
    Info,
    Pencil,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Document Library',
        href: admindocument().url,
    },
];

export default function DocumentDashboard(props: { documents: any[] }) {
    const { documents } = props;
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [showGenerateDocumentModal, setShowGenerateDocumentModal] =
        useState(false);
    const [documentStatuses, setDocumentStatuses] = useState<{
        [key: string]: boolean;
    }>(() => {
        const initialStatuses: { [key: string]: boolean } = {};
        documents.forEach((doc) => {
            initialStatuses[doc.id] = doc.status === 'active';
        });
        return initialStatuses;
    });

    // Calculate active and inactive document counts
    const activeCount = documents.filter(
        (doc) => doc.status === 'active',
    ).length;
    const inactiveCount = documents.filter(
        (doc) => doc.status === 'inactive',
    ).length;

    const { flash } = usePage().props as {
        flash?: {
            success?: string;
            error?: string;
            titleError?: string;
            descriptionError?: string;
        };
    };

    const shownToast = useRef(false);

    const handleStatusChange = async (documentId: string, checked: boolean) => {
        const newStatus = checked ? 'active' : 'inactive';

        router.patch(
            `/documents/${documentId}`,
            {
                status: newStatus,
            },
            {
                onSuccess: () => {
                    setDocumentStatuses((prev) => ({
                        ...prev,
                        [documentId]: checked,
                    }));
                },
                onError: (errors) => {
                    toast.error('Error updating document status');
                    // Revert the toggle on error
                    setDocumentStatuses((prev) => ({
                        ...prev,
                        [documentId]: !checked,
                    }));
                },
                preserveState: false,
            },
        );
    };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
        shownToast.current = true;
    }, [flash]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Document Library" />
            <Toaster position="top-right" />
            <DocumentModal
                isOpen={showDocumentModal}
                onClose={() => setShowDocumentModal(false)}
            />
            <GenerateDocumentModal
                isOpen={showGenerateDocumentModal}
                onClose={() => setShowGenerateDocumentModal(false)}
            />
            <div className="min-h-screen bg-muted p-6 font-inter">
                {/* Top Header Section */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-foreground">
                        Documents Library
                    </h1>

                    <Button
                        onClick={() => setShowDocumentModal(true)}
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-800"
                    >
                        Add Document <Plus size={16} />
                    </Button>
                </div>

                {/* Main Content Card */}
                <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
                    {/* Blue Header Bar */}
                    <div className="flex flex-col items-center justify-between gap-4 border-b-8 border-b-yellow-300 bg-blue-900 p-4 md:flex-row">
                        <h2 className="text-lg font-semibold tracking-wide text-white">
                            Documents
                        </h2>

                        <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
                            {/* Search */}
                            <div className="group relative">
                                <Search
                                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full rounded-lg border-none bg-background py-2 pr-4 pl-10 text-sm text-foreground placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none md:w-64"
                                />
                            </div>

                            {/* Filter Search Button */}
                            <Button className="flex cursor-pointer items-center gap-2 rounded-lg border border-blue-700 bg-background px-4 py-2 text-sm font-medium text-blue-800 shadow-sm transition hover:bg-blue-50">
                                Filter Search
                            </Button>

                            {/* Date Filter */}
                            <div className="relative">
                                <Calendar
                                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                                    size={18}
                                />
                                <select className="w-full cursor-pointer appearance-none rounded-lg border-none bg-background py-2 pr-8 pl-10 text-sm font-medium text-muted-foreground shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none md:w-auto">
                                    <option>10/01/25 - 11/01/25</option>
                                    <option>All Time</option>
                                </select>
                            </div>

                            {/* Download Button */}
                            <Button
                                onClick={() =>
                                    setShowGenerateDocumentModal(true)
                                }
                                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-700 bg-blue-800 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                            >
                                Download All <Download size={16} />
                            </Button>
                        </div>
                    </div>

                    {/* Sub-header / Stats */}
                    <div className="flex items-center gap-3 border-b border-border bg-background px-6 py-4">
                        <h3 className="text-lg font-medium text-foreground">
                            Total Documents
                        </h3>
                        <span className="text-sm font-medium text-green-600">
                            {activeCount} Active
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {inactiveCount} Inactive
                        </span>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-start">
                            <thead>
                                <tr className="border-b border-border bg-muted text-xs font-medium text-muted-foreground uppercase">
                                    <th className="w-24 px-6 py-4">
                                        Document ID
                                    </th>
                                    <th className="px-6 py-4">Document Name</th>
                                    <th className="px-6 py-4">Document Type</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date Created</th>
                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-background">
                                {documents.map((document, index) => (
                                    <tr key={document.id}>
                                        <td className="px-6 py-4">
                                            #
                                            {String(index + 1).padStart(3, '0')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span>
                                                    {document.documentName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-blue-900 capitalize">
                                                {document.documentType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Switch
                                                checked={
                                                    documentStatuses[
                                                        document.id
                                                    ]
                                                }
                                                onCheckedChange={(
                                                    checked: boolean,
                                                ) =>
                                                    handleStatusChange(
                                                        document.id,
                                                        checked,
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            {document.created_at}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="cursor-pointer rounded p-2 transition-colors hover:bg-accent hover:text-accent-foreground">
                                                    <Pencil size={16} />
                                                </button>
                                                <button className="cursor-pointer rounded p-2 transition-colors hover:bg-accent hover:text-accent-foreground">
                                                    <Trash2 size={16} />
                                                </button>
                                                <Button className="flex cursor-pointer items-center gap-2 rounded-lg border border-blue-700 bg-background px-3 py-2 text-sm font-medium text-blue-800 shadow-sm transition hover:bg-blue-50">
                                                    View Details
                                                    <Info size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="flex flex-col items-center justify-between gap-4 border-t border-border bg-background px-6 py-4 sm:flex-row">
                        <Button className="cursor-pointer items-center gap-2 rounded-lg bg-blue-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50">
                            <ChevronLeft size={16} /> Previous
                        </Button>

                        <Button className="cursor-pointer items-center gap-2 rounded-lg bg-blue-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50">
                            Next <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
