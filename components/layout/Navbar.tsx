"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Bookmark,
    BriefcaseBusiness,
    ChevronRight,
    FileText,
    LayoutDashboard,
    LogOut,
    Menu,
    PlusCircle,
    UserRound,
    UsersRound,
    X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import hirelyLogo from "@/public/images/hirelylogo2.png";
import { signOut, useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
    { label: "Browse Jobs", href: "#jobs" },
    { label: "Company", href: "#company" },
    { label: "Pricing", href: "#pricing" },
];

type MenuItem = { label: string; href: string; Icon: LucideIcon };

const profileItem: MenuItem = { label: "User Profile", href: "/profile", Icon: UserRound };

// Adjust the hrefs to your real routes.
function menuFor(role?: string): MenuItem[] {
    switch (role) {
        case "recruiter":
            return [
                profileItem,
                { label: "Post a Job", href: "/dashboard/jobs/new", Icon: PlusCircle },
                { label: "Manage Jobs", href: "/dashboard/jobs", Icon: BriefcaseBusiness },
                { label: "Applicants", href: "/dashboard/applicants", Icon: UsersRound },
            ];
        case "admin":
            return [
                profileItem,
                { label: "Admin Dashboard", href: "/admin", Icon: LayoutDashboard },
                { label: "Manage Users", href: "/admin/users", Icon: UsersRound },
            ];
        default: // seeker
            return [
                profileItem,
                { label: "Saved Jobs", href: "/saved-jobs", Icon: Bookmark },
                { label: "My Applications", href: "/applications", Icon: FileText },
            ];
    }
}

function roleLabel(role?: string | null) {
    if (role === "recruiter") return "Recruiter";
    if (role === "admin") return "Admin";
    return "Job Seeker";
}

function getInitials(name?: string | null, email?: string | null) {
    const source = (name?.trim() || email?.split("@")[0] || "?").trim();
    const parts = source.split(/\s+/).filter(Boolean);
    const letters =
        parts.length > 1 ? parts[0][0] + parts[1][0] : source.replace(/[^\p{L}\p{N}]/gu, "").slice(0, 2);
    return (letters || "?").toUpperCase();
}

type SessionUser = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
};

function UserAvatar({ user, className = "size-9" }: { user: SessionUser; className?: string }) {
    return (
        <Avatar className={`${className} border border-white/15`}>
            {user.image && <AvatarImage src={user.image} alt={user.name ?? "Profile"} />}
            <AvatarFallback className="bg-[#5b4bff]/25 text-xs font-semibold text-white">
                {getInitials(user.name, user.email)}
            </AvatarFallback>
        </Avatar>
    );
}

/** Desktop avatar + dropdown. (Base UI dropdowns render their own <button>, so no asChild.) */
function UserMenu({ user, onSignOut }: { user: SessionUser; onSignOut: () => void }) {
    const items = menuFor(user.role ?? undefined);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                aria-label="Open account menu"
                className="rounded-full outline-none ring-offset-2 ring-offset-[#0d0d11] transition-shadow focus-visible:ring-2 focus-visible:ring-[#5b4bff] data-[popup-open]:ring-2 data-[popup-open]:ring-[#5b4bff]/60"
            >
                <UserAvatar user={user} />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="w-64 rounded-xl border border-white/10 bg-[#0d0d11] p-0 text-white shadow-[0_16px_60px_rgba(0,0,0,0.55)]"
            >
                <div className="px-4 py-3.5">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="mt-0.5 truncate text-xs text-white/50">{user.email}</p>
                </div>
                <DropdownMenuSeparator className="m-0 bg-white/10" />

                <div className="p-1.5">
                    {items.map(({ label, href, Icon }) => (
                        <DropdownMenuItem
                            key={label}
                            render={<Link href={href} />}
                            className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-sm text-white/80 focus:bg-white/[0.07] focus:text-white data-[highlighted]:bg-white/[0.07] data-[highlighted]:text-white"
                        >
                            <Icon aria-hidden="true" className="h-4 w-4 text-white/60" />
                            {label}
                        </DropdownMenuItem>
                    ))}
                </div>

                <DropdownMenuSeparator className="m-0 bg-white/10" />
                <div className="p-1.5">
                    <DropdownMenuItem
                        onClick={onSignOut}
                        className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 focus:bg-red-500/10 focus:text-red-300 data-[highlighted]:bg-red-500/10 data-[highlighted]:text-red-300"
                    >
                        <LogOut aria-hidden="true" className="h-4 w-4" />
                        Log out
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/** Mobile: profile card + account links, shown inside the hamburger panel. */
function MobileAccount({
    user,
    onNavigate,
    onSignOut,
}: {
    user: SessionUser;
    onNavigate: () => void;
    onSignOut: () => void;
}) {
    const items = menuFor(user.role ?? undefined);

    return (
        <div className="space-y-3 pb-2 pt-2">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#5b4bff]/30 via-[#15151b] to-[#0d0d11] p-4">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-8 -top-10 size-32 rounded-full bg-[#5b4bff]/30 blur-3xl"
                />
                <div className="relative flex items-center gap-3.5">
                    <UserAvatar user={user} className="size-14 ring-2 ring-[#5b4bff]/60 ring-offset-2 ring-offset-[#0d0d11]" />
                    <div className="min-w-0">
                        <p className="truncate text-base font-semibold leading-tight text-white">
                            {user.name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-white/55">{user.email}</p>
                        <span className="mt-2 inline-flex items-center rounded-full border border-[#5b4bff]/40 bg-[#5b4bff]/15 px-2.5 py-0.5 text-[10px] font-medium text-[#b4afff]">
                            {roleLabel(user.role)}
                        </span>
                    </div>
                </div>
            </div>

            <ul className="flex flex-col gap-1">
                {items.map(({ label, href, Icon }) => (
                    <li key={label}>
                        <Link
                            href={href}
                            onClick={onNavigate}
                            className="group flex h-12 items-center gap-3 rounded-xl px-2.5 text-sm text-white/85 transition-colors hover:bg-white/[0.06] hover:text-white"
                        >
                            <span className="inline-flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-[#8f88ff]">
                                <Icon aria-hidden="true" className="h-4 w-4" />
                            </span>
                            <span className="flex-1">{label}</span>
                            <ChevronRight
                                aria-hidden="true"
                                className="h-4 w-4 text-white/30 transition-transform group-hover:translate-x-0.5"
                            />
                        </Link>
                    </li>
                ))}
            </ul>

            <button
                type="button"
                onClick={onSignOut}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/15"
            >
                <LogOut aria-hidden="true" className="h-4 w-4" />
                Log out
            </button>
        </div>
    );
}

export default function Navbar() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { data: session, isPending } = useSession();
    const user = session?.user as SessionUser | undefined;

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

    async function handleSignOut() {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    close();
                    router.push("/");
                    router.refresh();
                },
            },
        });
    }

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
                            className="h-5 w-auto sm:h-6"
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

                        {isPending ? (
                            <span aria-hidden="true" className="size-9 animate-pulse rounded-full bg-white/10" />
                        ) : user ? (
                            <UserMenu user={user} onSignOut={handleSignOut} />
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>

                    {/* Mobile toggle (no avatar here; account lives inside the panel) */}
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
                            className={`max-h-[calc(100svh-6rem)] overflow-y-auto border-t border-white/[0.07] px-4 pb-4 pt-2 ${open ? "" : "invisible"
                                }`}
                        >
                            {!isPending && user && (
                                <MobileAccount user={user} onNavigate={close} onSignOut={handleSignOut} />
                            )}

                            <ul
                                className={`flex flex-col ${user ? "border-t border-white/[0.07] pt-2" : ""
                                    }`}
                            >
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

                            {!isPending && !user && (
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
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}