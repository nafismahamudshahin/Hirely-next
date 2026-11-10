"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Bookmark,
    BriefcaseBusiness,
    Building2,
    ChevronsUpDown,
    DollarSign,
    FileText,
    Home,
    LayoutDashboard,
    LogOut,
    PlusCircle,
    Settings,
    UserRound,
    UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import hirelyLogo from "@/public/images/hirelylogo2.png";
import { signOut } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";

type DashUser = {
    name: string;
    email: string;
    image?: string | null;
    role?: string | null;
};

type NavItem = { label: string; href: string; Icon: LucideIcon };

// Adjust the hrefs to your real routes.
function navFor(role?: string | null): NavItem[] {
    const overview = { label: "Overview", href: "/dashboard", Icon: LayoutDashboard };
    switch (role) {
        case "recruiter":
            return [
                overview,
                { label: "Manage Jobs", href: "/dashboard/recruiter/jobs/manage-jobs", Icon: BriefcaseBusiness },
                { label: "Post a Job", href: "/dashboard/recruiter/jobs/new", Icon: PlusCircle },
                { label: "Applicants", href: "/dashboard/recruiter/applicants", Icon: UsersRound },
            ];
        case "admin":
            return [
                overview,
                { label: "Users", href: "/dashboard/users", Icon: UsersRound },
                { label: "Companies", href: "/dashboard/admin/companies", Icon: Building2 },
                { label: "Jobs", href: "/dashboard/admin/jobs", Icon: BriefcaseBusiness },
                { label: "Billing", href: "/dashboard/admin/billing", Icon: DollarSign },
            ];
        default: // seeker
            return [
                overview,
                { label: "My Applications", href: "/dashboard/applications", Icon: FileText },
                { label: "Saved Jobs", href: "/dashboard/saved-jobs", Icon: Bookmark },
                { label: "Billing", href: "/dashboard/billing", Icon: DollarSign },
            ];
    }
}

const accountNav: NavItem[] = [{ label: "Settings", href: "/dashboard/settings", Icon: Settings }];

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

function UserAvatar({ user, className = "size-8" }: { user: DashUser; className?: string }) {
    return (
        <Avatar className={`${className} rounded-lg border border-white/15`}>
            {user.image && <AvatarImage src={user.image} alt={user.name} />}
            <AvatarFallback className="rounded-lg bg-[#5b4bff]/25 text-xs font-semibold text-white">
                {getInitials(user.name, user.email)}
            </AvatarFallback>
        </Avatar>
    );
}

function NavUser({ user }: { user: DashUser }) {
    const router = useRouter();
    const { isMobile } = useSidebar();

    async function handleSignOut() {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                    router.refresh();
                },
            },
        });
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <SidebarMenuButton
                                size="lg"
                                className="data-[popup-open]:bg-sidebar-accent"
                            />
                        }
                    >
                        <UserAvatar user={user} />
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium text-white">{user.name}</span>
                            <span className="truncate text-xs text-white/45">{user.email}</span>
                        </div>
                        <ChevronsUpDown aria-hidden="true" className="ml-auto h-4 w-4 text-white/40" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={8}
                        className="w-60 rounded-xl border border-white/10 bg-[#0d0d11] p-0 text-white shadow-[0_16px_60px_rgba(0,0,0,0.55)]"
                    >
                        <div className="flex items-center gap-3 px-3 py-3">
                            <UserAvatar user={user} className="size-9" />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">{user.name}</p>
                                <p className="truncate text-xs text-white/50">{roleLabel(user.role)}</p>
                            </div>
                        </div>
                        <DropdownMenuSeparator className="m-0 bg-white/10" />
                        <div className="p-1.5">
                            <DropdownMenuItem
                                render={<Link href="/" />}
                                className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-sm text-white/80 data-[highlighted]:bg-white/[0.07] data-[highlighted]:text-white"
                            >
                                <Home aria-hidden="true" className="h-4 w-4 text-white/60" />
                                Back to site
                            </DropdownMenuItem>
                        </div>
                        <DropdownMenuSeparator className="m-0 bg-white/10" />
                        <div className="p-1.5">
                            <DropdownMenuItem
                                onClick={handleSignOut}
                                className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 data-[highlighted]:bg-red-500/10 data-[highlighted]:text-red-300"
                            >
                                <LogOut aria-hidden="true" className="h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

export function SidebarLayout({ user }: { user: DashUser }) {
    const pathname = usePathname();
    const items = navFor(user.role);

    // Longest matching href wins, so /dashboard/jobs/new doesn't also light up /dashboard/jobs.
    const activeHref = [...items, ...accountNav]
        .filter((i) =>
            i.href === "/dashboard" ? pathname === i.href : pathname === i.href || pathname.startsWith(`${i.href}/`)
        )
        .sort((a, b) => b.href.length - a.href.length)[0]?.href;

    const renderItems = (list: NavItem[]) =>
        list.map(({ label, href, Icon }) => (
            <SidebarMenuItem key={href}>
                <SidebarMenuButton
                    render={<Link href={href} />}
                    isActive={activeHref === href}
                    tooltip={label}
                    className="text-white/70 hover:text-white data-[active=true]:bg-[#5b4bff]/15 data-[active=true]:text-white"
                >
                    <Icon aria-hidden="true" className="h-4 w-4" />
                    <span>{label}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        ));

    return (
        <Sidebar collapsible="icon" className="border-white/[0.07]">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" render={<Link href="/" aria-label="Hirely home" />}>
                            <Image
                                src={hirelyLogo}
                                alt="Hirely logo"
                                className="h-5 w-auto group-data-[collapsible=icon]:hidden"
                            />
                            <span
                                aria-hidden="true"
                                className="hidden size-8 items-center justify-center rounded-lg bg-[#5b4bff] text-sm font-bold text-white group-data-[collapsible=icon]:flex"
                            >
                                H
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-white/40">{roleLabel(user.role)}</SidebarGroupLabel>
                    <SidebarMenu>{renderItems(items)}</SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-white/40">Account</SidebarGroupLabel>
                    <SidebarMenu>{renderItems(accountNav)}</SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}

/** "Dashboard / Jobs / New" style breadcrumb built from the URL. */
export function DashboardBreadcrumb() {
    const pathname = usePathname();
    const parts = pathname.split("/").filter(Boolean).slice(1); // drop "dashboard"
    const title = (s: string) => s.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm">
                <li className={parts.length ? "text-white/50" : "font-medium text-white"}>Dashboard</li>
                {/* {parts.map((p, i) => (
                    <li key={`${p}-${i}`} className="flex items-center gap-1.5">
                        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-white/30" />
                        <span className={i === parts.length - 1 ? "font-medium text-white" : "text-white/50"}>
                            {title(p)}
                        </span>
                    </li>
                ))} */}
            </ol>
        </nav>
    );
}