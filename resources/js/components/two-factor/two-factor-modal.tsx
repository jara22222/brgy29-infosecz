import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';
import { type PropsWithChildren, type ReactNode } from 'react';

interface TwoFactorModalProps extends PropsWithChildren {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: ReactNode;
    icon?: LucideIcon;
    iconClassName?: string;
    footer?: ReactNode;
}

export function TwoFactorModal({
    open,
    onOpenChange,
    title,
    description,
    icon: Icon,
    iconClassName,
    children,
    footer,
}: TwoFactorModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    'gap-0 overflow-hidden border border-white/80 p-0 shadow-2xl shadow-blue-200/25 sm:max-w-md',
                    'bg-gradient-to-b from-white/95 via-white/90 to-blue-50/50',
                    'backdrop-blur-3xl ring-1 ring-white/90',
                )}
            >
                <div
                    className={cn(
                        'relative border-b border-white/60 px-6 py-5',
                        'bg-gradient-to-r from-white/80 via-blue-50/60 to-indigo-50/50',
                        'backdrop-blur-xl',
                    )}
                >
                    <div
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.12),transparent_60%)]"
                        aria-hidden
                    />
                    <DialogHeader className="relative space-y-3 text-left">
                        {Icon && (
                            <div
                                className={cn(
                                    'flex h-11 w-11 items-center justify-center rounded-xl border border-white/80 shadow-sm backdrop-blur-sm',
                                    iconClassName ??
                                        'bg-gradient-to-br from-blue-100/80 to-indigo-100/60 text-blue-600',
                                )}
                            >
                                <Icon className="h-5 w-5" />
                            </div>
                        )}
                        <DialogTitle className="bg-gradient-to-r from-slate-800 to-indigo-800 bg-clip-text text-lg font-semibold text-transparent">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-sm leading-relaxed text-slate-600">
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="relative space-y-5 bg-background/40 px-6 py-5 backdrop-blur-sm">
                    <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/30"
                        aria-hidden
                    />
                    <div className="relative">{children}</div>
                </div>

                {footer && (
                    <DialogFooter
                        className={cn(
                            'relative gap-2 border-t border-white/70 px-6 py-4 sm:gap-3',
                            'bg-gradient-to-r from-white/70 via-slate-50/80 to-blue-50/40 backdrop-blur-xl',
                        )}
                    >
                        {footer}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
