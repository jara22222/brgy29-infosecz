import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type ComponentProps } from 'react';

export function SoftGlassButton({
    className,
    children,
    ...props
}: ComponentProps<typeof Button>) {
    return (
        <Button
            variant="ghost"
            className={cn(
                'h-11 w-full gap-2 rounded-xl border border-slate-300/90 sm:w-auto',
                'bg-gradient-to-r from-white via-slate-50 to-blue-50',
                'font-medium text-slate-800 shadow-md shadow-slate-300/40 backdrop-blur-md',
                'transition-all duration-200',
                'hover:border-blue-400/70 hover:from-white hover:to-blue-100/80',
                'hover:text-slate-900 hover:shadow-lg hover:shadow-blue-300/35',
                'active:scale-[0.98]',
                'disabled:opacity-60',
                className,
            )}
            {...props}
        >
            {children}
        </Button>
    );
}
