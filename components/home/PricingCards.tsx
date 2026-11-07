"use client";

import { useState } from "react";
import { ArrowRight, BarChart3, Crown, Plus, Zap } from "lucide-react";

const plans = [
    {
        name: "Starter",
        Icon: Crown,
        monthlyPrice: "$0",
        yearlyPrice: "$0",
        features: [
            "Daily AI match brief (top 5)",
            "Verified salary bands",
            "Company insight dashboards",
            "1-click apply, unlimited",
        ],
        featured: false,
    },
    {
        name: "Growth",
        Icon: BarChart3,
        monthlyPrice: "$17",
        yearlyPrice: "$170",
        features: [
            "Daily AI match brief (top 5)",
            "Verified salary bands",
            "Company insight dashboards",
            "1-click apply, unlimited",
        ],
        featured: true,
    },
    {
        name: "Premium",
        Icon: Zap,
        monthlyPrice: "$99",
        yearlyPrice: "$990",
        features: [
            "Everything in Pro",
            "Multi-profile career portfolios",
            "Shared talent rooms",
            "Recruiter view (read-only)",
        ],
        featured: false,
    },
];

function PricingLabel({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-2 text-[10px] font-medium tracking-[0.28em] text-white/55">
            <span aria-hidden="true" className="size-1.5 bg-[#5b4bff]" />
            {children}
            <span aria-hidden="true" className="size-1.5 bg-[#5b4bff]" />
        </span>
    );
}

export default function PricingCards() {
    const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

    return (
        <section className="bg-black px-5 py-20 text-white sm:px-8 sm:py-24">
            <div className="mx-auto max-w-[1180px]">
                <div className="flex flex-col items-center text-center">
                    <PricingLabel>PRICING</PricingLabel>

                    <h2 className="mt-5 max-w-xl text-balance text-[30px] font-medium leading-[1.12] tracking-tight sm:text-[42px]">
                        Pay for the leverage,
                        <br />
                        not the listings
                    </h2>

                    <div
                        className="mt-10 inline-flex items-center rounded-full bg-[#17171b] p-1"
                        role="group"
                        aria-label="Billing frequency"
                    >
                        <button
                            type="button"
                            aria-pressed={billing === "monthly"}
                            onClick={() => setBilling("monthly")}
                            className={`h-9 rounded-full px-5 text-sm font-medium transition-colors ${
                                billing === "monthly"
                                    ? "bg-white text-black"
                                    : "text-white/65 hover:text-white"
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            type="button"
                            aria-pressed={billing === "yearly"}
                            onClick={() => setBilling("yearly")}
                            className={`flex h-9 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors ${
                                billing === "yearly"
                                    ? "bg-white text-black"
                                    : "text-white/65 hover:text-white"
                            }`}
                        >
                            Yearly
                            <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                    billing === "yearly"
                                        ? "bg-[#e52eff] text-white"
                                        : "bg-[#e52eff] text-white"
                                }`}
                            >
                                25%
                            </span>
                        </button>
                    </div>
                </div>

                <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
                    {plans.map((plan) => (
                        <article
                            key={plan.name}
                            className={`flex min-h-[445px] flex-col rounded-2xl border p-6 text-left shadow-[0_20px_50px_rgba(0,0,0,0.25)] sm:p-7 ${
                                plan.featured
                                    ? "border-white/15 bg-gradient-to-b from-[#24242a] to-[#101013]"
                                    : "border-white/10 bg-[#111114]"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={`inline-flex size-9 items-center justify-center rounded-lg ${
                                        plan.featured
                                            ? "bg-[#5b4bff] text-white"
                                            : "border border-white/10 bg-white/[0.04] text-[#7a73ff]"
                                    }`}
                                >
                                    <plan.Icon aria-hidden="true" className="h-4 w-4" />
                                </span>
                                <h3 className="text-lg font-medium">{plan.name}</h3>
                                <p className="ml-auto whitespace-nowrap">
                                    <span className="text-3xl font-semibold tracking-tight">
                                        {billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                                    </span>
                                    <span className="text-xs text-white/45">
                                        /{billing === "monthly" ? "month" : "year"}
                                    </span>
                                </p>
                            </div>

                            <div className="mt-7 border-t border-white/10 pt-6">
                                <p className="text-sm font-medium text-white">
                                    Start building your insights hub:
                                </p>
                                <ul className="mt-5 space-y-3.5">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3 text-sm text-white/55">
                                            <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04]">
                                                <Plus aria-hidden="true" className="h-3 w-3 text-white/80" />
                                            </span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <a
                                href="#pricing"
                                className={`mt-auto flex h-11 items-center justify-between rounded-lg px-5 text-sm font-medium transition-colors ${
                                    plan.featured
                                        ? "bg-white text-black hover:bg-white/90"
                                        : "border border-white/10 bg-[#1b1b20] text-white hover:bg-[#25252b]"
                                }`}
                            >
                                Choose This Plan
                                <ArrowRight aria-hidden="true" className="h-4 w-4" />
                            </a>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
