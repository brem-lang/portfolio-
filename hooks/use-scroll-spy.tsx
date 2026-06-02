import { useEffect, useState } from 'react';

const defaultThresholds = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5];

export function useScrollSpy(
    sectionIds: readonly string[],
    headerOffsetPx: number,
): string {
    const [activeId, setActiveId] = useState((): string => sectionIds[0] ?? '');

    useEffect(() => {
        if (sectionIds.length === 0) return;

        const elements = sectionIds
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);

        if (elements.length === 0) return;

        const pickClosestToActiveBand = (): void => {
            const bandStart = Math.min(
                Math.max(headerOffsetPx + 1, window.innerHeight * 0.12),
                window.innerHeight * 0.28,
            );
            let bestId = sectionIds[0] ?? '';
            let bestDelta = Infinity;

            for (const section of elements) {
                const rect = section.getBoundingClientRect();
                const center = rect.top + rect.height / 2;
                const delta = Math.abs(center - bandStart);
                if (delta < bestDelta) {
                    bestDelta = delta;
                    bestId = section.id;
                }
            }

            setActiveId((prev) => (prev === bestId ? prev : bestId));
        };

        const observer = new IntersectionObserver(
            (entries) => {
                const intersecting = entries.filter((e) => e.isIntersecting);

                if (intersecting.length === 0) {
                    pickClosestToActiveBand();
                    return;
                }

                const top = [...intersecting].sort(
                    (a, b) => b.intersectionRatio - a.intersectionRatio,
                )[0];

                if (!top?.target.id) return;

                setActiveId((prev) => (prev === top.target.id ? prev : top.target.id));
            },
            {
                threshold: defaultThresholds,
                rootMargin: `-${Math.max(headerOffsetPx, 0)}px 0px -52% 0px`,
            },
        );

        for (const el of elements) observer.observe(el);
        pickClosestToActiveBand();

        return () => observer.disconnect();
    }, [sectionIds, headerOffsetPx]);

    return activeId;
}
