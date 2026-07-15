import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'warning';
    onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'error':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'warning':
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
            default:
                return <CheckCircle className="h-5 w-5 text-green-500" />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 dark:bg-green-500/20 dark:border-green-500/30';
            case 'error':
                return 'bg-red-50 border-red-200 dark:bg-red-500/20 dark:border-red-500/30';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-500/20 dark:border-yellow-500/30';
            default:
                return 'bg-green-50 border-green-200 dark:bg-green-500/20 dark:border-green-500/30';
        }
    };

    return (
        <div
            className={`fixed top-4 right-4 z-50 flex max-w-sm items-center gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 ${getBgColor()} ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
        >
            {getIcon()}
            <p className="text-sm font-medium text-foreground">{message}</p>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
                className="ml-auto text-gray-400 hover:text-muted-foreground"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

interface ToastContainerProps {
    toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'warning' }>;
    onRemoveToast: (id: string) => void;
}

export function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
    return (
        <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 p-4">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => onRemoveToast(toast.id)}
                />
            ))}
        </div>
    );
}
