import { CircleAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';

export default function About() {
    return (
        <>
            <section className="flex w-full flex-col items-center bg-white px-35 py-25 font-rubik">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <span className="text-5xl font-bold">ABOUT US</span>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="mt-5"
                >
                    <span className="text-3xl text-[#0b1f6d]">
                        Welcome to the official Barangay Online Services Portal!
                    </span>
                </motion.div>

                <div className="mt-20 grid grid-cols-2 text-[#0b1f6d]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.5 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="flex h-full w-full items-center"
                    >
                        <img
                            src="/myassets/AboutLogo.png"
                            alt="About logo"
                            className="h-120 w-120 object-cover"
                        />
                    </motion.div>
                    <div className="flex flex-col items-center justify-center gap-10 text-2xl">
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
                    className="mt-15"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <Button className="cursor-pointer bg-[#172F92] text-white hover:bg-[#1c2c6c] hover:text-white">
                        <CircleAlert />
                        Learn More
                    </Button>
                </motion.div>
            </section>
        </>
    );
}
