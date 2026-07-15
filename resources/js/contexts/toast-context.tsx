import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useState,
} from 'react';
import { ToastContainer } from '../components/ui/toast';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning';
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type: 'success' | 'error' | 'warning') => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback(
        (message: string, type: 'success' | 'error' | 'warning') => {
            const id = Date.now().toString();
            setToasts((prev) => [...prev, { id, message, type }]);
        },
        [],
    );

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
