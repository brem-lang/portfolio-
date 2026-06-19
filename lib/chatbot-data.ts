export const resumeData = {
    profile: {
        name: 'Patrick Barcelo',
        title: 'Software Developer',
        summary:
            'Dedicated and versatile Software Developer with 4+ years of experience in backend development, server management, and front-end design. Skilled in building scalable web applications using Laravel, Inertia, and Filament, with hands-on experience in AWS cloud services. Strong problem-solving abilities, clean coding practices, and a passion for learning and exploring new technologies.',
    },

    contact: {
        phone: '09959028324',
        email: 'patrickbarcelo17@gmail.com',
    },

    education: [
        {
            degree: 'Bachelor of Science in Information Technology',
            school: 'University of the Immaculate Conception',
            period: '2018 – 2022',
            details: ['Major in Learning Technologies'],
        },
        {
            degree: 'Senior High School – ICT Strand (TVL Track)',
            school: 'Davao Central College',
            period: '2015 – 2018',
            details: ['Computer Servicing System', 'Visual Graphics Design'],
        },
    ],

    experience: [
        {
            role: 'Software Developer',
            company: 'NetlinkVoice',
            period: '2023 – Present',
            bullets: [
                'Developed and maintained web applications using Laravel Filament and Laravel Inertia.',
                'Designed and integrated REST APIs for seamless data flow across services.',
                'Implemented and maintained AWS services to ensure scalable and reliable deployments.',
                'Improved front-end design for better user experience using modern frameworks.',
                'Wrote clean, maintainable, and reusable code following best practices.',
                'Integrated third-party APIs such as Stripe for payment processing and Google Maps for location services.',
            ],
        },
        {
            role: 'Software Developer',
            company: 'Classify Inc',
            period: '2022 – 2023',
            bullets: [
                'Designed application wireframes using Figma to align with business requirements.',
                'Developed backend systems with Laravel, ensuring secure and efficient data handling.',
                'Managed servers and virtual hosting on Ubuntu 20.04.',
                'Delivered optimized, readable, and maintainable code to improve system performance.',
                'Created REST APIs that integrate with mobile applications and web interfaces.',
                'Contributed and participated in new feature/product specifications.',
            ],
        },
    ],

    skills: {
        languages: [
            'PHP', 'Laravel', 'Inertia', 'Filament',
            'Java', 'JavaScript', 'TypeScript',
            'React.js', 'Vue.js',
            'HTML5', 'CSS', 'Tailwind CSS', 'Bootstrap',
            'Material UI', 'Ant Design', 'Alpine.js',
            'Laravel Reverb', 'Stripe',
        ],
        databases: ['MySQL', 'PostgreSQL', 'Firebase'],
        tools: [
            'Git', 'AWS', 'Virtual Hosting (Ubuntu)',
            'Laragon', 'FlutterFlow', 'Figma',
            'Photoshop', 'Illustrator',
        ],
        other: ['REST API development', 'Frontend UI/UX design', 'Server Management'],
    },
} as const;
