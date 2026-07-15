import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <>
            <div className="mb-4 flex justify-center sm:mb-6 md:mb-8">
                <img
                    src="/myassets/Logo.png"
                    alt="BRGY. 29-C ONLINE PORTAL"
                    className="h-16 w-auto sm:h-20"
                />
            </div>
        </>
    );
}
