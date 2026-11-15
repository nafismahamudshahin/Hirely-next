"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    BriefcaseBusiness,
    Code,
    Copy,
    Eye,
    Globe,
    MapPin,
    Megaphone,
    MoreVertical,
    Pencil,
    PenTool,
    Plus,
    Server,
    ShieldCheck,
    Trash2,
    UsersRound,
    XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

type Job = {
    id?: string | number;
    _id?: string;
    title?: string;
    company?: string;
    category?: string;
    jobType?: string;
    isRemote?: boolean | string;
    location?: string;
    deadline?: string;
    salaryMin?: string | number;
    salaryMax?: string | number;
    frequency?: string;
    recruiterId?: string | number;
    status?: string;
    applicantCount?: number;
    applicants?: number | unknown[];
    applications?: unknown[];
    createdAt?: string;
    postedAt?: string;
};

const categoryStyles: Record<string, { Icon: LucideIcon; color: string }> = {
    engineering: { Icon: Code, color: "text-indigo-300" },
    design: { Icon: PenTool, color: "text-orange-400" },
    product: { Icon: BriefcaseBusiness, color: "text-violet-300" },
    marketing: { Icon: Megaphone, color: "text-violet-300" },
    infrastructure: { Icon: Server, color: "text-sky-400" },
    quality: { Icon: ShieldCheck, color: "text-sky-400" },
};

const headerClass = "h-10 px-3 text-[10px] font-medium uppercase tracking-[0.08em] text-white/55";

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

function jobId(job: Job) {
    return String(job.id ?? job._id ?? `${job.title ?? "job"}-${job.company ?? ""}`);
}

function isRemote(job: Job) {
    return job.isRemote === true || job.isRemote === "true";
}

function statusFor(job: Job) {
    if (job.status) return job.status;
    if (!job.deadline) return "Active";
    const deadline = new Date(job.deadline);
    return !Number.isNaN(deadline.getTime()) && deadline.getTime() < new Date().setHours(0, 0, 0, 0)
        ? "Expired"
        : "Active";
}

function formatDate(value?: string) {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "—"
        : new Intl.DateTimeFormat(undefined, { month: "short", day: "2-digit", year: "numeric" }).format(date);
}

function formatPosted(value?: string) {
    if (!value) return "Posted recently";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Posted recently";

    const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86_400_000));
    if (days === 0) return "Posted today";
    if (days === 1) return "Posted 1d ago";
    if (days < 7) return `Posted ${days}d ago`;
    const weeks = Math.floor(days / 7);
    return `Posted ${weeks}${weeks === 1 ? "w" : "w"} ago`;
}

function formatCompensation(job: Job) {
    const min = job.salaryMin === undefined || job.salaryMin === "" ? undefined : Number(job.salaryMin);
    const max = job.salaryMax === undefined || job.salaryMax === "" ? undefined : Number(job.salaryMax);
    const values = [min, max].map((amount) =>
        amount === undefined || Number.isNaN(amount) ? undefined : `€${amount.toLocaleString()}`,
    ).filter(Boolean);

    if (!values.length) return "—";
    const range = values.length > 1 ? `${values[0]} – ${values[1]}` : values[0];
    const frequency = job.frequency?.replace(/^per\s+/i, "/ ") ?? "";
    return `${range}${frequency ? ` ${frequency}` : ""}`;
}

function applicantCount(job: Job) {
    if (typeof job.applicantCount === "number") return job.applicantCount;
    if (Array.isArray(job.applicants)) return job.applicants.length;
    if (typeof job.applicants === "number") return job.applicants;
    return job.applications?.length ?? 0;
}

function ApplicantsLink({ job }: { job: Job }) {
    return (
        <Link
            href={`/dashboard/recruiter/applicants?job=${encodeURIComponent(jobId(job))}`}
            className="inline-flex items-center gap-1.5 whitespace-nowrap text-[10px] text-indigo-200 hover:text-white"
        >
            <UsersRound aria-hidden="true" className="size-3.5 shrink-0 text-indigo-300" />
            {applicantCount(job)} Candidates
        </Link>
    );
}

function JobTitle({ job }: { job: Job }) {
    const category = job.category ?? "Other";
    const style = Object.entries(categoryStyles).find(([key]) => category.toLowerCase().includes(key))?.[1]
        ?? { Icon: BriefcaseBusiness, color: "text-white/60" };
    const Icon = style.Icon;

    return (
        <div className="flex min-w-0 items-center gap-2.5 sm:min-w-[190px]">
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-white/[0.07] bg-white/[0.04]">
                <Icon aria-hidden="true" className={`size-4 ${style.color}`} />
            </span>
            <span className="min-w-0">
                <span className="block truncate text-xs font-medium text-white">{job.title || "Untitled job"}</span>
                <span className={`mt-0.5 block truncate text-[10px] ${style.color}`}>{category}</span>
            </span>
        </div>
    );
}

function Location({ job }: { job: Job }) {
    const Icon = isRemote(job) ? Globe : MapPin;
    const mode = isRemote(job) ? "Remote" : "On-site";

    return (
        <div className="min-w-0 sm:min-w-[145px]">
            <p className="truncate text-xs text-white/90">{job.company || "—"}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[10px] text-white/45">
                <Icon aria-hidden="true" className="size-3 shrink-0" />
                <span className="truncate">{job.location ? `${job.location} (${mode})` : mode}</span>
            </p>
        </div>
    );
}

function Status({ job }: { job: Job }) {
    const active = statusFor(job).toLowerCase() === "active";
    return (
        <Badge
            variant="outline"
            className={`gap-1 rounded-full border-0 px-2 py-0 text-[9px] font-medium ${active ? "bg-emerald-500/15 text-emerald-400" : "bg-white/[0.07] text-white/45"
                }`}
        >
            <span aria-hidden="true" className={`size-1 rounded-full ${active ? "bg-emerald-400" : "bg-white/35"}`} />
            {statusFor(job)}
        </Badge>
    );
}

function JobActions({ job }: { job: Job }) {
    return (
        <div className="flex items-center justify-end gap-1.5">
            <Link
                href={`/dashboard/recruiter/jobs/manage-jobs/edit/${jobId(job)}`}
                aria-label={`Update ${job.title ?? "job"}`}
                className="inline-flex h-7 items-center gap-1 rounded-md bg-indigo-500/20 px-2 text-[10px] text-indigo-200 transition-colors hover:bg-indigo-500/30"
            >
                <Pencil aria-hidden="true" className="size-3" />
                Update
            </Link>
            <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled
                aria-label={`Delete ${job.title ?? "job"}`}
                title="Delete action is not configured yet"
                className="size-7 rounded-md border border-white/[0.07] bg-white/[0.03] text-white/50"
            >
                <Trash2 aria-hidden="true" className="size-3.5" />
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger
                    aria-label={`More actions for ${job.title ?? "job"}`}
                    className="inline-flex size-7 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                    <MoreVertical aria-hidden="true" className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 border-white/10 bg-[#171719] text-white">
                    <DropdownMenuItem disabled className="gap-2 text-xs">
                        <Eye aria-hidden="true" className="size-3.5" /> View listing
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled className="gap-2 text-xs">
                        <Copy aria-hidden="true" className="size-3.5" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled className="gap-2 text-xs">
                        <XCircle aria-hidden="true" className="size-3.5" /> Close listing
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export default function ManageJobs() {
    const { data } = useSession();
    const recruiterId = data?.user?.id;
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        async function loadJobs() {
            if (!baseUrl) {
                setError("The jobs API is not configured.");
                setLoading(false);
                return;
            }

            try {
                const response = await getJobs();
                if (!response.ok) throw new Error("Unable to load job listings.");
                const records = parseJobs(await response.json());
                setJobs(
                    recruiterId
                        ? records.filter((job) => !job.recruiterId || String(job.recruiterId) === String(recruiterId))
                        : records,
                );
            } catch (cause) {
                if (!controller.signal.aborted) {
                    setError(cause instanceof Error ? cause.message : "Unable to load job listings.");
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        void loadJobs();
        return () => controller.abort();
    }, [recruiterId]);

    return (
        <main className="-mx-4 min-h-full bg-[#111112] text-white sm:-mx-6 sm:-mt-6 lg:-mx-8 lg:-mt-4">
            <div className="px-4 pb-8 pt-2 sm:px-6 lg:px-8">
                <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Manage Job Posts</h1>
                        <p className="mt-1.5 max-w-md text-sm text-white/50">
                            Review live listings, monitor applicants, and update job details across your organization.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/recruiter/jobs/new"
                        className="inline-flex h-9 w-full shrink-0 items-center justify-center gap-1.5 rounded-lg bg-indigo-500 px-3 text-[11px] font-medium text-white shadow-[0_4px_16px_rgba(99,85,255,0.3)] transition-colors hover:bg-indigo-400 sm:h-8 sm:w-auto"
                    >
                        <Plus aria-hidden="true" className="size-3.5" />
                        New Job Post
                    </Link>
                </header>

                <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#151516]">
                    {loading ? (
                        <div className="p-8 text-center text-xs text-white/45">Loading job listings…</div>
                    ) : error ? (
                        <div role="alert" className="p-8 text-center text-xs text-red-300">{error}</div>
                    ) : jobs.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <BriefcaseBusiness aria-hidden="true" className="mx-auto size-7 text-white/30" />
                            <h2 className="mt-3 text-sm font-medium">No job posts yet</h2>
                            <p className="mt-1 text-xs text-white/45">Create your first listing to start reaching candidates.</p>
                            <Link href="/dashboard/recruiter/jobs/new" className="mt-4 inline-flex text-xs font-medium text-indigo-300 hover:text-white">
                                Post a new job
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="hidden lg:block">
                                <Table className="min-w-[900px]">
                                    <TableHeader className="bg-[#101011]">
                                        <TableRow className="border-white/[0.06] hover:bg-transparent">
                                            <TableHead className={`${headerClass} pl-4`}>Job Title &amp; Dept</TableHead>
                                            <TableHead className={headerClass}>Company &amp; Location</TableHead>
                                            <TableHead className={headerClass}>Type</TableHead>
                                            <TableHead className={headerClass}>Compensation</TableHead>
                                            <TableHead className={headerClass}>Applicants</TableHead>
                                            <TableHead className={headerClass}>Status</TableHead>
                                            <TableHead className={headerClass}>Deadline</TableHead>
                                            <TableHead className={`${headerClass} pr-4 text-right`}>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {jobs.map((job) => (
                                            <TableRow key={jobId(job)} className="border-white/[0.055] hover:bg-white/[0.015]">
                                                <TableCell className="py-3 pl-4"><JobTitle job={job} /></TableCell>
                                                <TableCell className="py-3"><Location job={job} /></TableCell>
                                                <TableCell className="py-3">
                                                    <Badge variant="outline" className="rounded-full border-0 bg-white/[0.06] px-2 py-0 text-[9px] font-normal text-white/75">
                                                        {job.jobType || "—"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap py-3 text-[10px] text-white/90">
                                                    {formatCompensation(job)}
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <ApplicantsLink job={job} />
                                                </TableCell>
                                                <TableCell className="py-3"><Status job={job} /></TableCell>
                                                <TableCell className="whitespace-nowrap py-3">
                                                    <p className="text-[10px] text-white/90">{formatDate(job.deadline)}</p>
                                                    <p className="mt-0.5 text-[9px] text-white/35">{formatPosted(job.postedAt ?? job.createdAt)}</p>
                                                </TableCell>
                                                <TableCell className="py-3 pr-3"><JobActions job={job} /></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <ul className="grid gap-3 p-3 lg:hidden">
                                {jobs.map((job) => (
                                    <li key={jobId(job)} className="min-w-0 rounded-lg border border-white/[0.07] bg-[#111112] p-3 sm:p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <JobTitle job={job} />
                                            <Status job={job} />
                                        </div>
                                        <div className="mt-3 border-t border-white/[0.06] pt-3">
                                            <Location job={job} />
                                        </div>
                                        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4">
                                            <div className="min-w-0">
                                                <dt className="text-[9px] uppercase tracking-wider text-white/35">Type</dt>
                                                <dd className="mt-1">
                                                    <Badge variant="outline" className="rounded-full border-0 bg-white/[0.06] px-2 py-0 text-[9px] font-normal text-white/75">
                                                        {job.jobType || "—"}
                                                    </Badge>
                                                </dd>
                                            </div>
                                            <div className="min-w-0">
                                                <dt className="text-[9px] uppercase tracking-wider text-white/35">Compensation</dt>
                                                <dd className="mt-1 break-words text-[11px] text-white/85">{formatCompensation(job)}</dd>
                                            </div>
                                            <div className="min-w-0">
                                                <dt className="text-[9px] uppercase tracking-wider text-white/35">Applicants</dt>
                                                <dd className="mt-1"><ApplicantsLink job={job} /></dd>
                                            </div>
                                            <div className="min-w-0">
                                                <dt className="text-[9px] uppercase tracking-wider text-white/35">Deadline</dt>
                                                <dd className="mt-1 text-[11px] text-white/85">{formatDate(job.deadline)}</dd>
                                                <dd className="mt-0.5 text-[9px] text-white/35">{formatPosted(job.postedAt ?? job.createdAt)}</dd>
                                            </div>
                                        </dl>
                                        <div className="mt-4 border-t border-white/[0.06] pt-3">
                                            <JobActions job={job} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
