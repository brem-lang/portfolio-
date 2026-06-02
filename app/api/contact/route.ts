import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ContactBody {
    name?: unknown;
    email?: unknown;
    phone?: unknown;
    message?: unknown;
}

type ValidationErrors = Record<string, string>;

function validate(body: ContactBody): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
        errors.name = 'Name is required.';
    } else if (body.name.trim().length > 120) {
        errors.name = 'Name must not exceed 120 characters.';
    }

    if (!body.email || typeof body.email !== 'string' || body.email.trim().length === 0) {
        errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
        errors.email = 'Please enter a valid email address.';
    } else if (body.email.trim().length > 254) {
        errors.email = 'Email must not exceed 254 characters.';
    }

    if (body.phone !== undefined && body.phone !== null && body.phone !== '') {
        if (typeof body.phone === 'string' && body.phone.trim().length > 40) {
            errors.phone = 'Phone must not exceed 40 characters.';
        }
    }

    if (!body.message || typeof body.message !== 'string' || body.message.trim().length === 0) {
        errors.message = 'Message is required.';
    } else if (body.message.trim().length > 5000) {
        errors.message = 'Message must not exceed 5000 characters.';
    }

    return errors;
}

export async function POST(request: Request) {
    let body: ContactBody;

    try {
        body = (await request.json()) as ContactBody;
    } catch {
        return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
    }

    const errors = validate(body);

    if (Object.keys(errors).length > 0) {
        return NextResponse.json({ errors }, { status: 422 });
    }

    const name = (body.name as string).trim();
    const email = (body.email as string).trim();
    const phone = body.phone && typeof body.phone === 'string' ? body.phone.trim() : null;
    const message = (body.message as string).trim();

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT ?? 587),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"${name}" <${process.env.SMTP_FROM}>`,
            replyTo: email,
            to: process.env.CONTACT_TO_EMAIL,
            subject: `Portfolio contact from ${name}`,
            text: [
                `Name: ${name}`,
                `Email: ${email}`,
                phone ? `Phone: ${phone}` : '',
                '',
                message,
            ]
                .filter(Boolean)
                .join('\n'),
            html: `
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                <hr />
                <p>${message.replace(/\n/g, '<br />')}</p>
            `,
        });

        return NextResponse.json({
            message: "Thanks for reaching out — I'll be in touch soon.",
        });
    } catch (error) {
        console.error('Contact form email error:', error);

        return NextResponse.json(
            { message: 'Failed to send message. Please try again later.' },
            { status: 500 },
        );
    }
}
