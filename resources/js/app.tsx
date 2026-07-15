import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { ToastProvider } from './contexts/toast-context';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITEKEY as string | undefined;

function AppProviders({ children }: { children: ReactNode }) {
    if (!recaptchaSiteKey || recaptchaSiteKey === '${NOCAPTCHA_SITEKEY}') {
        return <>{children}</>;
    }

    return (
        <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
            {children}
        </GoogleReCaptchaProvider>
    );
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ToastProvider>
                <AppProviders>
                    <App {...props} />
                </AppProviders>
            </ToastProvider>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
