import { NextRequest, NextResponse } from 'next/server';
import { getReply } from '@/lib/chatbot-rules';

export async function POST(req: NextRequest) {
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (
        typeof body !== 'object' ||
        body === null ||
        typeof (body as Record<string, unknown>).message !== 'string'
    ) {
        return NextResponse.json({ error: 'Missing message field' }, { status: 422 });
    }

    const message = ((body as Record<string, string>).message).trim();
    if (!message) {
        return NextResponse.json({ error: 'Message cannot be empty' }, { status: 422 });
    }

    const { reply, suggestions } = getReply(message);
    return NextResponse.json({ reply, suggestions });
}
