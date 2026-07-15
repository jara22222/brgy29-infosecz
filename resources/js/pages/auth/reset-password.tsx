import NewPasswordController from '@/actions/App/Http/Controllers/Auth/NewPasswordController';
import { useForm, Head } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { RecaptchaErrorAlert } from '@/components/auth/recaptcha-error-alert';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Link } from '@inertiajs/react';
import { home } from '@/routes';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
    const { executeRecaptcha } = useGoogleReCaptcha();

    const { data, setData, post, processing, errors, transform, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
        recaptcha_token: '',
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setRecaptchaError(null);

        let token = 'development_bypass_token';

        if (executeRecaptcha) {
            try {
                token = await executeRecaptcha('reset_password');
            } catch {
                setRecaptchaError('Security verification could not be completed. Please refresh and try again.');
                return;
            }
        }

        transform((current) => ({
            ...current,
            recaptcha_token: token,
        }));

        post(NewPasswordController.store().url, {
            onFinish: () => reset('password', 'password_confirmation', 'recaptcha_token'),
            onError: () => setData('recaptcha_token', ''),
        });
    };

    const recaptchaFailureMessage = errors.recaptcha_token ?? recaptchaError ?? undefined;

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted p-6 md:p-10 text-foreground">
            <Head title="Reset password" />
            
            <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-8 shadow-xl">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="mb-4 flex justify-center">
                                <img
                                    src="/myassets/Logo.png"
                                    alt="BRGY. 29-C ONLINE PORTAL"
                                    className="h-16 w-auto sm:h-20"
                                />
                            </div>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium text-foreground">Reset password</h1>
                            <p className="text-center text-sm text-muted-foreground">
                                Please enter your new password below
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex w-full flex-col">
                        <div className="grid gap-6">
                            {recaptchaFailureMessage && (
                                <RecaptchaErrorAlert message={recaptchaFailureMessage} />
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-muted-foreground">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={data.email}
                                    className="mt-1 block w-full bg-gray-100 text-muted-foreground"
                                    readOnly
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-muted-foreground">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        autoComplete="new-password"
                                        className="mt-1 block w-full pr-10 text-foreground bg-background"
                                        autoFocus
                                        placeholder="Password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-muted-foreground focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-muted-foreground">
                                    Confirm password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="password_confirmation"
                                        autoComplete="new-password"
                                        className="mt-1 block w-full pr-10 text-foreground bg-background"
                                        placeholder="Confirm password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-muted-foreground focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full bg-[#172F92] hover:bg-[#112370] text-white font-semibold"
                                disabled={processing}
                                data-test="reset-password-button"
                            >
                                {processing && <Spinner className="mr-2" />}
                                Reset password
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
