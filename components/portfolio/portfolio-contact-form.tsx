'use client';

import { CheckCircle2 } from 'lucide-react';
import type { FC } from 'react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type FormFields = {
    name: string;
    email: string;
    phone: string;
    message: string;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

const emptyFields: FormFields = { name: '', email: '', phone: '', message: '' };

export const PortfolioContactForm: FC = () => {
    const [fields, setFields] = useState<FormFields>(emptyFields);
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, setProcessing] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFields((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setSuccessMessage(null);
        setErrorMessage(null);
        setErrors({});

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fields),
            });

            const data = (await res.json()) as {
                message?: string;
                errors?: FormErrors;
            };

            if (res.status === 422 && data.errors) {
                setErrors(data.errors);
            } else if (!res.ok) {
                setErrorMessage(data.message ?? 'Something went wrong. Please try again.');
            } else {
                setSuccessMessage(data.message ?? 'Message sent!');
                setFields(emptyFields);
            }
        } catch {
            setErrorMessage('Could not reach the server. Please try again later.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-4">
            {successMessage ? (
                <Alert className="border-primary/35 bg-primary/5">
                    <CheckCircle2 aria-hidden className="text-primary max-sm:col-start-1" />
                    <AlertTitle>Sent</AlertTitle>
                    <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
            ) : null}

            {errorMessage ? (
                <Alert variant="destructive">
                    <AlertTitle>Could not send</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="portfolio-contact-name">Name</Label>
                        <Input
                            id="portfolio-contact-name"
                            name="name"
                            autoComplete="name"
                            placeholder="Ada Lovelace"
                            required
                            value={fields.name}
                            onChange={handleChange}
                            aria-invalid={errors.name ? 'true' : undefined}
                            className={cn(errors.name && 'aria-invalid:border-destructive')}
                        />
                        <InputError message={errors.name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="portfolio-contact-email">Email</Label>
                        <Input
                            id="portfolio-contact-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="hello@company.com"
                            required
                            value={fields.email}
                            onChange={handleChange}
                            aria-invalid={errors.email ? 'true' : undefined}
                            className={cn(errors.email && 'aria-invalid:border-destructive')}
                        />
                        <InputError message={errors.email} />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="portfolio-contact-phone">
                        Phone{' '}
                        <span className="font-normal text-muted-foreground">(optional)</span>
                    </Label>
                    <Input
                        id="portfolio-contact-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+63 ..."
                        value={fields.phone}
                        onChange={handleChange}
                        aria-invalid={errors.phone ? 'true' : undefined}
                        className={cn(
                            errors.phone && 'aria-invalid:border-destructive',
                            'sm:max-w-md',
                        )}
                    />
                    <InputError message={errors.phone} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="portfolio-contact-message">Message</Label>
                    <textarea
                        id="portfolio-contact-message"
                        name="message"
                        placeholder="Briefly describe what you are looking for…"
                        required
                        rows={5}
                        value={fields.message}
                        onChange={handleChange}
                        aria-invalid={errors.message ? 'true' : undefined}
                        data-slot="input"
                        className={cn(
                            'flex min-h-30 w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground md:text-sm',
                            'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                            'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                            'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
                            errors.message && 'aria-invalid:border-destructive',
                        )}
                    />
                    <InputError message={errors.message} />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        type="submit"
                        disabled={processing}
                        data-test="portfolio-contact-send"
                        className="shrink-0"
                    >
                        {processing ? 'Sending…' : 'Send message'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
