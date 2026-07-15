import { motion } from 'framer-motion';
import { BookText } from 'lucide-react';
import { Button } from '../ui/button';

export default function Hero() {
    return (
        <>
            <main className="flex w-full flex-col items-center bg-white pt-[60px] font-inter text-[#172F92] sm:pt-[65px]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="relative w-full"
                >
                    <img
                        src="/myassets/HeroImage.png"
                        className="flex w-full object-cover h-[65vh] md:h-[75vh] lg:h-[calc(100vh-145px)]"
                        alt=""
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 rounded-lg bg-[#264D84] opacity-50" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="w-full max-w-4xl text-center lg:max-w-5xl xl:w-250"
                        >
                            <span className="font-rubik text-2xl font-bold text-[#FAD551] sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl">
                                Your Barangay Services, Made Simple and
                                Accessible!
                            </span>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="mt-4 w-full max-w-2xl text-center sm:mt-5 lg:max-w-3xl xl:w-150"
                        >
                            <span className="font-rubi text-base font-semibold text-white sm:text-xl md:text-2xl lg:text-2xl">
                                Request your certificates and clearances online,
                                contactless and hassle-free.
                            </span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="mt-6 sm:mt-10"
                        >
                            <Button
                                variant={'default'}
                                className="animate-bounce cursor-pointer bg-[#E6EEF8] text-xs text-[#172F92] hover:bg-[#172F92] hover:text-white sm:text-sm"
                            >
                                <BookText className="h-4 w-4 sm:h-5 sm:w-5" />{' '}
                                <span className="hidden sm:inline">
                                    Click here to Continue as Guest!
                                </span>
                                <span className="sm:hidden">
                                    Continue as Guest
                                </span>
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
                <div className="flex min-h-16 w-full items-center justify-center bg-[#172F92] px-4 font-normal text-white sm:min-h-20 sm:px-8 lg:px-24 xl:px-35">
                    <span className="text-center text-xs sm:text-sm md:text-base">
                        Barangay Hall Open Hours 8 AM - 5 PM (Monday - Saturday)
                    </span>
                </div>
            </main>
        </>
    );
}
