import { motion } from 'framer-motion';
import { Clock, Facebook, Mail, MapPin, Phone, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-blue-900 text-white" id="footer">
            <div className="w-full px-4 py-12 sm:px-8 md:px-16 lg:px-24 xl:px-35">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Barangay Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="space-y-4"
                    >
                        <h3 className="font-rubik text-xl font-bold">
                            Barangay Hall
                        </h3>
                        <p className="text-sm leading-relaxed text-blue-100">
                            Your trusted local government unit providing
                            efficient services and fostering community
                            development.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a
                                href="#"
                                className="cursor-pointer text-blue-100 transition-colors duration-200 hover:text-white"
                                aria-label="Facebook"
                            >
                                <Facebook size={20} />
                            </a>
                            <a
                                href="#"
                                className="cursor-pointer text-blue-100 transition-colors duration-200 hover:text-white"
                                aria-label="Twitter"
                            >
                                <Twitter size={20} />
                            </a>
                            <a
                                href="mailto:info@barangay.gov"
                                className="cursor-pointer text-blue-100 transition-colors duration-200 hover:text-white"
                                aria-label="Email"
                            >
                                <Mail size={20} />
                            </a>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="space-y-4"
                    >
                        <h3 className="font-rubik text-xl font-bold">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#services"
                                    className="cursor-pointer text-sm text-blue-100 transition-colors duration-200 hover:text-white"
                                >
                                    Services
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#about"
                                    className="cursor-pointer text-sm text-blue-100 transition-colors duration-200 hover:text-white"
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#footer"
                                    className="cursor-pointer text-sm text-blue-100 transition-colors duration-200 hover:text-white"
                                >
                                    Contacts
                                </a>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="space-y-4"
                    >
                        <h3 className="font-rubik text-xl font-bold">
                            Contact Info
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <MapPin
                                    size={18}
                                    className="mt-1 flex-shrink-0 text-blue-200"
                                />
                                <span className="text-sm text-blue-100">
                                    123 Main Street, Barangay District
                                    <br />
                                    City, Province 1234
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone
                                    size={18}
                                    className="flex-shrink-0 text-blue-200"
                                />
                                <span className="text-sm text-blue-100">
                                    (02) 1234-5678
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail
                                    size={18}
                                    className="flex-shrink-0 text-blue-200"
                                />
                                <span className="text-sm text-blue-100">
                                    info@barangay.gov
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Office Hours */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="space-y-4"
                    >
                        <h3 className="font-rubik text-xl font-bold">
                            Office Hours
                        </h3>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                                <Clock
                                    size={18}
                                    className="flex-shrink-0 text-blue-200"
                                />
                                <div className="text-sm text-blue-100">
                                    <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                                    <p>Saturday: 8:00 AM - 12:00 PM</p>
                                    <p>Sunday: Closed</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Logo Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="mt-12 text-center"
                >
                    <img
                        src="/myassets/AboutLogo.png"
                        alt="Barangay Hall Logo"
                        className="mx-auto h-24 w-auto sm:h-32 md:h-40 lg:h-48"
                    />
                </motion.div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 1.0, ease: 'easeOut' }}
                    className="border-t border-blue-800 pt-8 text-center"
                >
                    <p className="text-sm text-blue-200">
                        © {new Date().getFullYear()} Barangay Hall. All rights
                        reserved.
                    </p>
                    <p className="mt-2 text-xs text-blue-300">
                        Designed with ❤️ for our community
                    </p>
                </motion.div>
            </div>
        </footer>
    );
}
