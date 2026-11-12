// Save as app/dashboard/page.tsx
import { headers } from "next/headers";
import type { LucideIcon } from "lucide-react";

import { auth } from "@/lib/auth";

type Stat = { label: string; value: string; hint: string; Icon: LucideIcon };

// Placeholder numbers: replace with real queries.


export default async function DashboardPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user as { name?: string; role?: string | null } | undefined;

    const role = user?.role === "recruiter" || user?.role === "admin" ? user.role : "seeker";
    const firstName = user?.name?.trim().split(/\s+/)[0] ?? "there";

    return (
        <>
            <h1>{role}</h1>
        </>
    );
}