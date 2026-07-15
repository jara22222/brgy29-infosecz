import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import AppSidebar from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { auth } = usePage<any>().props;

    // Always use sidebar layout for admin and staff users
    const useSidebarLayout =
        auth.user.role === 'admin' || auth.user.role === 'staff';

    if (!useSidebarLayout) {
        return (
            <div className="min-h-screen">
                <AppSidebar />
                <main className="pt-16">{children}</main>
            </div>
        );
    }

    // For admin and staff users, use the full sidebar layout
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <div className="flex h-full w-full flex-col">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <AppContent
                    variant="sidebar"
                    className="flex-1 flex-grow overflow-x-hidden"
                >
                    {children}
                </AppContent>
            </div>
        </AppShell>
    );
}
