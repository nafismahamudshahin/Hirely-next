// Save as app/dashboard/layout.tsx
import type { CSSProperties } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardBreadcrumb, SidebarLayout } from "@/components/dashboard/SlidebarLayout";

// Re-skin shadcn's sidebar tokens to match the site's dark purple theme.
const sidebarTheme = {
    "--sidebar": "#0a0a0d",
    "--sidebar-foreground": "rgba(255,255,255,0.85)",
    "--sidebar-border": "rgba(255,255,255,0.07)",
    "--sidebar-accent": "rgba(255,255,255,0.06)",
    "--sidebar-accent-foreground": "#ffffff",
    "--sidebar-primary": "#5b4bff",
    "--sidebar-primary-foreground": "#ffffff",
    "--sidebar-ring": "#5b4bff",
} as CSSProperties;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    // The proxy already guards /dashboard; this is the real check (and gives us the user).
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login?next=/dashboard");

    const u = session.user as {
        name: string;
        email: string;
        image?: string | null;
        role?: string | null;
    };

    return (
        <SidebarProvider style={sidebarTheme}>
            <SidebarLayout user={{ name: u.name, email: u.email, image: u.image, role: u.role }} />

            <SidebarInset className="bg-[#050507] text-white">
                <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b border-white/[0.07] bg-[#050507]/80 px-4 backdrop-blur-md">
                    <SidebarTrigger className="-ml-1 text-white/70 hover:bg-white/[0.06] hover:text-white" />
                    <span aria-hidden="true" className="h-5 w-px bg-white/10" />
                    <DashboardBreadcrumb />
                </header>

                <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}