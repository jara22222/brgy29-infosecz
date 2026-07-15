import { ShieldAlert } from 'lucide-react';

interface RecaptchaErrorAlertProps {
    message: string;
}

export function RecaptchaErrorAlert({ message }: RecaptchaErrorAlertProps) {
    return (
        <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200/70 bg-red-50/80 px-4 py-3 text-sm text-red-800 shadow-sm backdrop-blur-sm"
        >
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden />
            <div>
                <p className="font-semibold">Security verification failed</p>
                <p className="mt-1 text-red-700">{message}</p>
            </div>
        </div>
    );
}
