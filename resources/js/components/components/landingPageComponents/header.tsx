import { login, register } from '@/routes';
import { Link } from '@inertiajs/react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useState } from 'react';
import { Button } from '../ui/button';

export default function Header() {
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);

    useMotionValueEvent(scrollY, 'change', (latest) => {
        setScrolled(latest > 600);
    });
    return (
        <>
            <motion.header
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`fixed z-50 flex min-h-[65px] w-full items-center justify-between p-5 px-35 font-inter font-semibold transition-colors duration-300 ${scrolled ? 'bg-[#172F92] text-white' : 'bg-white text-[#172F92]'} `}
            >
                <div>
                    {scrolled ? (
                        <img
                            src="/myassets/Logo2.png"
                            className="cursor-pointer"
                            width={120}
                            alt="Image"
                        />
                    ) : (
                        <img
                            src="/myassets/Logo.png"
                            className="cursor-pointer"
                            width={120}
                            alt="Image"
                        />
                    )}
                </div>
                <div className="flex items-center gap-5">
                    <ul className="flex items-center gap-5">
                        <li className="cursor-pointer hover:underline">Home</li>
                        <li className="cursor-pointer hover:underline">
                            About
                        </li>
                        <li className="cursor-pointer hover:underline">
                            Services
                        </li>
                        <li className="cursor-pointer hover:underline">
                            Contacts
                        </li>
                    </ul>

                    <div className="flex gap-2">
                        <Button
                            variant={'outline'}
                            className={`w-25 cursor-pointer border-2 border-[#172F92] bg-white hover:bg-[#172F92] hover:text-white ${scrolled ? 'border-white bg-[#172F92]' : ''}`}
                        >
                            <Link href={register()}> Sign up</Link>
                        </Button>
                        <Button
                            variant={'outline'}
                            className={`w-25 cursor-pointer bg-[#172F92] text-white hover:border-2 hover:bg-[#1c2c6c] hover:text-white ${scrolled ? 'bg-white text-[#172F92]' : ''}`}
                        >
                            <Link href={login()}>Log In</Link>
                        </Button>
                    </div>
                </div>
            </motion.header>
        </>
    );
}
