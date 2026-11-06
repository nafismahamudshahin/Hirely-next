"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import hirelyLogo from "@/public/images/hirelylogo2.png";

const links = [
    { label: "Browse Jobs", href: "#jobs" },
    { label: "Company", href: "#company" },
    { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        const onResize = () => window.innerWidth >= 768 && setOpen(false);
        window.addEventListener("keydown", onKey);
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("resize", onResize);
        };
    }, [open]);

    const close = () => setOpen(false);

    return (
        <header className="sticky top-0 z-50 bg-[#050507]/80 px-4 pt-4 backdrop-blur-md sm:px-6">
            <nav
                aria-label="Main"
                className="relative mx-auto w-full max-w-[1180px] rounded-xl border border-white/[0.07] bg-[#0d0d11]/95 backdrop-blur-xl"
            >
                <div className="flex h-14 items-center justify-between px-4 sm:px-5">
                    <Link href="/" onClick={close} aria-label="Hirely home" className="flex items-center">
                        <Image
                            src={hirelyLogo}
                            alt="Hirely logo"
                            priority
                            className="w-auto sm:h-6 h-5"
                        />
                    </Link>

                    {/* Desktop */}
                    <div className="hidden items-center gap-6 md:flex">
                        <ul className="flex items-center gap-6">
                            {links.map((l) => (
                                <li key={l.label}>
                                    <Link
                                        href={l.href}
                                        className="text-xs text-white/80 transition-colors hover:text-white"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <span aria-hidden="true" className="h-4 w-px bg-white/15" />
                        <Link
                            href="/login"
                            className="text-xs font-medium text-[#7a73ff] transition-colors hover:text-[#948fff]"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            className="inline-flex h-9 items-center justify-center rounded-lg bg-[#5b4bff] px-4 text-xs font-semibold text-white shadow-[0_6px_24px_rgba(91,75,255,0.35)] transition-colors hover:bg-[#6d5eff]"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        type="button"
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        onClick={() => setOpen((v) => !v)}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/80 transition-colors hover:bg-white/10 md:hidden"
                    >
                        {open ? (
                            <X aria-hidden="true" className="h-4 w-4" />
                        ) : (
                            <Menu aria-hidden="true" className="h-4 w-4" />
                        )}
                    </button>
                </div>

                {/* Mobile panel */}
                <div
                    id="mobile-menu"
                    className={`grid transition-[grid-template-rows] duration-200 ease-out md:hidden ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                >
                    <div className="overflow-hidden">
                        <div
                            className={`border-t border-white/[0.07] px-4 pb-4 pt-2 ${open ? "" : "invisible"
                                }`}
                        >
                            <ul className="flex flex-col">
                                {links.map((l) => (
                                    <li key={l.label}>
                                        <Link
                                            href={l.href}
                                            onClick={close}
                                            className="flex h-11 items-center rounded-lg px-2 text-sm text-white/80 transition-colors hover:bg-white/[0.05] hover:text-white"
                                        >
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/[0.07] pt-4">
                                <Link
                                    href="/login"
                                    onClick={close}
                                    className="inline-flex h-11 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-sm font-medium text-[#948fff] transition-colors hover:bg-white/[0.09]"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    onClick={close}
                                    className="inline-flex h-11 items-center justify-center rounded-lg bg-[#5b4bff] text-sm font-semibold text-white transition-colors hover:bg-[#6d5eff]"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}