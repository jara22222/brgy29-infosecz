import InputError from '../input-error';
import { Input } from '../ui/input';
import { fieldErrorMessage, fieldInputClasses } from '@/lib/form-field';
import { useCallback, useEffect, useRef, useState } from 'react';

const DUPLICATE_EMAIL_MESSAGE = 'This email address is already registered.';

interface ContactsInfoProps {
    form: {
        data: { email: string; mobileNo: string };
        setData: (key: string, value: string) => void;
        errors: Record<string, string | string[] | undefined>;
        setError: (field: string, message: string) => void;
        clearErrors: (...fields: string[]) => void;
    };
}

function getFormatEmailError(email: string): string | undefined {
    if (!email) {
        return undefined;
    }
    if (!email.includes('@')) {
        return "Email is missing an '@' symbol.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return "Email is missing a valid domain (e.g., '.com').";
    }
    return undefined;
}

export default function ContactsInfo({ form }: ContactsInfoProps) {
    const [checkingEmail, setCheckingEmail] = useState(false);
    const abortRef = useRef<AbortController | null>(null);
    const { setError, clearErrors } = form;

    const runAvailabilityCheck = useCallback(
        async (email: string) => {
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            setCheckingEmail(true);

            try {
                const params = new URLSearchParams({ email });
                const response = await fetch(`/register/check-email?${params}`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    signal: controller.signal,
                });

                if (!response.ok) {
                    return;
                }

                const result = (await response.json()) as {
                    available: boolean;
                    message?: string | null;
                };

                if (!result.available) {
                    setError('email', result.message ?? DUPLICATE_EMAIL_MESSAGE);
                } else {
                    const current = fieldErrorMessage(form.errors, 'email');
                    if (current === DUPLICATE_EMAIL_MESSAGE) {
                        clearErrors('email');
                    }
                }
            } catch (error) {
                if (error instanceof DOMException && error.name === 'AbortError') {
                    return;
                }
            } finally {
                if (!controller.signal.aborted) {
                    setCheckingEmail(false);
                }
            }
        },
        [setError, clearErrors, form.errors],
    );

    useEffect(() => {
        const email = form.data.email.trim();

        if (!email) {
            setCheckingEmail(false);
            if (fieldErrorMessage(form.errors, 'email') === DUPLICATE_EMAIL_MESSAGE) {
                clearErrors('email');
            }
            return;
        }

        if (getFormatEmailError(email)) {
            setCheckingEmail(false);
            return;
        }

        const timeout = window.setTimeout(() => {
            void runAvailabilityCheck(email);
        }, 450);

        return () => window.clearTimeout(timeout);
    }, [form.data.email, runAvailabilityCheck, clearErrors, form.errors]);

    const handleEmailBlur = () => {
        const email = form.data.email.trim();

        if (!email || getFormatEmailError(email)) {
            return;
        }

        void runAvailabilityCheck(email);
    };

    const getMobileError = () => {
        if (!form.data.mobileNo) {
            return undefined;
        }
        const digitsOnly = form.data.mobileNo.replace('+63', '');
        if (digitsOnly.length < 10) {
            return `Mobile number is incomplete. Missing ${10 - digitsOnly.length} digit(s).`;
        }
        return undefined;
    };

    const serverEmailError = fieldErrorMessage(form.errors, 'email');
    const formatEmailError = getFormatEmailError(form.data.email);
    const emailError = serverEmailError ?? formatEmailError;
    const mobileError = fieldErrorMessage(form.errors, 'mobileNo') ?? getMobileError();
    const emailHasError = Boolean(emailError);
    const mobileHasError = Boolean(mobileError);

    return (
        <div className="flex w-full flex-col justify-center gap-6">
            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-sm text-muted-foreground sm:text-[14px]">*Email Address</h2>
                <Input
                    required
                    name="email"
                    id="email"
                    type="email"
                    placeholder="Enter Your Email"
                    value={form.data.email}
                    onChange={(e) => {
                        form.setData('email', e.target.value);
                        if (
                            fieldErrorMessage(form.errors, 'email') ===
                            DUPLICATE_EMAIL_MESSAGE
                        ) {
                            clearErrors('email');
                        }
                    }}
                    onBlur={handleEmailBlur}
                    tabIndex={1}
                    aria-invalid={emailHasError}
                    className={fieldInputClasses(emailHasError)}
                />
                {checkingEmail && !emailError && (
                    <p className="mt-1 text-xs text-muted-foreground">Checking email availability…</p>
                )}
                <InputError message={emailError} />
            </div>

            <div className="Street flex flex-1 flex-col gap-2">
                <h2 className="text-sm text-muted-foreground sm:text-[14px]">*Mobile Number</h2>
                <div className="flex items-center">
                    <span className="flex min-h-10 items-center justify-center rounded-l-md border border-r-0 border-input bg-gray-100 px-3 text-sm text-muted-foreground dark:bg-gray-800">
                        +63
                    </span>
                    <Input
                        required
                        className={fieldInputClasses(mobileHasError, 'rounded-l-none')}
                        name="mobileNo"
                        id="mobileNo"
                        type="tel"
                        maxLength={10}
                        placeholder="9XX XXX XXXX"
                        value={form.data.mobileNo.replace(/^\+63/, '')}
                        onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '');
                            if (val.startsWith('0')) {
                                val = val.substring(1);
                            }
                            form.setData('mobileNo', val ? '+63' + val : '');
                        }}
                        tabIndex={2}
                        aria-invalid={mobileHasError}
                    />
                </div>
                <InputError message={mobileError} />
            </div>
        </div>
    );
}
