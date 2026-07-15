import CertificateForm from '@/components/residentsComponent/certificateForm';
import CertificateInfo from '@/components/residentsComponent/certificateInfo';
import Process from '@/components/residentsComponent/process';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Request Certificate',
        href: '/request-certificate',
    },
];

export default function RequestCertificate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Request Certificate" />
            <div className="w-full p-3 sm:p-5 sm:px-8 lg:px-24 xl:px-35">
                <CertificateInfo />
                <Process />
                <CertificateForm />
            </div>
        </AppLayout>
    );
}
