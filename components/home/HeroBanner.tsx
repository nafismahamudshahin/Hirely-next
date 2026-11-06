// components/hero.tsx
"use client";
import { Briefcase, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const trending = ["Product Designer", "AI Engineering", "Dev-ops Engineer"];

export default function HeroBanner() {
    return (
        <section className="relative isolate w-full overflow-hidden bg-[#050507] text-white">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(91,75,255,0.12)_0%,rgba(5,5,7,0)_42%,#050507_82%)]"
            />

            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 opacity-60"
                style={{
                    backgroundImage:
                        "radial-gradient(1px 1px at 20% 30%, #8b8bff 50%, transparent 51%), radial-gradient(1px 1px at 70% 20%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 85% 55%, #8b8bff 50%, transparent 51%), radial-gradient(1px 1px at 12% 62%, #fff 50%, transparent 51%), radial-gradient(1.5px 1.5px at 45% 45%, #a5a5ff 50%, transparent 51%), radial-gradient(1px 1px at 60% 70%, #fff 50%, transparent 51%)",
                    backgroundSize: "340px 340px",
                }}
            />

            {/* No min-height: the globe/stats section follows directly below */}
            <div className="mx-auto flex w-full max-w-[1180px] flex-col px-4 pt-4 sm:px-6">
                <div className="relative z-10 mt-10 flex flex-col items-center text-center sm:mt-14 lg:mt-16">
                    <div className="flex w-full items-center justify-center gap-3">
                        <span className="hidden h-px w-16 bg-gradient-to-r from-transparent to-white/25 sm:block md:w-24" />
                        <Badge
                            variant="outline"
                            className="gap-2 rounded-full border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-medium tracking-wide text-white/80"
                        >
                            <Briefcase className="h-3 w-3 text-orange-400" />
                            <span className="font-mono">50,000+</span>
                            <span className="uppercase text-white/60">New jobs this month</span>
                        </Badge>
                        <span className="hidden h-px w-16 bg-gradient-to-l from-transparent to-white/25 sm:block md:w-24" />
                    </div>

                    <h1 className="mt-6 max-w-4xl text-balance text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] sm:mt-7 sm:text-5xl md:text-6xl lg:text-[52px]">
                        Find Your Dream Job <span className="text-white">Today</span>
                    </h1>

                    <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
                        Hirely connects top talent with world-class companies. Browse thousands of
                        curated opportunities and land your next role — faster.
                    </p>

                    <form
                        onSubmit={(e) => e.preventDefault()}
                        role="search"
                        className="mt-7 flex w-full max-w-[625px] flex-col gap-1.5 rounded-xl border border-white/10 bg-[#111115]/90 p-2 shadow-[0_16px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:flex-row sm:items-center sm:gap-0"
                    >
                        <label className="flex min-h-11 flex-1 items-center gap-3 rounded-lg px-3 sm:min-h-12 sm:py-0">
                            <Search aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-white/50" />
                            <input
                                type="text"
                                placeholder="Job title, skill or company"
                                aria-label="Job title, skill or company"
                                className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                            />
                        </label>

                        <span aria-hidden="true" className="mx-2 hidden h-7 w-px bg-white/10 sm:block" />

                        <label className="flex min-h-11 flex-1 items-center gap-3 rounded-lg px-3 sm:min-h-12 sm:py-0">
                            <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-white/50" />
                            <input
                                type="text"
                                placeholder="Location or Remote"
                                aria-label="Location or remote"
                                className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                            />
                        </label>

                        <Button
                            type="submit"
                            className="h-11 w-full shrink-0 rounded-lg bg-[#5b4bff] px-4 text-sm font-semibold shadow-[0_6px_24px_rgba(91,75,255,0.35)] hover:bg-[#6d5eff] sm:h-11 sm:w-auto"
                        >
                            <Search aria-hidden="true" className="h-4 w-4" />
                            <span className="sr-only">Search jobs</span>
                        </Button>
                    </form>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                        <span className="mr-1 text-xs text-white/45">Trending Position</span>
                        {trending.map((t) => (
                            <Badge
                                key={t}
                                variant="outline"
                                className="cursor-pointer rounded-full border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-normal text-white/70 transition-colors hover:bg-white/10 sm:text-xs"
                            >
                                {t}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}