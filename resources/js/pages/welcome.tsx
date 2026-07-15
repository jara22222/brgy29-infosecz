import About from '@/components/landingPageComponents/about';
import Feedback from '@/components/landingPageComponents/feedback';
import Footer from '@/components/landingPageComponents/footer';
import Header from '@/components/landingPageComponents/header';
import Hero from '@/components/landingPageComponents/hero';
import Services from '@/components/landingPageComponents/services';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Brgy-29-C" />
            <Header />
            <Hero />
            <About />
            <Services />
            <Feedback />
            <Footer />
        </>
    );
}
