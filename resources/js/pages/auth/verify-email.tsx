import { Head, useForm, Link } from '@inertiajs/react';
import { logout } from '@/routes';
import verification from '@/routes/verification';
import { useState, useRef, useEffect } from 'react';
import { LoaderCircle, ShieldCheck, Mail, Send } from 'lucide-react';

interface VerifyEmailProps {
    status?: string;
}

export default function VerifyEmail({ status }: VerifyEmailProps) {
    const { post, processing, data, setData, errors } = useForm({
        code: '',
    });
    
    const [step, setStep] = useState(1); // 1: Send Code, 2: Enter Code
    const [codeSent, setCodeSent] = useState(false);
    const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (status === 'code-sent' || step === 2) {
            setStep(2);
            setCodeSent(true);
        }
    }, [status]);

    const handleSendCode = () => {
        post(verification.sendCode().url, {
            onSuccess: () => {
                setStep(2);
                setCodeSent(true);
            },
        });
    };

    const handleVerifyCode = (e: React.FormEvent) => {
        e.preventDefault();
        post(verification.verifyCode().url);
    };

    const handleOtpInput = (value: string, index: number) => {
        const newCode = data.code.split('');
        newCode[index] = value;
        const updatedCode = newCode.join('');
        setData('code', updatedCode);

        if (value && index < 5) {
            otpInputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Backspace' && !data.code[index] && index > 0) {
            otpInputs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background font-sans">
            <Head title="Verify Your Email" />

                <div className="w-full max-w-lg px-4 sm:px-8 py-12 space-y-8">
                    {/* Header Group (Matches Identity Verification) */}
                    <div className="flex flex-col items-center text-center animate-[fadeInUp_0.6s_ease_both]">
                        <img src="/myassets/Logo.png" alt="BRGY. 29-C" className="mb-6 h-16 w-auto" />
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">
                            {step === 1 ? 'Verify Your Email' : 'Enter Security Code'}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {step === 1 
                                ? 'To continue, we need to verify your email address.' 
                                : 'We sent a 6-digit code to your email. Enter it below to proceed.'}
                        </p>
                    </div>

                    {/* Action Area */}
                    <div className="animate-[fadeInUp_0.6s_ease_0.2s_both]">
                        {step === 1 ? (
                            <button
                                onClick={handleSendCode}
                                disabled={processing}
                                className="w-full flex items-center p-4 border border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    {processing ? <LoaderCircle className="h-6 w-6 animate-spin" /> : <Mail className="h-6 w-6" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900">Send Verification Code</h3>
                                    <p className="text-sm text-slate-500">We will email you a secure 6-digit code</p>
                                </div>
                                <div className="text-slate-300 group-hover:text-blue-500 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                        ) : (
                            <form onSubmit={handleVerifyCode} className="space-y-6">
                                <div className="flex justify-between gap-2">
                                    {[...Array(6)].map((_, i) => (
                                        <input
                                            key={i}
                                            ref={(el) => (otpInputs.current[i] = el)}
                                            type="text"
                                            maxLength={1}
                                            className="h-14 w-full rounded-xl border border-slate-200 bg-background text-center text-xl font-bold text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition-shadow"
                                            value={data.code[i] || ''}
                                            onChange={(e) => handleOtpInput(e.target.value, i)}
                                            onKeyDown={(e) => handleKeyDown(e, i)}
                                        />
                                    ))}
                                </div>
                                {errors.code && <p className="text-sm font-medium text-red-500 text-center">{errors.code}</p>}
                                
                                <div className="space-y-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing || data.code.length < 6}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
                                    >
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Verify Code
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={handleSendCode}
                                        disabled={processing}
                                        className="w-full text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50"
                                    >
                                        Didn't receive a code? Resend
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Logout link */}
                    <div className="pt-6 text-center animate-[fadeInUp_0.6s_ease_0.3s_both]">
                        <Link
                            href={logout()}
                            as="button"
                            method="post"
                            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                        >
                            Cancel and Sign Out
                        </Link>
                    </div>
                </div>
            
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-16px); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
