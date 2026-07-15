import { router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

interface Document {
    id: number;
    documentName: string;
    documentPurpose: string;
    documentType: string;
}

export default function Services() {
    const { documents, auth } = usePage().props as any;

    const handleDocumentRequest = (
        documentId: number,
        documentName: string,
    ) => {
        // Check if user is authenticated
        if (auth?.user) {
            // Redirect to dashboard with document info for authenticated users
            router.visit('/dashboard', {
                method: 'get',
                data: {
                    document_id: documentId,
                    document_name: documentName,
                },
            });
        } else {
            // Redirect to guest form for non-authenticated users
            router.visit('/guest-form', {
                method: 'get',
                data: {
                    document_id: documentId,
                    document_name: documentName,
                },
            });
        }
    };

    // Filter documents by type
    const clearanceDocuments =
        documents?.filter(
            (doc: Document) => doc.documentType === 'clearance',
        ) || [];
    const certificateDocuments =
        documents?.filter(
            (doc: Document) => doc.documentType === 'certificate',
        ) || [];
    const specialDocuments =
        documents?.filter((doc: Document) => doc.documentType === 'special') ||
        [];

    return (
        <section
            id="services"
            className="flex w-full flex-col items-center bg-slate-50 px-4 py-12 font-rubik sm:px-8 sm:py-16 md:px-16 lg:px-24 lg:py-20 xl:px-35 xl:py-25"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-center"
            >
                <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
                    SERVICES
                </h1>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="mt-4 text-center sm:mt-5"
            >
                <p className="text-xl text-slate-700 sm:text-2xl md:text-3xl">
                    Your trusted online gateway for barangay requests and
                    assistance.
                </p>
            </motion.div>

            {/* Barangay Clearances Section */}
            <div className="mt-12 w-full sm:mt-16 md:mt-20">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="mb-8 text-center text-xl font-semibold text-slate-800 sm:text-2xl md:mb-10"
                >
                    Barangay Clearances
                </motion.h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {clearanceDocuments.map(
                        (service: Document, index: number) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.5 }}
                                transition={{
                                    duration: 0.8,
                                    ease: 'easeOut',
                                    delay: index * 0.1,
                                }}
                                className="flex flex-col rounded-xl bg-white p-6 shadow-sm"
                            >
                                <h3 className="mb-3 font-semibold text-slate-900">
                                    {service.documentName}
                                </h3>
                                <p className="mb-4 flex-grow text-sm text-slate-600">
                                    {service.documentPurpose}
                                </p>
                                <Button
                                    onClick={() =>
                                        handleDocumentRequest(
                                            service.id,
                                            service.documentName,
                                        )
                                    }
                                    className="w-full cursor-pointer rounded-lg bg-blue-900 py-2 text-sm font-medium text-white hover:bg-blue-800 sm:py-3"
                                >
                                    Get Document
                                </Button>
                            </motion.div>
                        ),
                    )}
                </div>
            </div>

            {/* Barangay Certificates Section */}
            <div className="mt-12 w-full sm:mt-16 md:mt-20">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="mb-8 text-center text-xl font-semibold text-slate-800 sm:text-2xl md:mb-10"
                >
                    Barangay Certificates
                </motion.h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {certificateDocuments.map(
                        (service: Document, index: number) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.5 }}
                                transition={{
                                    duration: 0.8,
                                    ease: 'easeOut',
                                    delay: index * 0.1,
                                }}
                                className="flex flex-col rounded-xl bg-white p-6 shadow-sm"
                            >
                                <h3 className="mb-3 font-semibold text-slate-900">
                                    {service.documentName}
                                </h3>
                                <p className="mb-4 flex-grow text-sm text-slate-600">
                                    {service.documentPurpose}
                                </p>
                                <Button
                                    onClick={() =>
                                        handleDocumentRequest(
                                            service.id,
                                            service.documentName,
                                        )
                                    }
                                    className="w-full cursor-pointer rounded-lg bg-blue-900 py-2 text-sm font-medium text-white hover:bg-blue-800 sm:py-3"
                                >
                                    Get Document
                                </Button>
                            </motion.div>
                        ),
                    )}
                </div>
            </div>

            {/* Additional Services Section */}
            <div className="mt-12 w-full sm:mt-16 md:mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="mb-8 text-center text-xl font-semibold text-slate-800 sm:text-2xl md:mb-10"
                >
                    Additional Services
                </motion.div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {specialDocuments.map(
                        (service: Document, index: number) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.5 }}
                                transition={{
                                    duration: 0.8,
                                    ease: 'easeOut',
                                    delay: index * 0.1,
                                }}
                                className="flex flex-col rounded-xl bg-white p-6 shadow-sm"
                            >
                                <h3 className="mb-3 font-semibold text-slate-900">
                                    {service.documentName}
                                </h3>
                                <p className="mb-4 flex-grow text-sm text-slate-600">
                                    {service.documentPurpose}
                                </p>
                                <Button
                                    onClick={() =>
                                        handleDocumentRequest(
                                            service.id,
                                            service.documentName,
                                        )
                                    }
                                    className="w-full cursor-pointer rounded-lg bg-blue-900 py-2 text-sm font-medium text-white hover:bg-blue-800 sm:py-3"
                                >
                                    Get Document
                                </Button>
                            </motion.div>
                        ),
                    )}
                </div>
            </div>
        </section>
    );
}
