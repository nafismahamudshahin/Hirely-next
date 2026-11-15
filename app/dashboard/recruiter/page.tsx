"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BriefcaseBusiness, CheckCircle2, FileText, UsersRound, Zap } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useSession } from "@/lib/auth-client";
import { getJobs } from "@/lib/api/action/jobs";

type Application = {
    id?: string | number;
    _id?: string;
    candidate?: { name?: string; image?: string; avatar?: string; email?: string } | string;
    candidateName?: string;
    name?: string;
    avatar?: string;
    image?: string;
    role?: string;
    jobTitle?: string;
    position?: string;
    appliedAt?: string;
    createdAt?: string;
    dateApplied?: string;
    experience?: string | number;
    status?: string;
};

type Job = {
    id?: string | number;
    _id?: string;
    title?: string;
    status?: string;
    deadline?: string;
    recruiterId?: string | number;
    applicantCount?: number;
    applicants?: number | Application[];
    applications?: Application[];
};

type DashboardData = { jobs: Job[]; applications: Application[] };

const statCards = [
    { label: "Total Job Posts", key: "jobs" as const, Icon: FileText },
    { label: "Total Applicants", key: "applicants" as const, Icon: UsersRound },
    { label: "Active Jobs", key: "active" as const, Icon: Zap },
    { label: "Jobs Closed", key: "closed" as const, Icon: CheckCircle2 },
];

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function parseJobs(payload: unknown): Job[] {
    if (Array.isArray(payload)) return payload.filter(isRecord) as Job[];
    if (!isRecord(payload)) return [];
    const records = payload.jobs ?? payload.data ?? payload.results;
    if (Array.isArray(records)) return records.filter(isRecord) as Job[];
    if (isRecord(records) && Array.isArray(records.jobs)) return records.jobs.filter(isRecord) as Job[];
    return [];
}

function isClosed(job: Job) {
    const status = job.status?.toLowerCase();
    if (status) return ["closed", "expired", "inactive", "archived", "filled"].includes(status);
    if (!job.deadline) return false;
    const deadline = new Date(job.deadline);
    return !Number.isNaN(deadline.getTime()) && deadline.getTime() < new Date().setHours(0, 0, 0, 0);
}

function countApplicants(job: Job) {
    if (Array.isArray(job.applications)) return job.applications.length;
    if (typeof job.applicantCount === "number") return job.applicantCount;
    if (Array.isArray(job.applicants)) return job.applicants.length;
    if (typeof job.applicants === "number") return job.applicants;
    return 0;
}

function applicationName(application: Application) {
    if (typeof application.candidate === "string") return application.candidate;
    return application.candidate?.name ?? application.candidateName ?? application.name ?? "Candidate";
}

function applicationImage(application: Application) {
    return typeof application.candidate === "object" && application.candidate
        ? application.candidate.image ?? application.candidate.avatar ?? application.avatar ?? application.image
        : application.avatar ?? application.image;
}

function formatDate(value?: string) {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "—"
        : new Intl.DateTimeFormat(undefined, { month: "short", day: "2-digit", year: "numeric" }).format(date);
}

function statusStyle(status?: string) {
    switch (status?.toLowerCase()) {
        case "interviewing": return "bg-violet-500/15 text-violet-300";
        case "new": return "bg-sky-500/15 text-sky-300";
        case "reviewing": return "bg-amber-500/15 text-amber-300";
        case "rejected": return "bg-red-500/15 text-red-300";
        default: return "bg-white/[0.08] text-white/65";
    }
}

export default function RecruiterDashboard() {
    const { data: session } = useSession();
    const recruiterId = session?.user?.id;
    const [data, setData] = useState<DashboardData>({ jobs: [], applications: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        async function loadDashboard() {
            if (!process.env.NEXT_PUBLIC_API_URL) {
                setError("The jobs API is not configured.");
                setLoading(false);
                return;
            }
            try {
                const response = await getJobs();
                if (!response.ok) throw new Error("Unable to load recruiter dashboard data.");
                const records = parseJobs(await response.json());
                const jobs = recruiterId
                    ? records.filter((job) => !job.recruiterId || String(job.recruiterId) === String(recruiterId))
                    : records;
                const applications = jobs.flatMap((job) => Array.isArray(job.applications)
                    ? job.applications.map((application) => ({ ...application, jobTitle: application.jobTitle ?? job.title }))
                    : Array.isArray(job.applicants)
                        ? job.applicants.map((application) => ({ ...application, jobTitle: application.jobTitle ?? job.title }))
                        : [],
                ).sort((a, b) => {
                    const dateA = new Date(a.appliedAt ?? a.createdAt ?? a.dateApplied ?? 0).getTime();
                    const dateB = new Date(b.appliedAt ?? b.createdAt ?? b.dateApplied ?? 0).getTime();
                    return dateB - dateA;
                });
                if (active) setData({ jobs, applications });
            } catch (cause) {
                if (active) setError(cause instanceof Error ? cause.message : "Unable to load recruiter dashboard data.");
            } finally {
                if (active) setLoading(false);
            }
        }
        void loadDashboard();
        return () => { active = false; };
    }, [recruiterId]);

    const counts = {
        jobs: data.jobs.length,
        applicants: data.jobs.reduce((total, job) => total + countApplicants(job), 0),
        active: data.jobs.filter((job) => !isClosed(job)).length,
        closed: data.jobs.filter(isClosed).length,
    };
    const displayName = session?.user?.name?.trim().split(/\s+/)[0] || "there";

    return (
        <main className="min-h-full bg-[#111112] text-white">
            <div className="mx-auto w-full max-w-[1500px]">
                <h1 className="mb-5 text-sm font-semibold tracking-tight sm:text-base">Welcome back, {displayName}</h1>

                <section aria-label="Recruiter statistics" className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-4">
                    {statCards.map(({ label, key, Icon }) => (
                        <Card key={key} className="gap-0 rounded-lg border border-white/[0.06] bg-[#151517] py-0 text-white shadow-none ring-0">
                            <CardContent className="flex min-h-[96px] flex-col justify-between p-3 sm:min-h-[102px] sm:p-4">
                                <span className="flex size-8 items-center justify-center rounded-md bg-white/[0.07] text-white/75">
                                    <Icon aria-hidden="true" className="size-4" />
                                </span>
                                <div className="mt-3">
                                    <p className="text-[11px] text-white/50">{label}</p>
                                    <p className="mt-0.5 text-lg font-semibold leading-none tracking-tight">
                                        {loading ? <span className="inline-block h-5 w-10 animate-pulse rounded bg-white/10" /> : counts[key].toLocaleString()}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                <section className="mt-6" aria-labelledby="recent-applications-heading">
                    <div className="mb-3 flex items-center justify-between gap-4">
                        <h2 id="recent-applications-heading" className="text-sm font-semibold">Recent Applications</h2>
                        <Link href="/dashboard/recruiter/applicants" className="shrink-0 text-[11px] text-white/60 transition-colors hover:text-white">View all</Link>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-white/[0.06] bg-[#151517]">
                        {error ? (
                            <p role="alert" className="px-4 py-8 text-center text-xs text-red-300">{error}</p>
                        ) : loading ? (
                            <p className="px-4 py-8 text-center text-xs text-white/50">Loading recent applications…</p>
                        ) : data.applications.length === 0 ? (
                            <div className="flex flex-col items-center px-4 py-10 text-center">
                                <span className="flex size-9 items-center justify-center rounded-lg bg-white/[0.06] text-white/45">
                                    <BriefcaseBusiness aria-hidden="true" className="size-4" />
                                </span>
                                <p className="mt-3 text-xs font-medium text-white/80">No applications yet</p>
                                <p className="mt-1 max-w-sm text-[11px] text-white/45">New candidate applications will appear here.</p>
                            </div>
                        ) : (
                            <div>
                            <div className="divide-y divide-white/[0.05] md:hidden">
                                {data.applications.slice(0, 8).map((application, index) => {
                                    const name = applicationName(application);
                                    const status = application.status || "New";
                                    return (
                                        <article key={application.id ?? application._id ?? `${name}-${index}`} className="p-3">
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex min-w-0 items-center gap-2">
                                                    <Avatar className="size-8 border border-white/10">
                                                        {applicationImage(application) && <AvatarImage src={applicationImage(application)} alt="" />}
                                                        <AvatarFallback className="bg-[#34343a] text-[9px] text-white">{name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-xs font-medium text-white/90">{name}</p>
                                                        <p className="truncate text-[10px] text-white/50">{application.role ?? application.position ?? application.jobTitle ?? "—"}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className={`shrink-0 rounded-full border-0 px-2 py-0 text-[9px] font-medium ${statusStyle(status)}`}>{status}</Badge>
                                            </div>
                                            <div className="mt-2 flex gap-4 pl-10 text-[10px] text-white/45">
                                                <span>Applied {formatDate(application.appliedAt ?? application.createdAt ?? application.dateApplied)}</span>
                                                <span>{application.experience ? `${application.experience}${typeof application.experience === "number" ? " years" : ""}` : "Experience —"}</span>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                            <div className="hidden md:block">
                            <Table className="min-w-[700px]">
                                <TableHeader className="bg-[#1b1b1e]">
                                    <TableRow className="border-white/[0.06] hover:bg-transparent">
                                        <TableHead className="h-9 w-[34%] pl-4 text-[9px] font-medium uppercase tracking-wide text-white/45">Candidate name</TableHead>
                                        <TableHead className="h-9 text-[9px] font-medium uppercase tracking-wide text-white/45">Role</TableHead>
                                        <TableHead className="h-9 text-[9px] font-medium uppercase tracking-wide text-white/45">Date applied</TableHead>
                                        <TableHead className="h-9 text-[9px] font-medium uppercase tracking-wide text-white/45">Experience</TableHead>
                                        <TableHead className="h-9 pr-4 text-[9px] font-medium uppercase tracking-wide text-white/45">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.applications.slice(0, 8).map((application, index) => {
                                        const name = applicationName(application);
                                        const status = application.status || "New";
                                        return (
                                            <TableRow key={application.id ?? application._id ?? `${name}-${index}`} className="border-white/[0.05] hover:bg-white/[0.02]">
                                                <TableCell className="py-2.5 pl-4">
                                                    <div className="flex min-w-0 items-center gap-2">
                                                        <Avatar className="size-7 border border-white/10">
                                                            {applicationImage(application) && <AvatarImage src={applicationImage(application)} alt="" />}
                                                            <AvatarFallback className="bg-[#34343a] text-[9px] text-white">{name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="truncate text-[11px] font-medium text-white/90">{name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-[170px] truncate py-2.5 text-[10px] text-white/65">{application.role ?? application.position ?? application.jobTitle ?? "—"}</TableCell>
                                                <TableCell className="py-2.5 text-[10px] text-white/55">{formatDate(application.appliedAt ?? application.createdAt ?? application.dateApplied)}</TableCell>
                                                <TableCell className="py-2.5 text-[10px] text-white/55">{application.experience ? `${application.experience}${typeof application.experience === "number" ? " years" : ""}` : "—"}</TableCell>
                                                <TableCell className="py-2.5 pr-4">
                                                    <Badge variant="outline" className={`rounded-full border-0 px-2 py-0 text-[9px] font-medium ${statusStyle(status)}`}>{status}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
