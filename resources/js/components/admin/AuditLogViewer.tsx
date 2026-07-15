import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, ShieldAlert } from 'lucide-react';

export type AuditActionSeverity = 'success' | 'warning' | 'danger' | 'info';

export interface AuditLogEntry {
    id: number;
    user_id: number | null;
    user_name: string | null;
    user_email: string | null;
    action: string;
    ip_address: string;
    action_severity: AuditActionSeverity;
    is_failed_login: boolean;
    created_at: string | null;
}

export interface PaginatedAuditLogs {
    data: AuditLogEntry[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface AuditLogViewerProps {
    auditLogs: PaginatedAuditLogs;
}

const severityStyles: Record<
    AuditActionSeverity,
    { badge: string; text: string; icon?: typeof ShieldAlert }
> = {
    success: {
        badge: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        text: 'font-medium text-emerald-700',
        icon: CheckCircle2,
    },
    warning: {
        badge: 'border-amber-200 bg-amber-50 text-amber-800',
        text: 'font-medium text-amber-800',
        icon: AlertTriangle,
    },
    danger: {
        badge: 'border-red-200 bg-red-50 text-red-700',
        text: 'font-medium text-red-700',
        icon: ShieldAlert,
    },
    info: {
        badge: 'border-slate-200 bg-slate-50 text-slate-700',
        text: 'text-muted-foreground',
    },
};

function formatUserLabel(entry: AuditLogEntry): string {
    if (entry.user_name) {
        return entry.user_name;
    }

    if (entry.user_email) {
        return entry.user_email;
    }

    const match = entry.action.match(/\(([^)]+)\)\s*$/);
    if (match?.[1] && !match[1].includes('attempt') && !match[1].includes('minute')) {
        return match[1];
    }

    return 'Unknown user';
}

function formatDate(iso: string | null): string {
    if (!iso) {
        return '—';
    }

    return new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function formatTime(iso: string | null): string {
    if (!iso) {
        return '—';
    }

    return new Date(iso).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

function ActionBadge({ entry }: { entry: AuditLogEntry }) {
    const severity = entry.action_severity ?? 'info';
    const styles = severityStyles[severity];
    const Icon = styles.icon;

    if (severity === 'info') {
        return <span className={cn('text-sm', styles.text)}>{entry.action}</span>;
    }

    return (
        <span
            className={cn(
                'inline-flex max-w-md items-start gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
                styles.badge,
            )}
        >
            {Icon && <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
            <span className="text-left leading-snug">{entry.action}</span>
        </span>
    );
}

export default function AuditLogViewer({ auditLogs }: AuditLogViewerProps) {
    const { data, from, to, total, current_page, last_page, prev_page_url, next_page_url } =
        auditLogs;

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
            <div className="flex flex-wrap gap-3 border-b border-border bg-muted/60 px-4 py-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Success
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" /> Warning
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500" /> Security alert
                </span>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-border bg-muted/80 hover:bg-muted/80">
                            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                User
                            </TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Action
                            </TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                IP Address
                            </TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Date
                            </TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Time
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="px-4 py-12 text-center text-sm text-muted-foreground"
                                >
                                    No audit log entries yet. Logins, lockouts, and unlock events
                                    will appear here automatically.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((entry) => (
                                <TableRow
                                    key={entry.id}
                                    className="border-b border-border transition-colors hover:bg-blue-50/40"
                                >
                                    <TableCell className="px-4 py-3">
                                        <div className="font-medium text-foreground">
                                            {formatUserLabel(entry)}
                                        </div>
                                        {entry.user_email && entry.user_name && (
                                            <div className="text-xs text-muted-foreground">
                                                {entry.user_email}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <ActionBadge entry={entry} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 font-mono text-sm text-muted-foreground">
                                        {entry.ip_address}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                                        {formatDate(entry.created_at)}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                                        {formatTime(entry.created_at)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {total > 0 && (
                <div className="flex flex-col gap-3 border-t border-border bg-muted/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {from ?? 0} to {to ?? 0} of {total} entries
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                prev_page_url && router.get(prev_page_url, {}, { preserveState: true })
                            }
                            disabled={!prev_page_url}
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </button>
                        <span className="min-w-[7rem] text-center text-sm text-muted-foreground">
                            Page {current_page} of {last_page}
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                next_page_url && router.get(next_page_url, {}, { preserveState: true })
                            }
                            disabled={!next_page_url}
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
