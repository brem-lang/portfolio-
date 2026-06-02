import type { Metadata } from 'next';
import './globals.css';
import { ThemeInitializer } from '@/components/theme-initializer';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
    title: 'Patrick Barcelo – Software Developer',
    description:
        'Full-stack software developer specializing in Laravel, modern front ends, APIs, and cloud deployment.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Inline script prevents dark-mode flash before React hydrates */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var t=localStorage.getItem('appearance')||'system';var d=(t==='dark')||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}}catch(e){}})()`,
                    }}
                />
            </head>
            <body>
                <ThemeInitializer />
                {children}
                <Toaster />
            </body>
        </html>
    );
}
