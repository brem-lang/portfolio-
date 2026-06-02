import type { RefCallback } from 'react';
import { useCallback, useEffect, useState } from 'react';

export type UseInViewOptions = IntersectionObserverInit & {
    readonly once?: boolean;
};

export function useInView<H extends HTMLElement = HTMLElement>(
    options: UseInViewOptions = {},
): readonly [RefCallback<H>, boolean] {
    const { once = true, ...observerInit } = options;
    const { root, rootMargin, threshold } = observerInit;

    const [inView, setInView] = useState(false);
    const [node, setNode] = useState<H | null>(null);

    const setRef = useCallback((el: H | null) => setNode(el), []);

    useEffect(() => {
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry) return;

                if (entry.isIntersecting) {
                    setInView(true);
                    if (once) observer.disconnect();
                } else if (!once) {
                    setInView(false);
                }
            },
            { root, rootMargin, threshold },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [node, once, root, rootMargin, threshold]);

    return [setRef, inView] as const;
}
