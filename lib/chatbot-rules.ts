import { resumeData } from './chatbot-data';

interface Rule {
    keywords: string[];
    response: () => string;
    suggestions: string[];
}

export interface BotReply {
    reply: string;
    suggestions: string[];
}

const { profile, contact, education, experience, skills } = resumeData;

const rules: Rule[] = [
    {
        keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'sup', 'greet'],
        response: () =>
            `Hi there! 👋 I'm a chatbot for ${profile.name}'s portfolio. I can answer questions about his skills, experience, education, and how to get in touch. What would you like to know?`,
        suggestions: ['About Patrick', 'Skills', 'Experience', 'Contact'],
    },
    {
        keywords: ['who', 'about', 'introduce', 'yourself', 'patrick', 'tell me', 'summary', 'overview', 'background'],
        response: () =>
            `**${profile.name}** — ${profile.title}\n\n${profile.summary}`,
        suggestions: ['Skills', 'Experience', 'Education', 'Contact'],
    },
    {
        keywords: ['skill', 'tech', 'stack', 'technology', 'know', 'language', 'framework', 'expertise', 'proficient'],
        response: () =>
            `Here are ${profile.name}'s skills:\n\n` +
            `**Languages & Frameworks:** ${skills.languages.join(', ')}\n\n` +
            `**Databases:** ${skills.databases.join(', ')}\n\n` +
            `**Tools & Platforms:** ${skills.tools.join(', ')}\n\n` +
            `**Other:** ${skills.other.join(', ')}`,
        suggestions: ['Laravel & PHP', 'Frontend skills', 'AWS & Servers', 'REST APIs'],
    },
    {
        keywords: ['laravel', 'php', 'inertia', 'filament', 'backend'],
        response: () =>
            `${profile.name} is highly skilled in **PHP** and the **Laravel** ecosystem — including **Filament** for admin panels and **Inertia.js** for full-stack SPA development. He has used these professionally at both NetlinkVoice and Classify Inc.`,
        suggestions: ['Frontend skills', 'AWS & Servers', 'REST APIs', 'Experience'],
    },
    {
        keywords: ['react', 'vue', 'javascript', 'typescript', 'frontend', 'front-end', 'ui', 'tailwind'],
        response: () =>
            `${profile.name} works with modern frontend technologies including **React.js**, **Vue.js**, **TypeScript**, **Tailwind CSS**, **Alpine.js**, **Bootstrap**, **Material UI**, and **Ant Design**. He also has experience with **UI/UX design** and wireframing in Figma.`,
        suggestions: ['Laravel & PHP', 'Design tools', 'Databases', 'Experience'],
    },
    {
        keywords: ['aws', 'cloud', 'server', 'ubuntu', 'hosting', 'devops', 'deploy'],
        response: () =>
            `${profile.name} has hands-on experience with **AWS cloud services** and managing **Ubuntu 20.04** virtual hosting environments. He has handled server configuration, deployment pipelines, and ensuring scalable, reliable infrastructure.`,
        suggestions: ['REST APIs', 'Experience at NetlinkVoice', 'Skills', 'Contact'],
    },
    {
        keywords: ['api', 'rest', 'stripe', 'payment', 'google maps', 'integration', 'third-party'],
        response: () =>
            `${profile.name} has extensive experience building and integrating **REST APIs**. He has integrated third-party services like **Stripe** (payment processing) and **Google Maps** (location services), as well as creating APIs that connect with mobile apps and web interfaces.`,
        suggestions: ['Laravel & PHP', 'Frontend skills', 'Experience', 'Skills'],
    },
    {
        keywords: ['database', 'mysql', 'postgresql', 'firebase', 'db'],
        response: () =>
            `${profile.name} works with the following databases: **${skills.databases.join(', ')}**.`,
        suggestions: ['Laravel & PHP', 'REST APIs', 'Skills', 'Experience'],
    },
    {
        keywords: ['figma', 'design', 'wireframe', 'photoshop', 'illustrator', 'graphic'],
        response: () =>
            `${profile.name} is comfortable with design tools including **Figma** (wireframes & UI design), **Photoshop**, and **Illustrator**. He creates application wireframes to align with business requirements before development.`,
        suggestions: ['Frontend skills', 'Skills', 'Experience', 'About Patrick'],
    },
    {
        keywords: ['experience', 'work', 'job', 'career', 'company', 'employ', 'history', 'position', 'role'],
        response: () => {
            const lines = experience.map(
                (e) =>
                    `**${e.role} @ ${e.company}** (${e.period})\n` +
                    e.bullets.map((b) => `• ${b}`).join('\n'),
            );
            return `Here is ${profile.name}'s work experience:\n\n${lines.join('\n\n')}`;
        },
        suggestions: ['Experience at NetlinkVoice', 'Experience at Classify Inc', 'Skills', 'Education'],
    },
    {
        keywords: ['netlinkvoice', 'netlink'],
        response: () => {
            const job = experience[0];
            return (
                `**${job.role} @ ${job.company}** (${job.period})\n\n` +
                job.bullets.map((b) => `• ${b}`).join('\n')
            );
        },
        suggestions: ['Experience at Classify Inc', 'Skills', 'AWS & Servers', 'Contact'],
    },
    {
        keywords: ['classify'],
        response: () => {
            const job = experience[1];
            return (
                `**${job.role} @ ${job.company}** (${job.period})\n\n` +
                job.bullets.map((b) => `• ${b}`).join('\n')
            );
        },
        suggestions: ['Experience at NetlinkVoice', 'Skills', 'Education', 'Contact'],
    },
    {
        keywords: ['education', 'school', 'university', 'college', 'degree', 'study', 'studied', 'graduate', 'course'],
        response: () => {
            const lines = education.map(
                (e) =>
                    `**${e.degree}**\n${e.school} (${e.period})\n` +
                    e.details.map((d) => `• ${d}`).join('\n'),
            );
            return `${profile.name}'s educational background:\n\n${lines.join('\n\n')}`;
        },
        suggestions: ['Experience', 'Skills', 'About Patrick', 'Contact'],
    },
    {
        keywords: ['contact', 'email', 'phone', 'reach', 'message', 'touch', 'call'],
        response: () =>
            `You can reach ${profile.name} through:\n\n📧 **Email:** ${contact.email}\n📱 **Phone:** ${contact.phone}\n\nOr use the **Contact** form on this portfolio!`,
        suggestions: ['Available for hire?', 'Skills', 'Experience', 'About Patrick'],
    },
    {
        keywords: ['hire', 'available', 'freelance', 'open', 'opportunity', 'work together', 'collaborate', 'project'],
        response: () =>
            `${profile.name} is open to new opportunities and collaborations! Whether it's a full-time role, freelance project, or consulting — feel free to reach out:\n\n📧 ${contact.email}\n📱 ${contact.phone}`,
        suggestions: ['Contact', 'Skills', 'Experience', 'About Patrick'],
    },
    {
        keywords: ['year', 'how long', 'years of'],
        response: () =>
            `${profile.name} has **4+ years** of professional software development experience, starting at Classify Inc in 2022 and currently working at NetlinkVoice since 2023.`,
        suggestions: ['Experience', 'Skills', 'Education', 'Contact'],
    },
    {
        keywords: ['git', 'version control', 'flutterflow', 'laragon', 'tool'],
        response: () =>
            `${profile.name} uses tools like **Git** for version control, **Laragon** for local development, and **FlutterFlow** for mobile app prototyping.`,
        suggestions: ['Skills', 'AWS & Servers', 'Experience', 'Contact'],
    },
];

const FALLBACK_SUGGESTIONS = ['Skills', 'Experience', 'Education', 'Contact'];

export function getReply(message: string): BotReply {
    const normalized = message.toLowerCase().trim();

    for (const rule of rules) {
        if (rule.keywords.some((kw) => normalized.includes(kw))) {
            return { reply: rule.response(), suggestions: rule.suggestions };
        }
    }

    return {
        reply: `I'm not sure about that, but I can tell you about ${profile.name}'s **skills**, **experience**, **education**, or **contact** info. Try asking something like:\n\n• "What are your skills?"\n• "Tell me about your experience"\n• "How can I contact you?"`,
        suggestions: FALLBACK_SUGGESTIONS,
    };
}
