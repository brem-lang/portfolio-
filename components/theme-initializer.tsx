'use client';

import { useEffect } from 'react';
import { initializeTheme } from '@/hooks/use-appearance';

export function ThemeInitializer() {
    useEffect(() => {
        initializeTheme();
    }, []);

    return null;
}
