import FeedBack from '@/components/residentsComponent/feedBack';
import RequestStatus from '@/components/residentsComponent/requestStatus';
import ResidentContactUs from '@/components/residentsComponent/ResidentContactUs';
import ResidentDocument from '@/components/residentsComponent/residentDocument';
import AppLayout from '@/layouts/app-layout';
import { residentdashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Resident Dashboard',
        href: residentdashboard().url,
    },
];

export default function ResidentDashboard() {
    const { auth } = usePage<any>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="relative w-full overflow-hidden bg-[#172F92]">
                <div className="relative h-32 w-full sm:h-36 md:h-40 lg:h-44">
                    <img
                        src="/myassets/HeroImage.png"
                        alt="Barangay Banner"
                        className="h-full w-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-[#264D84] opacity-50"></div>
                </div>
                <div className="h-1 w-full bg-[#F59E0B]"></div>
            </div>
            <div className="w-full px-2 pt-8 pb-4 font-inter sm:px-4 sm:pt-10 sm:pb-6 md:px-6 md:pt-12 md:pb-8 lg:px-8 lg:pt-14 lg:pb-10 xl:px-12 xl:pt-16 2xl:px-16">
                <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6 md:space-y-8">
                    <RequestStatus />
                    <ResidentDocument />
                    <ResidentContactUs />
                    <FeedBack />
                </div>
            </div>
        </AppLayout>
    );
}
