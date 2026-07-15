import { cn } from '@/lib/utils';
import { useRef } from 'react';

interface OtpInputProps {
    value: string[];
    onChange: (digits: string[]) => void;
    disabled?: boolean;
    error?: string;
}

export function OtpInput({ value, onChange, disabled, error }: OtpInputProps) {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const filled = value.filter((d) => d).length;

    const updateDigit = (index: number, digit: string) => {
        const next = [...value];
        next[index] = digit.replace(/\D/g, '').slice(-1);
        onChange(next);

        if (digit && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, key: string) => {
        if (key === 'Backspace' && !value[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (text: string) => {
        const digits = text.replace(/\D/g, '').slice(0, 6).split('');
        if (digits.length === 0) {
            return;
        }

        const next = [...value];
        digits.forEach((digit, index) => {
            next[index] = digit;
        });
        onChange(next);
        inputsRef.current[Math.min(digits.length, 5)]?.focus();
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-center gap-2 sm:gap-2.5">
                {value.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => {
                            inputsRef.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        disabled={disabled}
                        aria-label={`Digit ${index + 1}`}
                        onChange={(e) => updateDigit(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e.key)}
                        onPaste={(e) => {
                            e.preventDefault();
                            handlePaste(e.clipboardData.getData('text'));
                        }}
                        className={cn(
                            'h-12 w-11 rounded-xl border bg-background/70 text-center text-lg font-semibold text-slate-900 shadow-sm backdrop-blur-sm transition-all sm:h-14 sm:w-12 sm:text-xl',
                            'border-white/80 focus:border-blue-300/80 focus:ring-4 focus:ring-blue-400/10 focus:outline-none',
                            digit &&
                                'border-blue-300/60 bg-gradient-to-b from-blue-50/80 to-white/70',
                            error && 'border-red-300/80 focus:border-red-400 focus:ring-red-400/10',
                        )}
                    />
                ))}
            </div>

            <div className="flex items-center justify-center gap-2">
                <div className="h-1.5 flex-1 max-w-[200px] overflow-hidden rounded-full border border-white/60 bg-background/40 backdrop-blur-sm">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                        style={{ width: `${(filled / 6) * 100}%` }}
                    />
                </div>
                <span className="text-xs font-medium text-slate-500">{filled}/6</span>
            </div>

            {error && (
                <p className="rounded-lg border border-red-200/80 bg-red-50/80 px-3 py-2 text-center text-sm text-red-700">
                    {error}
                </p>
            )}
        </div>
    );
}
