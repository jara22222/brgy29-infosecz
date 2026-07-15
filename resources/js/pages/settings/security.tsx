import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { GlassCard } from '@/components/two-factor/glass-card';
import { TwoFactorModal } from '@/components/two-factor/two-factor-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/contexts/toast-context';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    Lock,
    Mail,
    Shield,
    ShieldAlert,
    Smartphone,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface TwoFactorStatus {
    is_2fa_enrolled: boolean;
    email_2fa_enabled: boolean;
    totp_2fa_enabled: boolean;
    session_verified: boolean;
}

interface SecurityProps {
    status: TwoFactorStatus;
    role: string;
    canRemove2fa: boolean;
}

function StatusBadge({ active, label }: { active: boolean; label: string }) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium shadow-sm backdrop-blur-sm',
                active
                    ? 'border border-emerald-200/80 bg-emerald-50/90 text-emerald-800'
                    : 'border border-slate-200/80 bg-background/60 text-slate-500',
            )}
        >
            {active ? (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            ) : (
                <XCircle className="h-3.5 w-3.5 shrink-0" />
            )}
            {label}
        </span>
    );
}

function MethodCard({
    icon: Icon,
    title,
    subtitle,
    active,
    accent,
}: {
    icon: typeof Mail;
    title: string;
    subtitle: string;
    active: boolean;
    accent: 'blue' | 'indigo';
}) {
    const accentStyles =
        accent === 'blue'
            ? 'from-blue-500 to-blue-600 shadow-blue-500/20'
            : 'from-indigo-500 to-violet-600 shadow-indigo-500/20';

    return (
        <div
            className={cn(
                'flex items-center gap-4 rounded-xl border p-4 transition-colors',
                active
                    ? 'border-white/80 bg-background/70 shadow-sm ring-1 ring-slate-900/[0.03]'
                    : 'border-slate-200/50 bg-slate-50/40',
            )}
        >
            <div
                className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg',
                    accentStyles,
                )}
            >
                <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{title}</p>
                <p className="text-sm text-slate-500">{subtitle}</p>
            </div>
            {active && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
            )}
        </div>
    );
}

export default function Security({ status, role, canRemove2fa }: SecurityProps) {
    const { addToast } = useToast();
    const [resetOpen, setResetOpen] = useState(false);
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };

    const isResident = role === 'resident';

    useEffect(() => {
        if (flash?.success) {
            addToast(flash.success, 'success');
        } else if (flash?.error) {
            addToast(flash.error, 'error');
        }
    }, [flash, addToast]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Two-Factor Authentication', href: '/settings/security' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Two-Factor Authentication" />

            <SettingsLayout>
                <div className="space-y-8">
                    <HeadingSmall
                        title="Two-factor authentication"
                        description={
                            isResident
                                ? 'View your enrolled verification methods and manage 2FA on your account.'
                                : 'View your enrolled and verified authentication methods for this account.'
                        }
                    />

                    <GlassCard className="relative overflow-hidden space-y-6">
                        <div
                            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl"
                            aria-hidden
                        />

                        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                                <Shield className="h-7 w-7" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                                    Enrollment status
                                </h3>
                                <p className="text-sm leading-relaxed text-slate-600">
                                    {status.is_2fa_enrolled
                                        ? 'Both email and Google Authenticator are active on your account.'
                                        : 'You have not completed two-factor enrollment yet.'}
                                </p>
                            </div>
                        </div>

                        {!status.is_2fa_enrolled && (
                            <div className="relative rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/90 to-orange-50/50 p-4">
                                <div className="flex gap-3">
                                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                                    <div>
                                        <p className="font-medium text-amber-950">
                                            Enrollment required
                                        </p>
                                        <p className="mt-1 text-sm text-amber-900/80">
                                            Complete setup to enable email codes and Google
                                            Authenticator on your account.
                                        </p>
                                        <Button asChild className="mt-3 shadow-sm" size="sm">
                                            <Link href="/2fa-enrollment">Go to enrollment</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            <StatusBadge
                                active={status.is_2fa_enrolled}
                                label={status.is_2fa_enrolled ? 'Fully enrolled' : 'Not enrolled'}
                            />
                            <StatusBadge
                                active={status.email_2fa_enabled}
                                label={
                                    status.email_2fa_enabled ? 'Email verified' : 'Email pending'
                                }
                            />
                            <StatusBadge
                                active={status.totp_2fa_enabled}
                                label={
                                    status.totp_2fa_enabled
                                        ? 'Authenticator verified'
                                        : 'Authenticator pending'
                                }
                            />
                            {status.is_2fa_enrolled && (
                                <StatusBadge
                                    active={status.session_verified}
                                    label={
                                        status.session_verified
                                            ? 'Verified this session'
                                            : 'Awaiting login verification'
                                    }
                                />
                            )}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <MethodCard
                                icon={Mail}
                                title="Email code"
                                subtitle={
                                    status.email_2fa_enabled
                                        ? 'Enrolled & verified'
                                        : 'Not enrolled'
                                }
                                active={status.email_2fa_enabled}
                                accent="blue"
                            />
                            <MethodCard
                                icon={Smartphone}
                                title="Google Authenticator"
                                subtitle={
                                    status.totp_2fa_enabled
                                        ? 'Enrolled & verified'
                                        : 'Not enrolled'
                                }
                                active={status.totp_2fa_enabled}
                                accent="indigo"
                            />
                        </div>
                    </GlassCard>

                    {status.is_2fa_enrolled && !isResident && (
                        <GlassCard className="border-slate-200/50 bg-slate-50/40">
                            <div className="flex gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-200/80 text-slate-600">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Account control</h3>
                                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                                        Staff and administrator accounts cannot remove 2FA from this
                                        page. If you need your two-factor authentication reset,
                                        contact your system administrator.
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    )}

                    {canRemove2fa && (
                        <div className="relative overflow-hidden rounded-2xl border border-red-200/60 bg-gradient-to-br from-red-50/80 via-amber-50/30 to-white/60 p-6 shadow-lg shadow-red-100/30 backdrop-blur-sm ring-1 ring-red-900/[0.04]">
                            <div
                                className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-red-300/15 blur-2xl"
                                aria-hidden
                            />
                            <div className="relative flex gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
                                    <ShieldAlert className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900">
                                        Remove two-factor authentication
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                        You are in control of this action. Removing 2FA will delete
                                        your email and Google Authenticator setup from this portal.
                                        You will be asked to enroll again the next time you sign in.
                                    </p>
                                    <ul className="mt-4 space-y-2 text-sm text-slate-600">
                                        {[
                                            'Your login password is still required to confirm removal.',
                                            'Both verification methods must be set up again after removal.',
                                            'You may be signed out of protected pages until enrollment is complete.',
                                        ].map((item) => (
                                            <li key={item} className="flex gap-2">
                                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400/80" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        variant="destructive"
                                        className="mt-5 shadow-md shadow-red-500/15"
                                        onClick={() => setResetOpen(true)}
                                    >
                                        Remove 2FA from my account
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </SettingsLayout>

            <Form
                action="/settings/security/reset"
                method="post"
                resetOnSuccess
                onSuccess={() => setResetOpen(false)}
            >
                {({ processing, errors }) => (
                    <TwoFactorModal
                        open={resetOpen}
                        onOpenChange={setResetOpen}
                        title="Confirm removal of 2FA"
                        description="Enter your current password to confirm. This cannot be undone—you will need to enroll email and Google Authenticator again."
                        icon={ShieldAlert}
                        iconClassName="bg-red-500/10 text-red-600"
                        footer={
                            <>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setResetOpen(false)}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={processing}
                                    className="min-w-[120px]"
                                >
                                    {processing ? <Spinner /> : 'Remove 2FA'}
                                </Button>
                            </>
                        }
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="current_password">Current password</Label>
                            <Input
                                id="current_password"
                                name="current_password"
                                type="password"
                                required
                                autoComplete="current-password"
                                disabled={processing}
                                className="border-slate-200/80 bg-background/80 backdrop-blur-sm"
                            />
                            <InputError message={errors.current_password} />
                        </div>
                    </TwoFactorModal>
                )}
            </Form>
        </AppLayout>
    );
}
