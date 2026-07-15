import { login, register } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '../ui/button';

export default function Header() {
    const { auth } = usePage<any>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="fixed z-50 flex min-h-[60px] w-full items-center justify-between bg-[#172F92] p-3 font-inter font-semibold text-white transition-colors duration-300 sm:min-h-[65px] sm:p-5 sm:px-8 lg:px-24 xl:px-35">
            <div>
                <img
                    src="/myassets/Logo2.png"
                    className="h-12 cursor-pointer sm:h-auto sm:w-[120px]"
                    width={120}
                    alt="BRGY. 29-C Logo"
                />
            </div>
            <div className="ml-auto flex items-center gap-2 sm:gap-5">
                {/* Desktop Navigation */}
                <ul className="hidden items-center gap-3 md:flex md:gap-5">
                    <li className="text-sm hover:underline sm:text-base">
                        <a href="#" className="block w-full cursor-pointer">
                            Home
                        </a>
                    </li>

                    <li className="text-sm hover:underline sm:text-base">
                        <a
                            href="#services"
                            className="block w-full cursor-pointer"
                        >
                            Services
                        </a>
                    </li>
                    <li className="text-sm hover:underline sm:text-base">
                        <a
                            href="#footer"
                            className="block w-full cursor-pointer"
                        >
                            Contacts
                        </a>
                    </li>
                </ul>

                {/* Desktop Auth Buttons */}
                <div className="hidden gap-1 sm:gap-2 md:flex">
                    <Button
                        variant={'outline'}
                        className="cursor-pointer border-2 border-white bg-white px-3 text-xs text-[#172F92] hover:bg-[#172F92] hover:text-white sm:w-25 sm:px-4 sm:text-sm dark:bg-white dark:text-[#172F92] dark:hover:bg-[#172F92] dark:hover:text-white dark:border-white"
                    >
                        <Link href={register()}>Sign up</Link>
                    </Button>
                    <Button
                        variant={'outline'}
                        className="cursor-pointer bg-transparent px-3 text-xs text-white hover:border-2 hover:bg-white hover:text-[#172F92] sm:w-25 sm:px-4 sm:text-sm dark:bg-transparent dark:text-white dark:hover:bg-white dark:hover:text-[#172F92]"
                    >
                        {auth.user ? (
                            <span>Welcome, {auth.user.name}</span>
                        ) : (
                            <Link href={login()}>Log In</Link>
                        )}
                    </Button>
                </div>

                {/* Mobile Hamburger Menu */}
                <button
                    onClick={toggleMobileMenu}
                    className="flex h-8 w-8 flex-col items-center justify-center focus:outline-none md:hidden"
                    aria-label="Toggle menu"
                >
                    <span
                        className={`block h-0.5 w-6 transform bg-white transition-all duration-300 ${isMobileMenuOpen ? 'translate-y-1.5 rotate-45' : ''}`}
                    ></span>
                    <span
                        className={`block h-0.5 w-6 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''} ${isMobileMenuOpen ? 'my-0' : 'my-1.5'}`}
                    ></span>
                    <span
                        className={`block h-0.5 w-6 transform bg-white transition-all duration-300 ${isMobileMenuOpen ? '-translate-y-1.5 -rotate-45' : ''}`}
                    ></span>
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`absolute top-full left-0 w-full bg-[#172F92] transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 overflow-hidden opacity-0'} md:hidden`}
            >
                <div className="flex flex-col space-y-4 p-4">
                    {/* Mobile Navigation Links */}
                    <ul className="flex flex-col space-y-3">
                        <li className="text-sm hover:underline">
                            <a
                                href="#"
                                className="block w-full cursor-pointer py-2"
                            >
                                Home
                            </a>
                        </li>
                        <li className="text-sm hover:underline">
                            <a
                                href="#services"
                                className="block w-full cursor-pointer py-2"
                            >
                                Services
                            </a>
                        </li>
                        <li className="text-sm hover:underline">
                            <a
                                href="#footer"
                                className="block w-full cursor-pointer py-2"
                            >
                                Contacts
                            </a>
                        </li>
                    </ul>

                    {/* Mobile Auth Buttons */}
                    <div className="flex flex-col gap-2 border-t border-white/20 pt-2">
                        <Button
                            variant={'outline'}
                            className="w-full cursor-pointer border-2 border-white bg-white px-3 text-xs text-[#172F92] hover:bg-[#172F92] hover:text-white dark:bg-white dark:text-[#172F92] dark:hover:bg-[#172F92] dark:hover:text-white dark:border-white"
                        >
                            <Link href={register()}>Sign up</Link>
                        </Button>
                        <Button
                            variant={'outline'}
                            className="w-full cursor-pointer bg-transparent px-3 text-xs text-white hover:border-2 hover:bg-white hover:text-[#172F92] dark:bg-transparent dark:text-white dark:hover:bg-white dark:hover:text-[#172F92]"
                        >
                            {auth.user ? (
                                <span>Welcome, {auth.user.name}</span>
                            ) : (
                                <Link href={login()}>Log In</Link>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
