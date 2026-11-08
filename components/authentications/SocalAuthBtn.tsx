"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

type Provider = "google" | "github";

const providers: { id: Provider; label: string; icon: React.ReactNode }[] = [
    {
        id: "google",
        label: "Google",
        icon: (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
                <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
                />
                <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
                />
                <path
                    fill="#FBBC05"
                    d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
                />
                <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
                />
            </svg>
        ),
    },
    {
        id: "github",
        label: "GitHub",
        icon: (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
        ),
    },
];

type Props = {
    /** Same-site path to land on after signing in. */
    callbackURL?: string;
    /** Same-site path for brand-new users (e.g. an onboarding page). */
    newUserCallbackURL?: string;
    disabled?: boolean;
    /** Shown under the buttons when disabled. */
    disabledReason?: string;
};

export default function SocialAuthButtons({
    callbackURL = "/",
    newUserCallbackURL,
    disabled,
    disabledReason,
}: Props) {
    const [loading, setLoading] = useState<Provider | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function start(provider: Provider) {
        setError(null);
        setLoading(provider);
        try {
            // Better Auth redirects the browser to the provider on success.
            const { error } = await signIn.social({
                provider,
                callbackURL,
                newUserCallbackURL,
            });
            if (error) {
                setError(error.message ?? `Couldn't continue with ${provider}. Please try again.`);
                setLoading(null);
            }
        } catch {
            setError("Network error. Check your connection and try again.");
            setLoading(null);
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3" role="separator" aria-label="Or continue with">
                <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
                <span className="text-[11px] uppercase tracking-wider text-white/40">
                    Or continue with
                </span>
                <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {providers.map(({ id, label, icon }) => (
                    <Button
                        key={id}
                        type="button"
                        variant="outline"
                        disabled={disabled || loading !== null}
                        onClick={() => start(id)}
                        className="h-11 gap-2.5 rounded-lg border-white/10 bg-white/[0.04] text-sm font-medium text-white hover:bg-white/10 hover:text-white"
                    >
                        {loading === id ? (
                            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                        ) : (
                            icon
                        )}
                        <span>
                            <span className="sr-only">Continue with </span>
                            {label}
                        </span>
                    </Button>
                ))}
            </div>

            {error && (
                <p role="alert" className="text-center text-xs text-red-400">
                    {error}
                </p>
            )}

            {disabled && disabledReason && (
                <p className="text-center text-[11px] text-white/40">{disabledReason}</p>
            )}
        </div>
    );
}