import { Quote } from 'lucide-react';

interface TestimonialItem {
    id: number;
    name: string;
    role: string;
    feedback: string;
    avatar: string;
    rating: string;
    emoji: string;
}

interface TestimonialCardProps {
    item: TestimonialItem;
}

// Data extracted directly from the image
const testimonials = [
    {
        id: 1,
        name: 'Mirana Marci',
        role: 'Registered Resident',
        feedback:
            "I've used other kits, but this one is the best. The attention to detail and usability are truly amazing for all designers. I highly recommend it for any type of project.",
        // Using distinct seeds to get different 3D avatar looks
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Mirana&backgroundColor=b6e3f4',
        rating: 'Exceeded Expectation',
        emoji: '😋',
    },
    {
        id: 2,
        name: 'Crystal Maiden',
        role: 'Registered Resident',
        feedback:
            "This UI Kit is incredibly helpful for my design process. The icons and illustrations are clean, modern, and save me a lot of time. It's perfect for beginners and professionals alike.",
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Crystal&backgroundColor=c0aede',
        rating: 'Exceeded Expectation',
        emoji: '😁',
    },
    {
        id: 3,
        name: 'Dazzle Healer',
        role: 'Guest Resident',
        feedback:
            "This UI Kit saved me hours of work. It's intuitive, high-quality, and totally worth the price for all design needs. My projects look more professional and appealing now.",
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Dazzle&backgroundColor=ffdfbf',
        rating: 'Exceeded Expectation',
        emoji: '😄',
    },
    {
        id: 4,
        name: 'Hearts of Taras',
        role: 'Guest Resident',
        feedback:
            'Amazing work! The color schemes are vibrant, and the icons fit perfectly with all my projects, especially modern UI designs. It makes everything look polished and user-friendly instantly.',
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Taras&backgroundColor=d1d4f9',
        rating: 'Exceeded Expectation',
        emoji: '🤩',
    },
];

const TestimonialCard = ({ item }: TestimonialCardProps) => {
    return (
        <div className="flex h-full flex-col rounded-[2rem] border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Top Row: Quote and Rating */}
            <div className="mb-6 flex items-start justify-between">
                <div className="text-blue-200">
                    {/* Flipped scale to make the quote open correctly if needed, or just standard */}
                    <Quote
                        size={48}
                        fill="currentColor"
                        className="rotate-180 transform"
                    />
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    {item.rating} <span className="text-xl">{item.emoji}</span>
                </div>
            </div>

            {/* Middle: Feedback Text */}
            <p className="mb-8 flex-grow text-base leading-relaxed text-slate-600">
                {item.feedback}
            </p>

            {/* Divider Line */}
            <div className="mb-6 h-px w-full bg-slate-100"></div>

            {/* Bottom: User Profile */}
            <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                    <img
                        src={item.avatar}
                        alt={item.name}
                        className="h-12 w-12 rounded-full object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <h4 className="text-base leading-tight font-bold text-slate-900">
                        {item.name}
                    </h4>
                    <span className="text-sm font-medium text-slate-400">
                        {item.role}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default function Feedback() {
    return (
        <div
            id="feedback"
            className="min-h-screen bg-white py-20 font-inter text-slate-900"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-16 space-y-3 text-center">
                    <h3 className="text-sm font-bold tracking-wide text-blue-600 uppercase">
                        Client Feedback
                    </h3>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                        What Our Client Says About Us
                    </h2>
                </div>

                {/* Grid Container */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
                    {testimonials.map((item) => (
                        <TestimonialCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}
