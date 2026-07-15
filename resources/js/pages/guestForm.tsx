import GuestFormComponent from '@/components/residentsComponent/guestForm';
import { Head } from '@inertiajs/react';

export default function GuestForm() {
    return (
        <>
            <Head title="Guest Document Request" />
            <div className="min-h-screen bg-muted">
                <GuestFormComponent />
            </div>
        </>
    );
}
