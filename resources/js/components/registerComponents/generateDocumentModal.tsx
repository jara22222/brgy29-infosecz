import GenerateDocument from '@/pages/residents/generateDocument';
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { X } from 'lucide-react';
import { Fragment, JSX } from 'react';

interface GenerateDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    certificate?: {
        user?: {
            name: string;
            email: string;
        };
        purpose: string;
    };
}

export default function GenerateDocumentModal({
    isOpen,
    onClose,
    certificate,
}: GenerateDocumentModalProps): JSX.Element {
    const handlePrint = () => {
        // Create a new window for printing only the document
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            // Get the document content
            const documentContent =
                document.getElementById('document-content')?.innerHTML;

            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Barangay Certificate</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        @page {
                            size: A4;
                            margin: 8mm;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: serif;
                        }
                        /* Ensure all document styles are applied */
                        .min-h-\\[297mm\\] { min-height: 297mm !important; }
                        .w-\\[210mm\\] { width: 210mm !important; }
                        .text-\\[10px\\] { font-size: 10px !important; }
                        .text-\\[8px\\] { font-size: 8px !important; }
                        .text-\\[9px\\] { font-size: 9px !important; }
                        .h-32 { height: 8rem !important; }
                        .w-32 { width: 8rem !important; }
                        .border-b-2 { border-bottom-width: 2px !important; }
                        .border-border { border-color: rgb(209 213 219) !important; }
                        .bg-gray-200 { background-color: rgb(229 231 235) !important; }
                        .text-muted-foreground { color: rgb(107 114 128) !important; }
                        .font-serif { font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif !important; }
                        .font-sans { font-family: ui-sans-serif, system-ui, sans-serif !important; }
                        .font-bold { font-weight: 700 !important; }
                        .uppercase { text-transform: uppercase !important; }
                        .tracking-wide { letter-spacing: 0.025em !important; }
                        .text-center { text-align: center !important; }
                        .text-sm { font-size: 0.875rem !important; }
                        .text-4xl { font-size: 2.25rem !important; }
                        .text-base { font-size: 1rem !important; }
                        .leading-tight { line-height: 1.25 !important; }
                        .leading-relaxed { line-height: 1.625 !important; }
                        .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem !important; }
                        .space-y-8 > :not([hidden]) ~ :not([hidden]) { margin-top: 2rem !important; }
                        .flex { display: flex !important; }
                        .flex-col { flex-direction: column !important; }
                        .flex-row { flex-direction: row !important; }
                        .items-center { align-items: center !important; }
                        .justify-center { justify-content: center !important; }
                        .gap-2 { gap: 0.5rem !important; }
                        .p-8 { padding: 2rem !important; }
                        .pr-2 { padding-right: 0.5rem !important; }
                        .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
                        .py-4 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
                        .mb-4 { margin-bottom: 1rem !important; }
                        .mb-6 { margin-bottom: 1.5rem !important; }
                        .mb-12 { margin-bottom: 3rem !important; }
                        .mt-16 { margin-top: 4rem !important; }
                        .mt-auto { margin-top: auto !important; }
                        .pt-4 { padding-top: 1rem !important; }
                        .pt-12 { padding-top: 3rem !important; }
                        .pt-8 { padding-top: 2rem !important; }
                        .w-\\[28\\%\\] { width: 28% !important; }
                        .w-\\[72\\%\\] { width: 72% !important; } 
                        .w-full { width: 100% !important; }
                        .aspect-square { aspect-ratio: 1 / 1 !important; }
                        .bg-background { background-color: white !important; }
                        .box-border { box-sizing: border-box !important; }
                        .mx-auto { margin-left: auto !important; margin-right: auto !important; }
                        .rounded-full { border-radius: 9999px !important; }
                        .border-2 { border-width: 2px !important; }
                        .border-dashed { border-style: dashed !important; }
                        .underline { text-decoration: underline !important; }
                        .decoration-2 { text-decoration-thickness: 2px !important; }
                        .underline-offset-4 { text-underline-offset: 4px !important; }
                        .tracking-tighter { letter-spacing: -0.025em !important; }
                        .text-justify { text-align: justify !important; }
                        .indent-8 { text-indent: 2rem !important; }
                        .relative { position: relative !important; }
                        .pl-6 { padding-left: 1.5rem !important; }
                        .pr-8 { padding-right: 2rem !important; }
                        .items-end { align-items: flex-end !important; }
                        .text-italic { font-style: italic !important; }
                        .text-xs { font-size: 0.75rem !important; }
                        .border-black { border-color: black !important; }
                        .border-b { border-bottom-width: 1px !important; }
                        .text-right { text-align: right !important; }
                        .border-t { border-top-width: 1px !important; }
                        .border-border { border-color: rgb(229 231 235) !important; }
                        .bg-muted { background-color: rgb(249 250 251) !important; }
                        .text-foreground { color: rgb(31 41 55) !important; }
                        .text-muted-foreground { color: rgb(55 65 81) !important; }
                        .text-muted-foreground { color: rgb(75 85 99) !important; }
                        .text-green-600 { color: rgb(34 197 94) !important; }
                    </style>
                </head>
                <body>
                    ${documentContent || ''}
                </body>
                </html>
            `);

            printWindow.document.close();
            printWindow.focus();

            // Wait for Tailwind to load and content to render before printing
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 1000);
        }
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Print styles to hide unwanted elements */}
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                        @media print {
                            /* Hide modal UI elements */
                            .modal-header,
                            .modal-footer,
                            .modal-backdrop,
                            .modal-panel > div:first-child,
                            .modal-panel > div:last-child {
                                display: none !important;
                            }
                            
                            /* Show only document content */
                            .modal-panel {
                                box-shadow: none !important;
                                border-radius: 0 !important;
                                max-width: none !important;
                                margin: 0 !important;
                            }
                            
                            /* Make document full size for printing */
                            #document-content {
                                transform: scale(1) !important;
                                width: 100% !important;
                                max-width: none !important;
                            }
                            
                            /* Remove modal background */
                            body > div > div > div {
                                background: white !important;
                            }
                            
                            /* Hide browser UI elements */
                            @page {
                                margin: 8mm;
                                size: A4;
                            }
                            
                            body {
                                margin: 0;
                                padding: 0;
                            }
                        }
                    `,
                    }}
                />

                {/* Backdrop / Overlay */}
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </TransitionChild>

                {/* Modal Positioning Wrapper */}
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
                            <DialogPanel className="modal-panel w-[95vw] max-w-7xl transform overflow-hidden rounded-xl bg-background text-left align-middle shadow-2xl transition-all">
                                {/* Modal Header */}
                                <div className="modal-header sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4">
                                    <DialogTitle
                                        as="h2"
                                        className="text-xl font-bold text-foreground"
                                    >
                                        Generated Document Preview
                                    </DialogTitle>
                                    <button
                                        onClick={onClose}
                                        type="button"
                                        className="rounded-full p-2 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Modal Body - Document Preview */}
                                <div className="max-h-[75vh] overflow-auto bg-gray-100 p-4">
                                    <div
                                        id="document-content"
                                        className="w-full origin-top-left transform"
                                    >
                                        <GenerateDocument
                                            userName={certificate?.user?.name}
                                            userAddress="Brgy 29-C"
                                            purpose={certificate?.purpose}
                                        />
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="modal-footer flex items-center justify-end gap-3 border-t border-border bg-muted px-6 py-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted"
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handlePrint}
                                        className="rounded-lg bg-blue-900 px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-800"
                                    >
                                        Print Document
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
