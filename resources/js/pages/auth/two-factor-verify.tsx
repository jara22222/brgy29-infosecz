import { GlassCard } from '@/components/two-factor/glass-card';
import { OtpInput } from '@/components/two-factor/otp-input';
import { SoftGlassButton } from '@/components/two-factor/soft-glass-button';
import { TwoFactorAuthShell } from '@/components/two-factor/two-factor-auth-shell';
import { TwoFactorModal } from '@/components/two-factor/two-factor-modal';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/contexts/toast-context';
import { cn } from '@/lib/utils';
import { postJson } from '@/lib/two-factor-api';
import { logout } from '@/routes';
import { Link, router } from '@inertiajs/react';
import { ArrowRight, Mail, ShieldCheck, Smartphone } from 'lucide-react';
import { useState } from 'react';

interface VerifyProps {
    userEmail: string;
}

type Method = 'email' | 'totp' | null;

function MethodIcon({
    icon: Icon,
    gradient,
}: {
    icon: typeof Mail;
    gradient: string;
}) {
    return (
        <div
            className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/60 text-white shadow-lg backdrop-blur-sm',
                gradient,
            )}
        >
            <Icon className="h-6 w-6" />
        </div>
    );
}

export default function TwoFactorVerify({ userEmail }: VerifyProps) {
    const { addToast } = useToast();
    const [method, setMethod] = useState<Method>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [code, setCode] = useState<string[]>(Array(6).fill(''));

    const resetCode = () => setCode(Array(6).fill(''));

    const closeModal = () => {
        if (!loading) {
            setModalOpen(false);
            setMethod(null);
            setError('');
            resetCode();
        }
    };

    const chooseEmail = async () => {
        setMethod('email');
        setError('');
        resetCode();
        setLoading(true);
        try {
            await postJson('/2fa-verify/email/send');
            setModalOpen(true);
            addToast('Verification code sent to your email.', 'success');
        } catch (e) {
            addToast(e instanceof Error ? e.message : 'Failed to send code.', 'error');
            setMethod(null);
        } finally {
            setLoading(false);
        }
    };

    const chooseTotp = () => {
        setMethod('totp');
        setError('');
        resetCode();
        setModalOpen(true);
    };

    const submitCode = async () => {
        setLoading(true);
        setError('');
        try {
            const endpoint =
                method === 'email'
                    ? '/2fa-verify/email/verify'
                    : '/2fa-verify/totp/verify';

            const result = await postJson<{ redirect: string }>(endpoint, {
                code: code.join(''),
            });

            addToast('Verification successful.', 'success');
            router.visit(result.redirect);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Invalid code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <TwoFactorAuthShell
            title="Verify it's you"
            pageTitle="Two-Factor Verification"
            subtitle={
                <>
                    <p>Choose how you want to complete two-factor authentication.</p>
                    <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-background/40 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-md">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        {userEmail}
                    </p>
                </>
            }
            footer={
                <p className="text-center">
                    <Link
                        href={logout()}
                        as="button"
                        method="post"
                        className="rounded-lg px-2 py-1 text-sm font-medium text-slate-500 underline-offset-4 transition-colors hover:text-red-600 hover:underline"
                    >
                        Cancel and sign out
                    </Link>
                </p>
            }
        >
            <div className="space-y-4">
                <GlassCard hover className="group">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                        <div className="flex flex-1 items-start gap-4">
                            <MethodIcon
                                icon={Mail}
                                gradient="bg-gradient-to-br from-blue-400/90 to-blue-600/90 shadow-blue-400/30"
                            />
                            <div>
                                <h2 className="font-semibold text-slate-900">Email code</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    We&apos;ll send a 6-digit code to your inbox
                                </p>
                            </div>
                        </div>
                        <SoftGlassButton
                            onClick={chooseEmail}
                            disabled={loading}
                        >
                            {loading && method === 'email' ? (
                                <Spinner />
                            ) : (
                                <>
                                    Use email
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </>
                            )}
                        </SoftGlassButton>
                    </div>
                </GlassCard>

                <div className="relative flex items-center justify-center py-1">
                    <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                    <span className="relative rounded-full border border-white/60 bg-background/40 px-3 py-0.5 text-xs font-medium uppercase tracking-wider text-slate-400 backdrop-blur-sm">
                        or
                    </span>
                </div>

                <GlassCard hover className="group">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                        <div className="flex flex-1 items-start gap-4">
                            <MethodIcon
                                icon={Smartphone}
                                gradient="bg-gradient-to-br from-indigo-400/90 to-violet-500/90 shadow-indigo-400/30"
                            />
                            <div>
                                <h2 className="font-semibold text-slate-900">
                                    Google Authenticator
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Enter the code from your authenticator app
                                </p>
                            </div>
                        </div>
                        <SoftGlassButton onClick={chooseTotp} disabled={loading}>
                            {loading && method === 'totp' ? (
                                <Spinner />
                            ) : (
                                <>
                                    Use authenticator
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </>
                            )}
                        </SoftGlassButton>
                    </div>
                </GlassCard>
            </div>

            <TwoFactorModal
                open={modalOpen}
                onOpenChange={(open) => !open && closeModal()}
                title={method === 'email' ? 'Enter email code' : 'Enter authenticator code'}
                description={
                    method === 'email' ? (
                        <>
                            Enter the 6-digit code we sent to{' '}
                            <span className="font-medium text-slate-800">{userEmail}</span>.
                        </>
                    ) : (
                        'Open Google Authenticator and enter the current 6-digit code.'
                    )
                }
                icon={method === 'email' ? Mail : Smartphone}
                iconClassName="bg-gradient-to-br from-blue-100/90 to-indigo-100/70 text-indigo-600 border-white/80"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={closeModal}
                            disabled={loading}
                            className="rounded-xl text-slate-600 hover:bg-background/60"
                        >
                            Back
                        </Button>
                        <SoftGlassButton
                            onClick={submitCode}
                            disabled={loading || code.join('').length < 6}
                            className="min-w-[150px] font-medium"
                        >
                            {loading ? <Spinner /> : 'Verify & continue'}
                        </SoftGlassButton>
                    </>
                }
            >
                <OtpInput value={code} onChange={setCode} disabled={loading} error={error} />
            </TwoFactorModal>
        </TwoFactorAuthShell>
    );
}
