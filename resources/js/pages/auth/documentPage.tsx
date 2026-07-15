import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import DocumentDashboard from './documentdashboard';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Document Library',
        href: '/admin/document',
    },
];

export default function DocumentPage() {
    const { documents } = usePage().props as any;

    return (
        <>
            <Head title="Document Library" />
            <DocumentDashboard documents={documents || []} />
        </>
    );
}
