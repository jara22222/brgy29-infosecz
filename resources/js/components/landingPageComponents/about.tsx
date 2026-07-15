import { motion } from 'framer-motion';
import { CircleAlert } from 'lucide-react';
import { Button } from '../ui/button';

export default function About() {
    return (
        <>
            <section
                id="about"
                className="flex w-full flex-col items-center bg-white px-4 py-12 font-rubik sm:px-8 sm:py-16 md:px-16 lg:px-24 lg:py-20 xl:px-35 xl:py-25"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <span className="text-3xl font-bold sm:text-4xl md:text-5xl">
                        ABOUT US
                    </span>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="mt-4 text-center sm:mt-5"
                >
                    <span className="text-xl text-[#0b1f6d] sm:text-2xl md:text-3xl">
                        Welcome to the official Barangay Online Services Portal!
                    </span>
                </motion.div>

                <div className="mt-10 grid grid-cols-1 gap-8 text-[#0b1f6d] md:mt-16 md:grid-cols-2 md:gap-16 lg:mt-20 lg:gap-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.5 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="flex h-full w-full items-center justify-center"
                    >
                        <img
                            src="/myassets/AboutLogo.png"
                            alt="About logo"
                            className="h-auto w-full max-w-md object-cover sm:max-w-lg md:max-w-xl lg:h-120 lg:w-120"
                        />
                    </motion.div>
                    <div className="flex flex-col items-center justify-center gap-6 text-base sm:gap-8 sm:text-lg md:gap-10 md:text-xl lg:text-2xl">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="text-justify"
                        >
                            Our goal is to make barangay services faster,
                            easier, and more convenient for everyone. Through
                            this website, residents can request certificates,
                            clearances, and other important documents without
                            having to line up at the barangay hall.
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="text-justify"
                        >
                            We are committed to giving efficient, transparent,
                            and people-centered service. By using this online
                            system, we hope to make government service more
                            accessible to everyone — from students to workers,
                            and parents.
                        </motion.span>
                    </div>
                </div>

                <motion.div
                    className="mt-8 sm:mt-12 md:mt-15"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <Button className="cursor-pointer bg-[#172F92] text-sm text-white hover:bg-[#1c2c6c] hover:text-white sm:text-base">
                        <CircleAlert className="h-4 w-4 sm:h-5 sm:w-5" />
                        Learn More
                    </Button>
                </motion.div>
            </section>
        </>
    );
}
