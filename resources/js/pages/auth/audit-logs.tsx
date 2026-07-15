import AuditLogViewer, {
    type PaginatedAuditLogs,
} from '@/components/admin/AuditLogViewer';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';

interface AuditLogsPageProps {
    auditLogs: PaginatedAuditLogs;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Audit Logs',
        href: '/admin/audit-logs',
    },
];

export default function AuditLogsPage({ auditLogs }: AuditLogsPageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Audit Logs" />

            <div className="min-h-screen bg-muted p-6 font-inter">
                <div className="mb-6 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-900 text-white shadow-md">
                        <ClipboardList className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Review logins, failed attempts, lockouts, account locks, and unlock
                            activity. Security alerts are highlighted in red.
                        </p>
                    </div>
                </div>

                <AuditLogViewer auditLogs={auditLogs} />
            </div>
        </AppLayout>
    );
}
