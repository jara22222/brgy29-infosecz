import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { type PropsWithChildren, type ReactNode } from 'react';

interface TwoFactorAuthShellProps extends PropsWithChildren {
    title: string;
    pageTitle?: string;
    subtitle: ReactNode;
    footer?: ReactNode;
    className?: string;
}

export function TwoFactorAuthShell({
    title,
    pageTitle,
    subtitle,
    footer,
    children,
    className,
}: TwoFactorAuthShellProps) {
    return (
        <div
            className={cn(
                'relative min-h-screen overflow-hidden px-4 py-10 sm:py-14',
                'bg-gradient-to-br from-slate-100 via-blue-50/80 to-indigo-100/90',
                className,
            )}
        >
            <Head title={pageTitle ?? title} />

            {/* Gradient mesh */}
            <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.18),transparent_50%),radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.14),transparent_45%),radial-gradient(ellipse_at_bottom,rgba(14,165,233,0.12),transparent_55%)]"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full bg-blue-400/25 blur-[100px]"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-violet-400/20 blur-[90px]"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-300/15 blur-[80px]"
                aria-hidden
            />

            {/* Frosted glass overlay */}
            <div
                className="pointer-events-none absolute inset-0 bg-background/25 backdrop-blur-[2px]"
                aria-hidden
            />

            <div className="relative mx-auto max-w-lg space-y-8">
                <div className="text-center">
                    <div className="mx-auto mb-5 inline-flex p-1">
                        <img
                            src="/myassets/Logo.png"
                            alt="BRGY. 29-C"
                            className="h-12 w-auto sm:h-14"
                        />
                    </div>
                    <h1 className="bg-gradient-to-r from-slate-800 via-blue-900/90 to-indigo-800 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
                        {title}
                    </h1>
                    <div className="mt-3 text-sm leading-relaxed text-slate-600/95">{subtitle}</div>
                </div>

                {children}

                {footer}
            </div>
        </div>
    );
}
