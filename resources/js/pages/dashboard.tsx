import CertificateForm from '@/components/residentsComponent/certificateForm';
import CertificateInfo from '@/components/residentsComponent/certificateInfo';
import Process from '@/components/residentsComponent/process';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { url_params } = usePage().props as any;
    const documentName = url_params?.document_name;

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
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text font-rubik-2xl font-bold text-yellow-400 sm:text-3xl md:text-4xl lg:text-5xl">
                            {documentName || 'Barangay Certificate'}
                        </h1>
                    </div>
                </div>
                <div className="h-1 w-full bg-[#F59E0B]"></div>
            </div>
            <div className="w-full px-3 py-6 font-inter sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-12 xl:px-16 2xl:px-20">
                <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8 md:space-y-10">
                    <CertificateInfo documentName={documentName} />
                    <Process />
                    <CertificateForm />
                </div>
            </div>
        </AppLayout>
    );
}
