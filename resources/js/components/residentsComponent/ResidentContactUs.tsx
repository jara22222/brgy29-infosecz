import { Mail, MapPin, Phone } from 'lucide-react';

export default function ResidentContactUs() {
    return (
        <section className="w-full py-4 font-inter sm:py-6 md:py-8 lg:py-12">
            {/* Header Section */}
            <div className="mb-6 text-center sm:mb-8">
                <div className="mb-3">
                    <span className="text-xs font-semibold text-blue-600 uppercase sm:text-sm">
                        Contact us
                    </span>
                </div>
                <h1 className="mb-3 text-xl font-bold text-foreground sm:text-2xl md:text-3xl lg:text-4xl">
                    Maaari mo kaming padalhan ng mensahe para sa katanungan at
                    alalahanin.
                </h1>
                <p className="text-sm text-muted-foreground md:text-base lg:text-lg">
                    Kami ay laging narito para sagutin ang inyong mga
                    katanungan.
                </p>
            </div>

            {/* Contact Grid Section */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 md:gap-6 lg:grid-cols-3">
                {/* Email Column */}
                <div className="text-center">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 sm:mb-3 sm:h-12 sm:w-12">
                        <Mail className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="mb-2 text-sm font-semibold text-foreground">
                        Email
                    </h3>
                    <p className="mb-2 text-xs text-muted-foreground sm:mb-3">
                        Our friendly team is here to help.
                    </p>
                    <p className="text-xs font-semibold text-blue-700 sm:text-sm">
                        hi@untitledui.com
                    </p>
                </div>

                {/* Office Column */}
                <div className="text-center">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 sm:mb-3 sm:h-12 sm:w-12">
                        <MapPin className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="mb-2 text-sm font-semibold text-foreground">
                        Office
                    </h3>
                    <p className="mb-2 text-xs text-muted-foreground sm:mb-3">
                        Come say hello at our office HQ.
                    </p>
                    <p className="text-xs font-semibold text-blue-700 sm:text-sm">
                        100 Smith Street
                        <br />
                        Collingwood VIC 3066 AU
                    </p>
                </div>

                {/* Phone Column */}
                <div className="text-center">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 sm:mb-3 sm:h-12 sm:w-12">
                        <Phone className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="mb-2 text-sm font-semibold text-foreground">
                        Phone
                    </h3>
                    <p className="mb-2 text-xs text-muted-foreground sm:mb-3">
                        Mon-Fri from 8am to 5pm.
                    </p>
                    <p className="text-xs font-semibold text-blue-700 sm:text-sm">
                        +1 (555) 000-0000
                    </p>
                </div>
            </div>
        </section>
    );
}
