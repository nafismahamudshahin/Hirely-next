"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import SocialAuthButtons from "./SocalAuthBtn";

const schema = z.object({
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(1, "Enter your password"),
    remember: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const inputCls =
    "h-11 border-white/10 bg-white/[0.04] text-white placeholder:text-white/35 focus-visible:border-[#5b4bff] focus-visible:ring-[#5b4bff]/30";

// Only allow same-site relative redirects (blocks open-redirect via ?next=https://evil.com)
function safeNext(next: string | null) {
    return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export default function LoginForm() {
    const router = useRouter();
    const params = useSearchParams();
    const justRegistered = params.get("registered") === "1";

    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { email: "", password: "", remember: false },
    });

    async function onSubmit(values: FormValues) {
        setServerError(null);
        try {
            const { error } = await signIn.email({
                email: values.email,
                password: values.password,
                rememberMe: values.remember,
            });

            if (error) {
                setServerError(error.message ?? "Incorrect email or password.");
                return;
            }

            router.push(safeNext(params.get("next")));
            router.refresh();
        } catch {
            setServerError("Network error. Check your connection and try again.");
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {justRegistered && (
                <p
                    role="status"
                    className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300"
                >
                    <CheckCircle2 aria-hidden="true" className="mt-px h-4 w-4 shrink-0" />
                    Account created. Sign in to continue.
                </p>
            )}

            <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium text-white/75">
                    Email
                </Label>
                <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={inputCls}
                    {...register("email")}
                />
                {errors.email && (
                    <p id="email-error" role="alert" className="text-xs text-red-400">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-medium text-white/75">
                        Password
                    </Label>
                    <Link
                        href="/forgot-password"
                        className="text-xs text-[#948fff] hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? "password-error" : undefined}
                        className={`${inputCls} pr-10`}
                        {...register("password")}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-1 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-white/50 transition-colors hover:text-white"
                    >
                        {showPassword ? (
                            <EyeOff aria-hidden="true" className="h-4 w-4" />
                        ) : (
                            <Eye aria-hidden="true" className="h-4 w-4" />
                        )}
                    </button>
                </div>
                {errors.password && (
                    <p id="password-error" role="alert" className="text-xs text-red-400">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-3">
                <Controller
                    name="remember"
                    control={control}
                    render={({ field }) => (
                        <Checkbox
                            id="remember"
                            checked={field.value}
                            onCheckedChange={(v) => field.onChange(v === true)}
                            className="border-white/25 data-[state=checked]:border-[#5b4bff] data-[state=checked]:bg-[#5b4bff]"
                        />
                    )}
                />
                <Label htmlFor="remember" className="text-xs font-normal text-white/55">
                    Remember me
                </Label>
            </div>

            {serverError && (
                <p
                    role="alert"
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300"
                >
                    {serverError}
                </p>
            )}

            <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full rounded-lg bg-[#5b4bff] text-sm font-semibold text-white shadow-[0_6px_24px_rgba(91,75,255,0.35)] hover:bg-[#6d5eff]"
            >
                {isSubmitting && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
                {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
            <div>
                <SocialAuthButtons callbackURL={safeNext(params.get("next"))} />
            </div>
            <p className="text-center text-xs text-white/50">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-medium text-[#948fff] hover:underline">
                    Create one
                </Link>
            </p>
        </form>
    );
}