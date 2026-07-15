import { Mail, User } from 'lucide-react';
import { useState } from 'react';

const Feedback = () => {
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        feedback: '',
    });

    const handleRatingSelect = (index: number) => {
        setSelectedRating(index);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Add submission logic here
    };

    // Emoji data structure
    const ratings = [
        { emoji: '😠', label: "Didn't meet\nexpectations" },
        { emoji: '🙁', label: '' },
        { emoji: '😐', label: 'Met\nexpectations' },
        { emoji: '🙂', label: '' },
        { emoji: '😁', label: 'Exceeded\nexpectations' },
    ];

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted p-3 font-sans sm:p-4">
            <div className="w-full space-y-6 rounded-xl bg-background p-4 shadow-sm sm:space-y-8 sm:p-6 md:p-8 lg:p-10">
                {/* Header Section */}
                <div className="space-y-2 text-center">
                    <h1 className="text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
                        Rate your experience
                    </h1>
                    <p className="text-sm text-muted-foreground sm:text-base">
                        Please take a moment to rate your experience with our
                        service.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 sm:space-y-8"
                >
                    {/* Form Fields Container */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label
                                htmlFor="fullName"
                                className="text-xs font-medium text-muted-foreground sm:text-sm"
                            >
                                Full Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="John Carter"
                                    className="w-full rounded-lg border border-border py-2.5 pr-9 pl-3 text-sm text-foreground placeholder-gray-300 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:py-3 sm:pr-10 sm:pl-4"
                                />
                                <User className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400 sm:right-3 sm:h-5 sm:w-5" />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-xs font-medium text-muted-foreground sm:text-sm"
                            >
                                Email address
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email address"
                                    className="w-full rounded-lg border border-border py-2.5 pr-9 pl-3 text-sm text-foreground placeholder-gray-300 transition-all outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100 sm:py-3 sm:pr-10 sm:pl-4"
                                />
                                <Mail className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400 sm:right-3 sm:h-5 sm:w-5" />
                            </div>
                        </div>
                    </div>

                    {/* Rating Section */}
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-start justify-between gap-1 sm:gap-2 md:gap-4">
                            {ratings.map((item, index) => {
                                const isSelected = selectedRating === index;
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() =>
                                            handleRatingSelect(index)
                                        }
                                        className="group flex flex-col items-center gap-2 transition-transform focus:outline-none active:scale-95 sm:gap-3"
                                    >
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl shadow-sm transition-all duration-200 sm:h-12 sm:w-12 sm:text-2xl ${
                                                isSelected
                                                    ? 'scale-110 bg-[#1e3a8a] text-white shadow-md'
                                                    : 'bg-gray-100 text-muted-foreground hover:bg-gray-200'
                                            } `}
                                        >
                                            {item.emoji}
                                        </div>
                                        {item.label && (
                                            <span
                                                className={`max-w-[70px] text-center text-[9px] leading-tight font-medium sm:max-w-[80px] sm:text-[10px] ${isSelected ? 'text-[#1e3a8a]' : 'text-muted-foreground'} `}
                                            >
                                                {item.label}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Comment Section */}
                    <div className="space-y-2">
                        <label
                            htmlFor="feedback"
                            className="text-xs font-bold text-foreground sm:text-sm"
                        >
                            Tell us about your experience (optional)
                        </label>
                        <textarea
                            id="feedback"
                            name="feedback"
                            value={formData.feedback}
                            onChange={handleInputChange}
                            placeholder="Write your feedback here..."
                            rows={4}
                            className="w-full resize-none rounded-lg border border-border p-3 text-sm text-foreground placeholder-gray-300 transition-all outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100 sm:p-4"
                        />
                    </div>

                    {/* Action Button */}
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-[#1e3a8a] py-3 font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-blue-900 sm:py-4"
                    >
                        Submit feedback
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Feedback;
