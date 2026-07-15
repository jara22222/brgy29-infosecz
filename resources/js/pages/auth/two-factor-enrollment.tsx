import { GlassCard } from '@/components/two-factor/glass-card';
import { OtpInput } from '@/components/two-factor/otp-input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/contexts/toast-context';
import { postJson } from '@/lib/two-factor-api';
import { Head, router } from '@inertiajs/react';
import { CheckCircle2, Mail, ShieldCheck, Smartphone } from 'lucide-react';
import { useState } from 'react';

interface EnrollmentProps {
    emailEnabled: boolean;
    totpEnabled: boolean;
    userEmail: string;
}

type ModalStep = 'email-code' | 'totp-qr' | 'totp-code' | null;

export default function TwoFactorEnrollment({
    emailEnabled: initialEmailEnabled,
    totpEnabled: initialTotpEnabled,
    userEmail,
}: EnrollmentProps) {
    const { addToast } = useToast();
    const [emailEnabled, setEmailEnabled] = useState(initialEmailEnabled);
    const [totpEnabled, setTotpEnabled] = useState(initialTotpEnabled);
    const [modal, setModal] = useState<ModalStep>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [code, setCode] = useState<string[]>(Array(6).fill(''));
    const [qrCodeSvg, setQrCodeSvg] = useState('');
    const [manualKey, setManualKey] = useState('');

    const resetCode = () => setCode(Array(6).fill(''));

    const finishRedirect = (redirect: string) => {
        addToast('Two-factor authentication is now active.', 'success');
        router.visit(redirect);
    };

    const openEmailModal = async () => {
        setError('');
        resetCode();
        setLoading(true);
        try {
            await postJson('/2fa-enrollment/email/send');
            setModal('email-code');
            addToast('Verification code sent to your email.', 'success');
        } catch (e) {
            addToast(e instanceof Error ? e.message : 'Failed to send code.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const verifyEmail = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await postJson<{
                completed: boolean;
                redirect?: string;
                emailEnabled?: boolean;
                totpEnabled?: boolean;
            }>('/2fa-enrollment/email/verify', { code: code.join('') });

            if (result.completed && result.redirect) {
                setModal(null);
                finishRedirect(result.redirect);
                return;
            }

            setEmailEnabled(true);
            if (result.totpEnabled) {
                setTotpEnabled(true);
            }
            setModal(null);
            addToast('Email 2FA activated successfully.', 'success');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Invalid code.');
        } finally {
            setLoading(false);
        }
    };

    const openTotpModal = async () => {
        setError('');
        resetCode();
        setLoading(true);
        try {
            const result = await postJson<{ qrCodeSvg: string; manualKey: string }>(
                '/2fa-enrollment/totp/setup',
            );
            setQrCodeSvg(result.qrCodeSvg);
            setManualKey(result.manualKey);
            setModal('totp-qr');
        } catch (e) {
            addToast(e instanceof Error ? e.message : 'Failed to load QR code.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const verifyTotp = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await postJson<{
                completed: boolean;
                redirect?: string;
                emailEnabled?: boolean;
                totpEnabled?: boolean;
            }>('/2fa-enrollment/totp/verify', { code: code.join('') });

            if (result.completed && result.redirect) {
                setModal(null);
                finishRedirect(result.redirect);
                return;
            }

            setTotpEnabled(true);
            if (result.emailEnabled) {
                setEmailEnabled(true);
            }
            setModal(null);
            addToast('Google Authenticator activated successfully.', 'success');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Invalid code.');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        if (!loading) {
            setModal(null);
            setError('');
            resetCode();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-100/30 px-4 py-12">
            <Head title="Set up Two-Factor Authentication" />

            <div className="mx-auto max-w-2xl space-y-8">
                <div className="text-center">
                    <img src="/myassets/Logo.png" alt="Logo" className="mx-auto mb-4 h-14 w-auto" />
                    <h1 className="text-2xl font-bold text-slate-900">Secure your account</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        You must enable both Email Code and Google Authenticator before continuing.
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{userEmail}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <GlassCard className="flex flex-col">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-600">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-900">Email Code</h2>
                                <p className="text-xs text-slate-500">Receive 6-digit codes by email</p>
                            </div>
                        </div>
                        {emailEnabled ? (
                            <div className="mt-auto flex items-center gap-2 text-sm font-medium text-emerald-600">
                                <CheckCircle2 className="h-4 w-4" /> Activated
                            </div>
                        ) : (
                            <Button
                                className="mt-auto w-full"
                                onClick={openEmailModal}
                                disabled={loading}
                            >
                                {loading && modal !== 'email-code' ? <Spinner /> : 'Activate Email 2FA'}
                            </Button>
                        )}
                    </GlassCard>

                    <GlassCard className="flex flex-col">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-600">
                                <Smartphone className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-900">Google Authenticator</h2>
                                <p className="text-xs text-slate-500">Time-based OTP from your app</p>
                            </div>
                        </div>
                        {totpEnabled ? (
                            <div className="mt-auto flex items-center gap-2 text-sm font-medium text-emerald-600">
                                <CheckCircle2 className="h-4 w-4" /> Activated
                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                className="mt-auto w-full border-indigo-200 bg-background/50"
                                onClick={openTotpModal}
                                disabled={loading}
                            >
                                {loading && !modal ? <Spinner /> : 'Activate Google Auth'}
                            </Button>
                        )}
                    </GlassCard>
                </div>

                <GlassCard className="flex items-center gap-3 text-sm text-slate-600">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-blue-600" />
                    Both methods are required. You can use either one when signing in after setup.
                </GlassCard>
            </div>

            <Dialog open={modal === 'email-code'} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className="border-white/40 bg-background/80 backdrop-blur-xl sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Verify your email</DialogTitle>
                        <DialogDescription>
                            Enter the 6-digit code sent to {userEmail}.
                        </DialogDescription>
                    </DialogHeader>
                    <OtpInput value={code} onChange={setCode} disabled={loading} error={error} />
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={closeModal} disabled={loading}>
                            Cancel
                        </Button>
                        <Button onClick={verifyEmail} disabled={loading || code.join('').length < 6}>
                            {loading ? <Spinner /> : 'Verify & Activate'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={modal === 'totp-qr'} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className="border-white/40 bg-background/80 backdrop-blur-xl sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Scan QR code</DialogTitle>
                        <DialogDescription>
                            Open Google Authenticator and scan this code, or enter the key manually.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4">
                        <div
                            className="rounded-xl border border-slate-200/80 bg-background p-4"
                            dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                        />
                        <p className="break-all rounded-lg bg-slate-100/80 px-3 py-2 font-mono text-xs text-slate-700">
                            {manualKey}
                        </p>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={closeModal} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                resetCode();
                                setError('');
                                setModal('totp-code');
                            }}
                        >
                            Next
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={modal === 'totp-code'} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className="border-white/40 bg-background/80 backdrop-blur-xl sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm authenticator</DialogTitle>
                        <DialogDescription>
                            Enter the 6-digit code from Google Authenticator.
                        </DialogDescription>
                    </DialogHeader>
                    <OtpInput value={code} onChange={setCode} disabled={loading} error={error} />
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setError('');
                                setModal('totp-qr');
                            }}
                            disabled={loading}
                        >
                            Back
                        </Button>
                        <Button onClick={verifyTotp} disabled={loading || code.join('').length < 6}>
                            {loading ? <Spinner /> : 'Verify & Activate'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

