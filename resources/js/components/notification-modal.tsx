import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { Calendar, FileText, X } from 'lucide-react';
import { Fragment } from 'react';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    notification: {
        id: number;
        type: 'certificate_completed';
        title: string;
        message: string;
        created_at: string;
        read: boolean;
        certificate_id: number;
    } | null;
}

export default function NotificationModal({
    isOpen,
    onClose,
    notification,
}: NotificationModalProps) {
    if (!notification) return null;

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'certificate_completed':
                return <FileText className="h-6 w-6 text-purple-500" />;
            default:
                return <FileText className="h-6 w-6 text-muted-foreground" />;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop */}
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </TransitionChild>

                {/* Modal Positioning */}
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-xl bg-background text-left align-middle shadow-2xl transition-all">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
                                    <DialogTitle
                                        as="h3"
                                        className="text-lg font-semibold text-foreground"
                                    >
                                        Notification Details
                                    </DialogTitle>
                                    <button
                                        onClick={onClose}
                                        type="button"
                                        className="rounded-full p-2 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div className="p-6">
                                    {/* Notification Icon and Title */}
                                    <div className="mb-6 flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            {getNotificationIcon(
                                                notification.type,
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="mb-2 text-lg font-medium text-foreground">
                                                {notification.title}
                                            </h4>
                                            <div className="mb-4 flex items-center text-sm text-muted-foreground">
                                                <Calendar className="mr-1 h-4 w-4" />
                                                {formatDate(
                                                    notification.created_at,
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message Content */}
                                    <div className="mb-6 rounded-lg bg-muted p-4">
                                        <h5 className="mb-2 text-sm font-medium text-muted-foreground">
                                            Message:
                                        </h5>
                                        <p className="leading-relaxed text-foreground">
                                            {notification.message}
                                        </p>
                                    </div>

                                    {/* Additional Information */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between border-b border-border py-2">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Status:
                                            </span>
                                            <span
                                                className={`text-sm font-medium ${
                                                    notification.read
                                                        ? 'text-muted-foreground'
                                                        : 'text-blue-600'
                                                }`}
                                            >
                                                {notification.read
                                                    ? 'Read'
                                                    : 'Unread'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between border-b border-border py-2">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Certificate ID:
                                            </span>
                                            <span className="text-sm text-foreground">
                                                #{notification.certificate_id}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Type:
                                            </span>
                                            <span className="text-sm text-foreground capitalize">
                                                {notification.type.replace(
                                                    '_',
                                                    ' ',
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-6 flex gap-3">
                                        <button
                                            onClick={onClose}
                                            className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted"
                                        >
                                            Close
                                        </button>
                                        <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                                            View Certificate
                                        </button>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
