import type { Metadata } from 'next';
import { WelcomePage } from '@/components/welcome-page';

export const metadata: Metadata = {
    title: 'Patrick Barcelo – Software Developer',
    description:
        'Full-stack software developer specializing in Laravel, modern front ends, APIs, and cloud deployment.',
};

export default function Home() {
    return <WelcomePage />;
}
