// Components
import PasswordResetLinkController from '@/actions/App/Http/Controllers/Auth/PasswordResetLinkController';
import { login } from '@/routes';
import { useForm, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { RecaptchaErrorAlert } from '@/components/auth/recaptcha-error-alert';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
    const { executeRecaptcha } = useGoogleReCaptcha();

    const { data, setData, post, processing, errors, transform } = useForm({
        email: '',
        recaptcha_token: '',
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setRecaptchaError(null);

        let token = 'development_bypass_token';

        if (executeRecaptcha) {
            try {
                token = await executeRecaptcha('forgot_password');
            } catch {
                setRecaptchaError('Security verification could not be completed. Please refresh and try again.');
                return;
            }
        }

        transform((current) => ({
            ...current,
            recaptcha_token: token,
        }));

        post(PasswordResetLinkController.store().url, {
            onError: () => setData('recaptcha_token', ''),
        });
    };

    const recaptchaFailureMessage = errors.recaptcha_token ?? recaptchaError ?? undefined;
    return (
        <AuthLayout
            title="Forgot password"
            description="Enter your email to receive a password reset link"
        >
            <Head title="Forgot password" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {recaptchaFailureMessage && (
                        <RecaptchaErrorAlert message={recaptchaFailureMessage} />
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="off"
                            autoFocus
                            placeholder="email@example.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <InputError message={errors.email} />
                    </div>

                    <div className="flex items-center justify-start">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                            data-test="email-password-reset-link-button"
                        >
                            {processing && (
                                <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                            )}
                            Email password reset link
                        </Button>
                    </div>
                </form>

                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>Or, return to</span>
                    <TextLink href={login()}>log in</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
