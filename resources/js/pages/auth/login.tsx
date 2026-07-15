import InputError from '@/components/input-error';
import { RecaptchaErrorAlert } from '@/components/auth/recaptcha-error-alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Head, Link, useForm } from '@inertiajs/react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Eye, EyeOff } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
    const { executeRecaptcha } = useGoogleReCaptcha();

    const form = useForm({
        email: '',
        password: '',
        remember: false,
        recaptcha_token: '',
    });

    const { data, setData, post, processing, errors, reset, transform } = form;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setRecaptchaError(null);

        let token = 'development_bypass_token';

        if (executeRecaptcha) {
            try {
                token = await executeRecaptcha('login');
            } catch {
                setRecaptchaError(
                    'Security verification could not be completed. Please refresh and try again.',
                );
                return;
            }
        }

        transform((current) => ({
            ...current,
            recaptcha_token: token,
        }));

        post(store().url, {
            onFinish: () => reset('password', 'recaptcha_token'),
            onError: () => setData('recaptcha_token', ''),
        });
    };

    const recaptchaFailureMessage =
        errors.recaptcha_token ?? recaptchaError ?? undefined;

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
            <Head title="Log in" />

            <div className="w-full max-w-lg px-8 py-12">
                <div className="mb-6 flex flex-col items-center text-center">
                    <img
                        src="/myassets/Logo.png"
                        alt="BRGY. 29-C"
                        className="mb-4 h-16 w-auto"
                    />
                    <h1 className="text-2xl font-bold text-foreground">
                        Welcome Back, Resident!
                    </h1>
                </div>

                {status && (
                    <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-800">
                        {status}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {recaptchaFailureMessage && (
                        <RecaptchaErrorAlert message={recaptchaFailureMessage} />
                    )}

                    <div className="grid gap-2">
                        <InputError message={errors.email} className="mb-1 text-center" />
                        <Label htmlFor="email" className="text-muted-foreground">
                            Email address or user name
                        </Label>
                        <Input
                            id="email"
                            type="text"
                            name="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="username"
                            placeholder="Username or email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="rounded-lg border-border px-4 py-2"
                        />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-muted-foreground">
                                Password
                            </Label>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                placeholder="Password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full rounded-lg border-border px-4 py-2 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-muted-foreground focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="remember"
                            name="remember"
                            tabIndex={3}
                            checked={data.remember}
                            onCheckedChange={(checked) =>
                                setData('remember', checked === true)
                            }
                            className="rounded border-border text-[#172F92]"
                        />
                        <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                            Remember me
                        </Label>
                    </div>

                    <div className="text-xs text-muted-foreground">
                        By continuing, you agree to the{' '}
                        <a href="#" className="underline">
                            Terms of use
                        </a>{' '}
                        and{' '}
                        <a href="#" className="underline">
                            Privacy Policy.
                        </a>
                    </div>

                    <Button
                        type="submit"
                        tabIndex={4}
                        disabled={processing}
                        className="w-full cursor-pointer rounded-lg bg-[#172F92] py-6 text-base font-semibold text-white hover:bg-[#112370]"
                    >
                        {processing && <Spinner className="mr-2" />}
                        Log In
                    </Button>

                    <div className="flex flex-col items-center gap-2 text-sm">
                        {canResetPassword && (
                            <Link
                                href={request()}
                                className="font-medium text-muted-foreground hover:text-foreground hover:underline"
                            >
                                Forgot your password?
                            </Link>
                        )}

                        <div className="text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <Link
                                href={register()}
                                className="font-semibold text-foreground underline"
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-3">
                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Sign in with Google
                        </button>

                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted"
                        >
                            Continue as Guest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
