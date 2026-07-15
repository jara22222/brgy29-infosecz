import { BookText } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';

export default function Hero() {
    return (
        <>
            <main className="flex min-h-screen w-full flex-col items-center bg-white pt-20 font-inter text-[#172F92]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="relative h-full w-full"
                >
                    <img
                        src="/myassets/HeroImage.png"
                        className="flex h-135 w-full object-cover"
                        alt=""
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 rounded-lg bg-[#264D84] opacity-50" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="w-250 text-center"
                        >
                            <span className="font-rubik text-6xl font-bold text-[#FAD551]">
                                Your Barangay Services, Made Simple and
                                Accessible!
                            </span>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="mt-5 w-150 text-center"
                        >
                            <span className="font-rubi text-2xl font-semibold text-white">
                                Request your certificates and clearances online,
                                contactless and hassle-free.
                            </span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="mt-10"
                        >
                            <Button
                                variant={'default'}
                                className="animate-bounce cursor-pointer bg-[#E6EEF8] text-[#172F92] hover:bg-[#172F92] hover:text-white"
                            >
                                <BookText /> Click here to Continue as Guest!
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
                <div className="flex min-h-20 w-full items-center bg-[#172F92] px-35 font-normal text-white">
                    <span>
                        Barangay Hall Open Hours 8 AM - 5 PM (Monday - Saturday)
                    </span>
                </div>
            </main>
        </>
    );
}
