'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
    id: number;
    from: 'user' | 'bot';
    text: string;
    suggestions?: string[];
}

const INITIAL_SUGGESTIONS = ['About Patrick', 'Skills', 'Experience', 'Education', 'Contact'];

let nextId = 1;

function parseMarkdown(text: string): string {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br />');
}

export function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: nextId++,
            from: 'bot',
            text: "Hi! 👋 I'm Patrick's assistant. Ask me anything about his background, skills, or how to get in touch!",
            suggestions: INITIAL_SUGGESTIONS,
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open, messages]);

    async function sendMessage(text: string) {
        const trimmed = text.trim();
        if (!trimmed || isTyping) return;

        // Add user message, strip suggestions from all previous bot messages
        setMessages((prev) =>
            prev
                .map((m) => (m.from === 'bot' ? { ...m, suggestions: undefined } : m))
                .concat({ id: nextId++, from: 'user', text: trimmed }),
        );
        setInput('');
        setIsTyping(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: trimmed }),
            });
            const data = await res.json() as { reply?: string; suggestions?: string[]; error?: string };
            const reply = data.reply ?? "Sorry, I couldn't process that. Try asking about skills or experience!";
            const suggestions = data.suggestions ?? [];

            await new Promise((r) => setTimeout(r, 600));
            setMessages((prev) => [...prev, { id: nextId++, from: 'bot', text: reply, suggestions }]);
        } catch {
            await new Promise((r) => setTimeout(r, 400));
            setMessages((prev) => [
                ...prev,
                {
                    id: nextId++,
                    from: 'bot',
                    text: 'Oops! Something went wrong. Please try again.',
                    suggestions: ['Skills', 'Experience', 'Contact'],
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        sendMessage(input);
    }

    // Index of the last bot message (for showing suggestions)
    const lastBotIndex = messages.reduce<number>(
        (acc, msg, i) => (msg.from === 'bot' ? i : acc),
        -1,
    );

    return (
        <>
            {/* Floating toggle button */}
            <button
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Close chat' : 'Open chat'}
                className={cn(
                    'fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full shadow-lg transition-all duration-300',
                    'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                )}
            >
                {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
            </button>

            {/* Chat panel */}
            <div
                className={cn(
                    'fixed bottom-24 right-6 z-50 flex w-[340px] flex-col rounded-2xl border border-border bg-background shadow-2xl transition-all duration-300 origin-bottom-right',
                    open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none',
                )}
                style={{ maxHeight: '520px' }}
                aria-hidden={!open}
            >
                {/* Header */}
                <div className="flex items-center gap-3 rounded-t-2xl bg-primary px-4 py-3 text-primary-foreground">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary-foreground/20">
                        <MessageCircle className="size-4" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold leading-none">Patrick's Assistant</p>
                        <p className="mt-0.5 text-xs text-primary-foreground/70">Ask me anything!</p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" style={{ minHeight: 0 }}>
                    {messages.map((msg, index) => (
                        <div
                            key={msg.id}
                            className={cn(
                                'flex flex-col gap-2',
                                msg.from === 'user' ? 'items-end' : 'items-start',
                            )}
                        >
                            {/* Bubble */}
                            <div
                                className={cn(
                                    'max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                                    msg.from === 'user'
                                        ? 'rounded-tr-sm bg-primary text-primary-foreground'
                                        : 'rounded-tl-sm bg-muted text-foreground',
                                )}
                                dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
                            />

                            {/* Follow-up suggestion chips — only on the last bot message and not while typing */}
                            {msg.from === 'bot' &&
                                index === lastBotIndex &&
                                !isTyping &&
                                msg.suggestions &&
                                msg.suggestions.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                                        {msg.suggestions.map((label) => (
                                            <button
                                                key={label}
                                                onClick={() => sendMessage(label)}
                                                className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted active:scale-95"
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="self-start">
                            <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted px-3 py-2.5">
                                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
                                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
                                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-2 border-t border-border px-3 py-3"
                >
                    <Input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about skills, experience…"
                        className="h-9 flex-1 text-sm"
                        disabled={isTyping}
                        autoComplete="off"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || isTyping}
                        className="size-9 shrink-0"
                        aria-label="Send"
                    >
                        <Send className="size-4" />
                    </Button>
                </form>
            </div>
        </>
    );
}
