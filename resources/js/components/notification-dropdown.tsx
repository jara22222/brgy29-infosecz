import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { router, usePage } from '@inertiajs/react';
import { Bell, Check, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import NotificationModal from './notification-modal';

interface Notification {
    id: number;
    type: 'certificate_completed';
    title: string;
    message: string;
    created_at: string;
    read: boolean;
    read_at: string | null;
    certificate_id: number;
}

export default function NotificationDropdown() {
    const { auth } = usePage<any>().props;
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotification, setSelectedNotification] =
        useState<Notification | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch notifications on component mount
    useEffect(() => {
        if (auth.user?.role === 'resident' && auth.user?.email_verified_at) {
            fetchNotifications();
        } else {
            setLoading(false);
        }
    }, [auth.user]);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/notifications', {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                // If we get HTML instead of JSON (e.g. redirected to splash/login), just return empty
                console.warn('Received non-JSON response for notifications. Likely redirected.');
                setNotifications([]);
                return;
            }

            const data = await response.json();
            setNotifications(data.notifications || []);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        setSelectedNotification(notification);
        setIsModalOpen(true);

        // Mark as read if unread
        if (!notification.read) {
            markAsRead(notification.certificate_id);
        }
    };

    const markAsRead = async (certificateId: number) => {
        try {
            await router.post(
                `/notifications/${certificateId}/read`,
                {},
                {
                    onSuccess: () => {
                        // Update local state to mark as read
                        setNotifications((prev) =>
                            prev.map((n) =>
                                n.certificate_id === certificateId
                                    ? { ...n, read: true }
                                    : n,
                            ),
                        );
                    },
                    onError: (error) => {
                        console.error(
                            'Failed to mark notification as read:',
                            error,
                        );
                    },
                    preserveState: true, // Preserve current page state
                    preserveScroll: true, // Preserve scroll position
                },
            );
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        const unreadNotifications = notifications.filter((n) => !n.read);
        for (const notification of unreadNotifications) {
            await markAsRead(notification.certificate_id);
        }
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'certificate_request':
                return <FileText className="h-4 w-4 text-blue-500" />;
            case 'certificate_approved':
                return <Check className="h-4 w-4 text-green-500" />;
            case 'certificate_completed':
                return <FileText className="h-4 w-4 text-purple-500" />;
            default:
                return <Bell className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60 * 60),
        );

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor(
                (now.getTime() - date.getTime()) / (1000 * 60),
            );
            return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
        }
    };

    const getReadContext = (readAt: string | null) => {
        if (!readAt) return '';

        const readDate = new Date(readAt);
        const now = new Date();
        const diffInMinutes = Math.floor(
            (now.getTime() - readDate.getTime()) / (1000 * 60),
        );

        if (diffInMinutes < 1) {
            return 'read just now';
        } else if (diffInMinutes < 60) {
            return `read ${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        } else if (diffInMinutes < 1440) {
            // 24 hours
            const diffInHours = Math.floor(diffInMinutes / 60);
            return `read ${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
        } else {
            const diffInDays = Math.floor(diffInMinutes / 1440);
            return `read ${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="relative cursor-pointer rounded p-2 transition-colors hover:bg-accent hover:text-accent-foreground">
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                            >
                                {unreadCount}
                            </Badge>
                        )}
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                    <div className="flex items-center justify-between border-b p-4">
                        <h3 className="font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-800"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <Bell className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                                <p>No notifications</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className={`cursor-pointer border-b p-4 last:border-b-0 ${
                                        !notification.read
                                            ? 'border-l-4 border-l-blue-500 bg-blue-50'
                                            : 'bg-muted opacity-60 hover:opacity-80'
                                    }`}
                                    onClick={() =>
                                        handleNotificationClick(notification)
                                    }
                                >
                                    <div className="flex w-full items-start gap-3">
                                        <div className="mt-1 flex-shrink-0">
                                            {getNotificationIcon(
                                                notification.type,
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={`text-sm font-medium ${
                                                    !notification.read
                                                        ? 'text-foreground'
                                                        : 'text-muted-foreground'
                                                }`}
                                            >
                                                {notification.title}
                                            </p>
                                            <p className="truncate text-sm text-muted-foreground">
                                                {notification.message}
                                            </p>
                                            <div className="mt-1 flex items-center justify-between">
                                                <p className="text-xs text-gray-400">
                                                    {formatTime(
                                                        notification.created_at,
                                                    )}
                                                </p>
                                                {notification.read &&
                                                    notification.read_at && (
                                                        <p className="text-xs text-gray-400 italic">
                                                            {getReadContext(
                                                                notification.read_at,
                                                            )}
                                                        </p>
                                                    )}
                                            </div>
                                        </div>
                                        {!notification.read && (
                                            <div className="flex-shrink-0">
                                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                            </div>
                                        )}
                                    </div>
                                </DropdownMenuItem>
                            ))
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="border-t p-2">
                            <button className="w-full rounded py-2 text-center text-sm text-blue-600 hover:bg-muted hover:text-blue-800">
                                View all notifications
                            </button>
                        </div>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <NotificationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                notification={selectedNotification}
            />
        </>
    );
}
