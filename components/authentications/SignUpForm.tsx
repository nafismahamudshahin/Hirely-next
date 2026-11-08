"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BriefcaseBusiness, Check, Eye, EyeOff, Loader2, ShieldCheck, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { signUp } from "@/lib/auth-client";
import SocialAuthButtons from "./SocalAuthBtn";

const roles = [
    {
        value: "seeker",
        title: "Seeker",
        description: "Find and apply to roles",
        Icon: UserRound,
    },
    {
        value: "recruiter",
        title: "Recruiter",
        description: "Post jobs and hire talent",
        Icon: BriefcaseBusiness,
    },
    {
        value: "admin",
        title: "Admin",
        description: "Manage the platform",
        Icon: ShieldCheck,
    },
] as const;

const schema = z
    .object({
        role: z.enum(["seeker", "recruiter", "admin"]),
        fullName: z.string().trim().min(2, "Enter your full name"),
        email: z.string().trim().email("Enter a valid email address"),
        companyName: z.string().trim().optional(),
        inviteCode: z.string().trim().optional(),
        password: z.string().min(8, "Use at least 8 characters"),
        confirmPassword: z.string(),
        terms: z.boolean().refine((v) => v, "You must accept the terms to continue"),
    })
    .superRefine((d, ctx) => {
        if (d.role === "recruiter" && !d.companyName) {
            ctx.addIssue({ code: "custom", path: ["companyName"], message: "Company name is required" });
        }
        if (d.role === "admin" && !d.inviteCode) {
            ctx.addIssue({ code: "custom", path: ["inviteCode"], message: "Admin invite code is required" });
        }
        if (d.password !== d.confirmPassword) {
            ctx.addIssue({ code: "custom", path: ["confirmPassword"], message: "Passwords do not match" });
        }
    });

type FormValues = z.infer<typeof schema>;

const inputCls =
    "h-11 border-white/10 bg-white/[0.04] text-white placeholder:text-white/35 focus-visible:border-[#5b4bff] focus-visible:ring-[#5b4bff]/30";

function Field({ id, label, error, children, }: {
    id: string;
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-xs font-medium text-white/75">
                {label}
            </Label>
            {children}
            {error && (
                <p id={`${id}-error`} role="alert" className="text-xs text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}

export default function SignupForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const { register, control, handleSubmit, watch, formState: { errors, isSubmitting }, } = useForm<FormValues>(
        {
            resolver: zodResolver(schema),
            defaultValues: {
                role: "seeker",
                fullName: "",
                email: "",
                companyName: "",
                inviteCode: "",
                password: "",
                confirmPassword: "",
                terms: false,
            },
        }
    );

    const role = watch("role");

    async function onSubmit(values: FormValues) {
        setServerError(null);
        console.log(values)
        try {
            const { error } = await signUp.email({
                name: values.fullName,
                email: values.email,
                password: values.password,
                image: "",
                role: values.role,
                company_name: values.role === "recruiter" ? values.companyName : undefined,
                invite_code: values.role === "admin" ? values.inviteCode : undefined,
            });

            if (error) {
                setServerError(error.message ?? "We couldn't create your account. Please try again.");
                return;
            }

            router.push("/login?registered=1");
        } catch {
            setServerError("Network error. Check your connection and try again.");
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Role */}
            <fieldset className="space-y-2">
                <legend className="text-xs font-medium text-white/75">I am a</legend>
                <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="grid gap-2.5 sm:grid-cols-3"
                        >
                            {roles.map(({ value, title, description, Icon }) => {
                                const selected = field.value === value;
                                return (
                                    <Label
                                        key={value}
                                        htmlFor={`role-${value}`}
                                        className={cn(
                                            "relative flex cursor-pointer flex-row items-center gap-3 rounded-xl border p-3 transition-all focus-within:ring-2 focus-within:ring-[#5b4bff]/40 sm:flex-col sm:items-start sm:gap-2.5",
                                            selected
                                                ? "border-[#5b4bff] bg-[#5b4bff]/15 shadow-[0_0_0_1px_#5b4bff,0_8px_24px_rgba(91,75,255,0.25)]"
                                                : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                                        )}
                                    >
                                        <RadioGroupItem id={`role-${value}`} value={value} className="sr-only" />

                                        <span
                                            className={cn(
                                                "inline-flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                                                selected
                                                    ? "border-[#5b4bff] bg-[#5b4bff] text-white"
                                                    : "border-white/10 bg-[#1b1b20] text-[#7a73ff]"
                                            )}
                                        >
                                            <Icon aria-hidden="true" className="h-4 w-4" />
                                        </span>

                                        <span className="block">
                                            <span className="block text-sm font-medium text-white">{title}</span>
                                            <span
                                                className={cn(
                                                    "mt-0.5 block text-[11px] font-normal leading-4",
                                                    selected ? "text-white/70" : "text-white/45"
                                                )}
                                            >
                                                {description}
                                            </span>
                                        </span>

                                        {selected && (
                                            <span
                                                aria-hidden="true"
                                                className="absolute right-2.5 top-2.5 inline-flex size-4 items-center justify-center rounded-full bg-[#5b4bff] text-white"
                                            >
                                                <Check className="h-3 w-3" strokeWidth={3} />
                                            </span>
                                        )}
                                    </Label>
                                );
                            })}
                        </RadioGroup>
                    )}
                />
            </fieldset>

            <Field id="fullName" label="Full name" error={errors.fullName?.message}>
                <Input
                    id="fullName"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? "fullName-error" : undefined}
                    className={inputCls}
                    {...register("fullName")}
                />
            </Field>

            <Field id="email" label="Email" error={errors.email?.message}>
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
            </Field>

            {role === "recruiter" && (
                <Field id="companyName" label="Company name" error={errors.companyName?.message}>
                    <Input
                        id="companyName"
                        autoComplete="organization"
                        placeholder="Acme Inc."
                        aria-invalid={!!errors.companyName}
                        aria-describedby={errors.companyName ? "companyName-error" : undefined}
                        className={inputCls}
                        {...register("companyName")}
                    />
                </Field>
            )}

            {role === "admin" && (
                <Field id="inviteCode" label="Admin invite code" error={errors.inviteCode?.message}>
                    <Input
                        id="inviteCode"
                        autoComplete="off"
                        placeholder="Enter your invite code"
                        aria-invalid={!!errors.inviteCode}
                        aria-describedby={errors.inviteCode ? "inviteCode-error" : undefined}
                        className={inputCls}
                        {...register("inviteCode")}
                    />
                </Field>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
                <Field id="password" label="Password" error={errors.password?.message}>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Min. 8 characters"
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
                </Field>

                <Field id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message}>
                    <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Repeat password"
                        aria-invalid={!!errors.confirmPassword}
                        aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                        className={inputCls}
                        {...register("confirmPassword")}
                    />
                </Field>
            </div>

            <div className="space-y-2">
                <div className="flex items-start gap-3">
                    <Controller
                        name="terms"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                id="terms"
                                checked={field.value}
                                onCheckedChange={(v) => field.onChange(v === true)}
                                aria-invalid={!!errors.terms}
                                className="mt-0.5 border-white/25 data-[state=checked]:border-[#5b4bff] data-[state=checked]:bg-[#5b4bff]"
                            />
                        )}
                    />
                    <Label htmlFor="terms" className="text-xs font-normal leading-5 text-white/55">
                        I agree to the{" "}
                        <Link href="/terms" className="text-[#948fff] hover:underline">
                            Terms &amp; Policy
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-[#948fff] hover:underline">
                            Privacy Guideline
                        </Link>
                        .
                    </Label>
                </div>
                {errors.terms && (
                    <p role="alert" className="text-xs text-red-400">
                        {errors.terms.message}
                    </p>
                )}
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
                {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
            <div>
                <SocialAuthButtons
                    disabled={role === "admin"}
                    disabledReason="Admin accounts can't be created with Google or GitHub."
                />
            </div>
            <p className="text-center text-xs text-white/50">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-[#948fff] hover:underline">
                    Sign in
                </Link>
            </p>
        </form>
    );
}