import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Input,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { router } from '@inertiajs/react';
import { X } from 'lucide-react';
import React, { Fragment, useState } from 'react';

interface DocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DocumentModal({ isOpen, onClose }: DocumentModalProps) {
    const [documentName, setDocumentName] = useState('');
    const [description, setDescription] = useState('');
    const [documentPurpose, setDocumentPurpose] = useState('');
    const [commonUse, setCommonUse] = useState('');
    const [physicalRequirements, setPhysicalRequirements] = useState('');
    const [documentType, setDocumentType] = useState('certificate');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = {
            documentName,
            documentPurpose,
            commonUse,
            physicalRequirements,
            documentType,
        };

        // Make API call to store document
        router.post('/documents', formData, {
            onSuccess: () => {
                setIsSubmitting(false);
                onClose();
                // Reset form
                setDocumentName('');
                setDocumentPurpose('');
                setCommonUse('');
                setPhysicalRequirements('');
                setDocumentType('certificate');
            },
            onError: (errors: any) => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
                            <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-background text-left align-middle shadow-2xl transition-all">
                                {/* Modal Header */}
                                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4">
                                    <DialogTitle
                                        as="h2"
                                        className="text-xl font-bold text-foreground"
                                    >
                                        Generate New Document
                                    </DialogTitle>
                                    <button
                                        onClick={onClose}
                                        type="button"
                                        disabled={isSubmitting}
                                        className="rounded-full p-2 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <fieldset
                                        disabled={isSubmitting}
                                        className="group"
                                    >
                                        {/* Modal Body */}
                                        <div className="space-y-6 p-6 transition-opacity group-disabled:opacity-60">
                                            {/* Document Name Field */}
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-semibold text-muted-foreground">
                                                    Document Name
                                                </label>
                                                <Input
                                                    type="text"
                                                    value={documentName}
                                                    onChange={(e) =>
                                                        setDocumentName(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-11 w-full rounded-lg border border-border px-3 transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                />
                                            </div>

                                            {/* Document Type Field */}
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-semibold text-muted-foreground">
                                                    Document Type *
                                                </label>
                                                <select
                                                    required
                                                    value={documentType}
                                                    onChange={(e) =>
                                                        setDocumentType(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-lg border border-border px-3 py-2.5 text-sm transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                >
                                                    <option value="certificate">
                                                        Certificate
                                                    </option>
                                                    <option value="clearance">
                                                        Clearance
                                                    </option>
                                                    <option value="special">
                                                        Special
                                                    </option>
                                                </select>
                                            </div>

                                            {/* Description Field */}
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-semibold text-muted-foreground">
                                                    Description *
                                                </label>
                                                <textarea
                                                    required
                                                    value={description}
                                                    onChange={(e) =>
                                                        setDescription(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="What is this document?"
                                                    rows={4}
                                                    className="w-full resize-none rounded-lg border border-border px-3 py-2 transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                />
                                            </div>

                                            {/* Document Purpose Field */}
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-semibold text-muted-foreground">
                                                    Document Purpose *
                                                </label>
                                                <textarea
                                                    required
                                                    value={documentPurpose}
                                                    onChange={(e) =>
                                                        setDocumentPurpose(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="What is the purpose of this document?"
                                                    rows={3}
                                                    className="w-full resize-none rounded-lg border border-border px-3 py-2 transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                />
                                            </div>

                                            {/* Common Uses Field */}
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-semibold text-muted-foreground">
                                                    Common Uses *
                                                </label>
                                                <textarea
                                                    required
                                                    value={commonUse}
                                                    onChange={(e) =>
                                                        setCommonUse(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="How to use this document?"
                                                    rows={3}
                                                    className="w-full resize-none rounded-lg border border-border px-3 py-2 transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                />
                                            </div>

                                            {/* Physical Requirements Field */}
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-semibold text-muted-foreground">
                                                    Physical Requirements
                                                </label>
                                                <textarea
                                                    value={physicalRequirements}
                                                    onChange={(e) =>
                                                        setPhysicalRequirements(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Other physical requirements"
                                                    rows={3}
                                                    className="w-full resize-none rounded-lg border border-border px-3 py-2 transition focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                                                />
                                            </div>
                                        </div>

                                        {/* Modal Footer */}
                                        <div className="flex items-center justify-end gap-3 border-t border-border bg-muted px-6 py-4">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                disabled={isSubmitting}
                                                className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="rounded-lg bg-blue-900 px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {isSubmitting
                                                    ? 'Submitting...'
                                                    : 'Submit'}
                                            </button>
                                        </div>
                                    </fieldset>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
