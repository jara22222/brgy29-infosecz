import { cn } from '@/lib/utils';
import { type PropsWithChildren } from 'react';

interface GlassCardProps extends PropsWithChildren {
    className?: string;
    hover?: boolean;
}

export function GlassCard({ children, className, hover }: GlassCardProps) {
    return (
        <div
            className={cn(
                'rounded-2xl border border-white/70 p-5 shadow-xl shadow-blue-200/15 sm:p-6',
                'bg-gradient-to-br from-white/70 via-white/50 to-blue-50/40',
                'backdrop-blur-2xl ring-1 ring-white/60',
                hover &&
                    'transition-all duration-300 hover:-translate-y-0.5 hover:border-white/90 hover:from-white/80 hover:shadow-2xl hover:shadow-blue-200/25',
                className,
            )}
        >
            {children}
        </div>
    );
}
