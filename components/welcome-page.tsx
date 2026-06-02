'use client';

import { ChevronUp, ExternalLink, Mail, Moon, Phone, Sun } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { PortfolioContactForm } from '@/components/portfolio/portfolio-contact-form';
import { PortfolioSnakeDialog } from '@/components/portfolio/portfolio-snake-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppearance } from '@/hooks/use-appearance';
import { useInView } from '@/hooks/use-in-view';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import { cn } from '@/lib/utils';

const SECTION_IDS = ['about', 'skills', 'experience', 'projects', 'education'] as const satisfies readonly string[];

const HEADER_SCROLL_OFFSET = 80;
const SCROLL_TOP_BUTTON_THRESHOLD_PX = 300;

function timeGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

const skillGroups = [
    {
        title: 'Languages & frameworks',
        items: ['PHP', 'Native PHP', 'Laravel', 'Inertia', 'Filament', 'JavaScript', 'TypeScript', 'React.js', 'Vue.js', 'Alpine.js', 'Java', 'Laravel Reverb'],
    },
    {
        title: 'UI & styling',
        items: ['Tailwind CSS', 'Bootstrap', 'Material UI', 'Ant Design', 'HTML5', 'CSS'],
    },
    {
        title: 'Databases',
        items: ['MySQL', 'PostgreSQL', 'Firebase'],
    },
    {
        title: 'Tools & platforms',
        items: ['Git', 'AWS Cloud Services', 'Stripe', 'PayMongo', 'Virtual Hosting (Ubuntu 20.04)', 'Laragon', 'FlutterFlow', 'Figma'],
    },
    {
        title: 'Design & others',
        items: ['Photoshop', 'Illustrator', 'REST API development', 'Frontend UI/UX design', 'Server management'],
    },
] as const;

const portfolioProjects = [
    {
        key: 'ilabel',
        title: 'iLABEL',
        subtitle: 'Digital annotation · cloud delivery',
        badges: ['React', 'Firebase', 'Machine vision'] as const,
        description: 'iLABEL is a cloud-powered digital annotation system built with React JS and Firebase for seamless, real-time data tagging.',
        imageSrc: '/images/projects/ilabel.png',
        imageAlt: 'iLABEL product login screen showing split navy branding and white sign-in form',
        imageWidth: 960,
        imageHeight: 540,
        href: 'https://ilabel-tool.web.app/login',
    },
    {
        key: 'crist-briand',
        title: 'Crist Briand',
        subtitle: 'CMS · storefront · digital products',
        badges: ['Laravel', 'Livewire', 'PayMongo'] as const,
        description: 'A dynamic Content Management System built with Laravel and Livewire, featuring integrated PayMongo processing for seamless, real-time online payments.',
        imageSrc: '/images/projects/crist-briand.png',
        imageAlt: 'Crist Briand homepage with hero skateboarding imagery, navigation, and content sections',
        imageWidth: 960,
        imageHeight: 540,
        href: 'https://cristbriand.com/',
    },
    {
        key: 'millenium-suites-hms',
        title: 'Millenium Suites',
        subtitle: 'Hotel reservation · guest & admin',
        badges: ['Laravel', 'React', 'Multi-user roles'] as const,
        description: 'A full-stack hotel reservation system built with Laravel and React, featuring secure multi-user role management for a seamless guest booking and administrative experience.',
        imageSrc: '/images/projects/millenium-suites-hms.png',
        imageAlt: 'Millenium Suites HMS homepage hero with modern suites at dusk, logo, navigation, and tagline Unlock comfort Enjoy Relax',
        imageWidth: 960,
        imageHeight: 540,
        href: 'https://milleniumsuiteshms.com/index',
    },
    {
        key: 'hanapbok',
        title: 'HanapBok',
        subtitle: 'Beach tourism · Mabini resorts',
        badges: ['Laravel', 'React', 'Bookings'] as const,
        description: 'A localized beach tourism platform built with Laravel and React, enabling multi-resort administrators in Mabini to seamlessly manage bookings, accommodations, and real-time guest reservations.',
        imageSrc: '/images/projects/hanapbok.png',
        imageAlt: 'HanapBok landing page with tropical hero, lime green accents, Welcome to HanapBok about section and resort imagery',
        imageWidth: 960,
        imageHeight: 540,
        href: 'https://hanapbok.com/index',
    },
] as const;

type RevealProps = {
    readonly children: ReactNode;
    readonly className?: string;
    readonly reducedMotion: boolean;
};

function Reveal({ children, className, reducedMotion }: RevealProps) {
    const [ref, inView] = useInView<HTMLDivElement>({ once: true, rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    const visible = reducedMotion || inView;

    return (
        <div
            ref={ref}
            className={cn(
                reducedMotion === false && 'motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out',
                visible ? 'opacity-100 motion-safe:translate-y-0' : reducedMotion === false && 'opacity-0 motion-safe:translate-y-6',
                className,
            )}
        >
            {children}
        </div>
    );
}

type NavSectionsProps = { readonly activeId: string; readonly navClass?: string };

function NavSections({ activeId, navClass }: NavSectionsProps) {
    const linkBase = 'focus-visible:text-foreground focus-visible:ring-ring rounded-md text-sm transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-offset-2 focus-visible:outline-none focus-visible:ring-offset-background';

    return (
        <div className={cn('items-center gap-5', navClass)}>
            {SECTION_IDS.map((id) => (
                <a
                    key={id}
                    href={`#${id}`}
                    className={cn(
                        linkBase,
                        'text-muted-foreground capitalize',
                        activeId === id && 'font-medium text-foreground underline decoration-primary decoration-2 underline-offset-8',
                    )}
                >
                    {id}
                </a>
            ))}
        </div>
    );
}

export function WelcomePage() {
    const reducedMotion = useReducedMotion();
    const activeId = useScrollSpy(SECTION_IDS, HEADER_SCROLL_OFFSET);
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const greeting = timeGreeting();
    const [showScrollTopButton, setShowScrollTopButton] = useState(false);

    useEffect(() => {
        const onScroll = (): void => setShowScrollTopButton(window.scrollY > SCROLL_TOP_BUTTON_THRESHOLD_PX);
        window.addEventListener('scroll', onScroll, { passive: true });
        queueMicrotask(onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = (): void => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    const toggleTheme = (): void => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
            <div
                aria-hidden
                className={cn(
                    'pointer-events-none absolute inset-0 -z-10 opacity-40',
                    reducedMotion === false && 'motion-safe:bg-[linear-gradient(to_right,oklch(0.7_0.02_75_/_0.08)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.7_0.02_75_/_0.08)_1px,transparent_1px)] motion-safe:[background-size:24px_24px]',
                    'dark:opacity-30 dark:motion-safe:bg-[linear-gradient(to_right,oklch(0.45_0.02_75_/_0.12)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.45_0.02_75_/_0.12)_1px,transparent_1px)]',
                )}
            />
            <div
                aria-hidden
                className={cn(
                    'pointer-events-none absolute top-0 right-0 left-0 -z-10 h-[42rem] bg-gradient-to-b from-primary/15 via-background to-secondary/10',
                    reducedMotion === false && 'motion-safe:animate-in motion-safe:duration-1000 motion-safe:fade-in',
                )}
            />

            <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/65">
                <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-6 py-3 sm:flex-nowrap sm:justify-between">
                    <a href="#top" className="shrink-0 rounded-md text-lg font-semibold tracking-tight text-foreground focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none">
                        Patrick Barcelo
                    </a>
                    <NavSections activeId={activeId} navClass="hidden md:flex" />
                    <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className={cn('border-border/80', '*:size-[1.125rem]')}
                            aria-label={`Switch to ${resolvedAppearance === 'dark' ? 'light' : 'dark'} mode`}
                            onClick={() => toggleTheme()}
                        >
                            {resolvedAppearance === 'dark' ? <Sun /> : <Moon />}
                        </Button>
                    </div>
                </div>
                <details className="mx-auto max-w-5xl border-t border-border/60 px-6 py-3 md:hidden">
                    <summary className="cursor-pointer text-sm font-medium tracking-wide text-muted-foreground uppercase select-none">On this page</summary>
                    <NavSections activeId={activeId} navClass="mt-4 flex flex-col items-start gap-4" />
                </details>
            </header>

            <main id="top" className="relative mx-auto max-w-5xl space-y-16 px-6 py-14 sm:space-y-20 sm:py-20">
                <section className="grid scroll-mt-20 items-center gap-10 lg:grid-cols-[1.08fr_minmax(0,0.92fr)] lg:gap-14">
                    <div className="space-y-6">
                        <p className="text-sm tracking-wide text-muted-foreground uppercase">Software developer · full-stack</p>
                        <div className="space-y-3">
                            <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.05rem]">
                                Building reliable web apps with Laravel, clean APIs, and thoughtful UI.
                            </h1>
                            <p className="text-lg text-pretty text-muted-foreground sm:text-xl">
                                {greeting}—thanks for visiting. Based in the Philippines with 4+ years shipping products end to end across backend, infra, and front end.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild size="lg" className="gap-2">
                                <a href="mailto:patrickbarcelo17@gmail.com">
                                    <Mail className="size-4 shrink-0" /> Email
                                </a>
                            </Button>
                            <Button variant="outline" size="lg" className="gap-2 border-border" asChild>
                                <a href="tel:+639959028324">
                                    <Phone className="size-4 shrink-0" /> Call · 09959028324
                                </a>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <a href="#skills">View skills</a>
                            </Button>
                        </div>
                    </div>
                    <div className="mx-auto flex w-full justify-center lg:justify-end">
                        <div className="group relative w-full max-w-sm">
                            <div className={cn(
                                'aspect-[3/4] overflow-hidden rounded-3xl bg-card shadow-lg ring-4 ring-border/80 ring-offset-[6px] ring-offset-background outline-none',
                                reducedMotion === false && 'motion-safe:duration-300 motion-safe:ease-out motion-safe:pointer-fine:motion-safe:transition-transform motion-safe:pointer-fine:motion-safe:hover:scale-[1.02]',
                                'dark:shadow-2xl dark:shadow-primary/15',
                                'motion-safe:pointer-fine:motion-safe:hover:ring-primary/40',
                            )}>
                                <img
                                    src="/images/profile.png"
                                    alt="Patrick Barcelo smiling in formal Barong Tagalog attire"
                                    className="pointer-events-none h-full w-full object-cover object-[center_top]"
                                    width={576}
                                    height={768}
                                    loading="eager"
                                    decoding="async"
                                />
                                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background/95 to-transparent" />
                            </div>
                        </div>
                    </div>
                </section>

                <Reveal reducedMotion={reducedMotion}>
                    <section id="about" aria-labelledby="about-heading" className={cn('scroll-mt-20 space-y-4 rounded-2xl border border-border/70 bg-muted/35 p-8 sm:p-10', 'dark:bg-muted/20', reducedMotion === false && 'motion-safe:pointer-fine:motion-safe:transition-colors motion-safe:pointer-fine:motion-safe:hover:border-primary/30')}>
                        <div className="space-y-3">
                            <p className="text-xs font-semibold text-primary uppercase">Snapshot</p>
                            <h2 id="about-heading" className="text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
                                Dedicated to maintainable backends and UX that ships.
                            </h2>
                        </div>
                        <div className="space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                            <p>I am Patrick Barcelo, a versatile software developer with over four years of experience in full-stack web development, robust backends, pragmatic front ends, cloud infrastructure, and calm operations.</p>
                            <p>I care about clean code, scalable architecture, and continuous learning—pairing Laravel and modern JavaScript with API design and deployment practices that keep teams moving.</p>
                        </div>
                    </section>
                </Reveal>

                <Reveal reducedMotion={reducedMotion}>
                    <section id="skills" aria-labelledby="skills-heading" className="scroll-mt-20 space-y-8">
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-primary uppercase">Capabilities</p>
                            <h2 id="skills-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">Technical skills</h2>
                            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">Grouped for quick scanning—each cluster reflects how I partner with product, design, and infrastructure.</p>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            {skillGroups.map((group) => (
                                <Card key={group.title} className={cn('border-border/70 motion-safe:transition-transform motion-safe:duration-300', reducedMotion === false && 'motion-safe:pointer-fine:motion-safe:hover:-translate-y-1 motion-safe:pointer-fine:motion-safe:hover:shadow-md')}>
                                    <CardHeader className="space-y-1">
                                        <CardTitle className="text-lg">{group.title}</CardTitle>
                                        <CardTitle className="text-sm font-normal text-muted-foreground">Tools I stay sharp on for delivery.</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-wrap gap-2">
                                        {group.items.map((item) => (
                                            <Badge key={item} variant="secondary" className={cn('border-border/60 bg-secondary/80 text-xs font-medium text-secondary-foreground', reducedMotion === false && 'motion-safe:transition motion-safe:duration-200 motion-safe:pointer-fine:motion-safe:hover:-translate-y-0.5 motion-safe:pointer-fine:motion-safe:hover:border-primary/40')}>
                                                {item}
                                            </Badge>
                                        ))}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </Reveal>

                <Reveal reducedMotion={reducedMotion}>
                    <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-20 space-y-8">
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-primary uppercase">Journey</p>
                            <h2 id="experience-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">Work experience</h2>
                            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">Teams I have joined to design, build, and operate customer-facing products.</p>
                        </div>
                        <div className="space-y-5">
                            <Card className={cn('border-border/70', reducedMotion === false && 'motion-safe:transition motion-safe:duration-300 motion-safe:pointer-fine:motion-safe:hover:border-primary/40 motion-safe:pointer-fine:motion-safe:hover:shadow-md')}>
                                <CardHeader className="space-y-2">
                                    <div className="flex flex-wrap items-baseline gap-3">
                                        <CardTitle className="text-xl sm:text-2xl">NetlinkVoice</CardTitle>
                                        <span className="text-sm text-muted-foreground">Software Developer · 2023 – Present</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-inside list-disc space-y-2 text-base leading-relaxed text-muted-foreground">
                                        <li>Developed and maintained web apps with Laravel Filament and Laravel Inertia.</li>
                                        <li>Designed and optimized REST APIs for dependable cross-service communication.</li>
                                        <li>Ran AWS workloads to scale applications and stabilize releases.</li>
                                        <li>Integrated Stripe payments and Google Maps where customers need commerce and location context.</li>
                                        <li>Evolved layouts with React and Vue to improve perceived performance and accessibility.</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className={cn('border-border/70', reducedMotion === false && 'motion-safe:transition motion-safe:duration-300 motion-safe:pointer-fine:motion-safe:hover:border-primary/40 motion-safe:pointer-fine:motion-safe:hover:shadow-md')}>
                                <CardHeader className="space-y-2">
                                    <div className="flex flex-wrap items-baseline gap-3">
                                        <CardTitle className="text-xl sm:text-2xl">Classify Inc</CardTitle>
                                        <span className="text-sm text-muted-foreground">Software Developer · 2022 – 2023</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-inside list-disc space-y-2 text-base leading-relaxed text-muted-foreground">
                                        <li>Built secure Laravel backends with an eye toward performance and maintainability.</li>
                                        <li>Shipped REST APIs tailored for mobile and web clients consuming the same domain model.</li>
                                        <li>Operated deployments and hosting on Ubuntu 20.04 with disciplined change management.</li>
                                        <li>Designed early UX flows in Figma to ground engineering in user goals.</li>
                                        <li>Partnered with PMs on architecture and upcoming feature charters.</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                </Reveal>

                <Reveal reducedMotion={reducedMotion}>
                    <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-20 space-y-8">
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-primary uppercase">Selected work</p>
                            <h2 id="projects-heading" className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Projects</h2>
                            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">Products and tools I&apos;ve shipped, showcased with live links where available.</p>
                        </div>
                        <div className="flex flex-col gap-8">
                            {portfolioProjects.map((project, index) => (
                                <Card key={project.key} className={cn('overflow-hidden border-border/70', reducedMotion === false && 'motion-safe:transition motion-safe:duration-300 motion-safe:pointer-fine:motion-safe:hover:border-primary/40 motion-safe:pointer-fine:motion-safe:hover:shadow-md')}>
                                    <CardContent className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:items-center lg:gap-10">
                                        <div className={cn('overflow-hidden rounded-xl border border-border/70 bg-muted/40 dark:bg-muted/25', index % 2 === 1 && 'lg:order-2')}>
                                            <img src={project.imageSrc} alt={project.imageAlt} className="h-auto w-full object-contain object-top" width={project.imageWidth} height={project.imageHeight} loading="lazy" decoding="async" />
                                        </div>
                                        <div className={cn('flex flex-col gap-5', index % 2 === 1 && 'lg:order-1')}>
                                            <div>
                                                <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{project.title}</h3>
                                                <p className="mt-1 text-sm text-muted-foreground">{project.subtitle}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {project.badges.map((badge) => (
                                                    <Badge key={badge} variant="secondary" className="border-border/60 bg-secondary/80 text-xs font-medium text-secondary-foreground">{badge}</Badge>
                                                ))}
                                            </div>
                                            <CardDescription className="text-base leading-relaxed sm:text-[1.05rem]">{project.description}</CardDescription>
                                            <div>
                                                <Button asChild size="lg" className="gap-2">
                                                    <a href={project.href} target="_blank" rel="noopener noreferrer">
                                                        Open project <ExternalLink aria-hidden className="size-4" />
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <aside aria-labelledby="projects-confidential-heading" className="rounded-2xl border border-border/70 bg-muted/25 p-6 sm:p-8 dark:bg-muted/15">
                            <h3 id="projects-confidential-heading" className="mb-3 text-sm font-semibold tracking-wide text-foreground uppercase">Confidentiality</h3>
                            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">Due to Non-Disclosure Agreements (NDAs), several projects involving fintech, e-commerce, and enterprise software cannot be displayed publicly. Details can be discussed privately upon request.</p>
                        </aside>
                    </section>
                </Reveal>

                <Reveal reducedMotion={reducedMotion}>
                    <section id="education" aria-labelledby="education-heading" className={cn('scroll-mt-20 rounded-3xl border border-border/70 bg-muted/30 p-9 sm:p-11', 'dark:bg-muted/15')}>
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <p className="text-xs font-semibold text-primary uppercase">Foundations</p>
                                <h2 id="education-heading" className="text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">Education & certifications</h2>
                            </div>
                            <div className="divide-y divide-border/70">
                                <div className="space-y-2 py-6 first:pt-0">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-xl font-semibold tracking-tight sm:text-[1.35rem]">Bachelor of Science in Information Technology</h3>
                                            <p className="text-base text-muted-foreground">Major in Learning Technologies</p>
                                        </div>
                                        <Badge variant="outline" className="border-border/70 text-[0.6875rem] text-muted-foreground uppercase">2018 – 2022</Badge>
                                    </div>
                                    <p className="font-medium text-foreground">University of the Immaculate Conception</p>
                                </div>
                                <div className="space-y-2 pt-8">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-xl font-semibold tracking-tight sm:text-[1.35rem]">Senior High School — ICT Strand (TVL Track)</h3>
                                            <p className="text-base text-muted-foreground">Specializations: Computer Servicing System & Visual Graphics Design</p>
                                        </div>
                                        <Badge variant="outline" className="border-border/70 text-[0.6875rem] text-muted-foreground uppercase">2015 – 2018</Badge>
                                    </div>
                                    <p className="font-medium text-foreground">Davao Central College</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </Reveal>

                <Reveal reducedMotion={reducedMotion}>
                    <section id="contact" aria-labelledby="contact-heading" className={cn('scroll-mt-20 rounded-3xl border border-border/70 bg-muted/30 p-9 sm:p-11', 'dark:bg-muted/15')}>
                        <div className="mx-auto max-w-xl space-y-6">
                            <div className="space-y-3">
                                <p className="text-xs font-semibold text-primary uppercase">Contact</p>
                                <h2 id="contact-heading" className="text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">Get in touch</h2>
                                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                                    Let&apos;s build something thoughtfully engineered — send a note with the form below or use email or phone anytime.
                                </p>
                            </div>
                            <PortfolioContactForm />
                        </div>
                    </section>
                </Reveal>
            </main>

            <footer aria-label="Site footer" role="contentinfo" className="border-t border-border/70 bg-muted/35">
                <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-4">
                        <div>
                            <p className="text-[0.6875rem] font-semibold tracking-wide text-primary uppercase">Contact</p>
                            <p className="text-sm text-muted-foreground">Let&apos;s build something thoughtfully engineered.</p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Button variant="outline" size="sm" asChild>
                                <a href="mailto:patrickbarcelo17@gmail.com">patrickbarcelo17@gmail.com</a>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <a href="tel:+639959028324">Call +63 995 902 8324</a>
                            </Button>
                        </div>
                    </div>
                    <div className="text-sm leading-relaxed text-muted-foreground">
                        Crafted by Patrick · {new Date().getFullYear()} · Philippines · remote-friendly
                        <div className="mt-4 flex flex-wrap gap-3">
                            {(['skills', 'experience', 'projects', 'contact'] as const).map((id) => (
                                <a
                                    key={id}
                                    href={`#${id}`}
                                    className="rounded-md border border-transparent px-1 py-0.5 text-sm text-muted-foreground underline decoration-primary/70 underline-offset-8 hover:text-foreground hover:underline focus-visible:border focus-visible:border-input focus-visible:border-ring focus-visible:bg-background focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none dark:focus-visible:border-input dark:focus-visible:bg-background capitalize"
                                >
                                    {id}
                                </a>
                            ))}
                            <PortfolioSnakeDialog reducedMotion={reducedMotion} />
                        </div>
                    </div>
                </div>
            </footer>

            {showScrollTopButton ? (
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Scroll to top"
                    className={cn('fixed right-6 bottom-6 z-40 shrink-0 border-border/80 shadow-lg', '!size-14 rounded-full [&_svg]:shrink-0')}
                    onClick={() => scrollToTop()}
                >
                    <ChevronUp aria-hidden className="size-7" />
                </Button>
            ) : null}
        </div>
    );
}
