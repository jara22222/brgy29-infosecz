import { cn } from '@/lib/utils';

/**
 * Tailwind classes for text inputs with optional validation error state.
 */
export function fieldInputClasses(hasError: boolean, base?: string): string {
    return cn(
        base,
        hasError
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 focus-visible:border-red-500 focus-visible:ring-red-500/20'
            : undefined,
    );
}

export function fieldErrorMessage(
    errors: Record<string, string | string[] | undefined>,
    key: string,
): string | undefined {
    const value = errors[key];

    if (!value) {
        return undefined;
    }

    return Array.isArray(value) ? value[0] : value;
}
