"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, BriefcaseBusiness, CircleDollarSign, Flame, MapPin, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type BrowseJob = {
    id?: string | number;
    _id?: string;
    title?: string;
    company?: string;
    category?: string;
    jobType?: string;
    isRemote?: boolean | string;
    location?: string;
    salaryMin?: string | number;
    salaryMax?: string | number;
    frequency?: string;
    logo?: string;
    companyLogo?: string;
    image?: string;
    createdAt?: string;
    postedAt?: string;
    status?: string;
    deadline?: string;
    description?: string;
    responsibilities?: string;
    qualifications?: string;
    experience?: string | number;
    benefits?: string | string[];
    companySize?: string;
    industry?: string;
    website?: string;
    companyDescription?: string;
    companyImage?: string;
    applicationUrl?: string;
};

function salaryLabel(job: BrowseJob) {
    const min = job.salaryMin === undefined || job.salaryMin === "" ? undefined : Number(job.salaryMin);
    const max = job.salaryMax === undefined || job.salaryMax === "" ? undefined : Number(job.salaryMax);
    const amounts = [min, max]
        .map((amount) => amount === undefined || Number.isNaN(amount) ? undefined : `$${amount.toLocaleString()}`)
        .filter((amount): amount is string => Boolean(amount));
    if (!amounts.length) return "Salary not specified";
    return `${amounts.join(" – ")}${job.frequency ? ` ${job.frequency.replace(/^per\s+/i, "/")}` : ""}`;
}

function isRemote(job: BrowseJob) {
    return job.isRemote === true || job.isRemote === "true";
}

export default function BrowseJobsCard({ job }: { job: BrowseJob }) {
    const [saved, setSaved] = useState(false);
    const jobType = job.jobType || "Full-time";
    const logo = job.companyLogo ?? job.logo ?? job.image;

    return (
        <Card className="rounded-xl border border-white/[0.07] bg-[#141416] py-0 text-white shadow-none ring-0 transition-colors hover:border-white/[0.13]">
            <CardContent className="flex gap-3 p-3.5 sm:gap-4 sm:p-4">
                <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/[0.07] bg-[#202024] sm:size-11">
                    {logo ? (
                        // Company logos are user-provided API URLs; use a regular image to avoid remote host config.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logo} alt={`${job.company || "Company"} logo`} className="size-full object-cover" />
                    ) : (
                        <BriefcaseBusiness aria-hidden="true" className="size-5 text-white/40" />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h2 className="truncate text-sm font-semibold tracking-tight sm:text-base">
                                {job.id || job._id ? (
                                    <Link href={`/browse-jobs/${encodeURIComponent(String(job.id ?? job._id))}`} className="hover:text-white">
                                        {job.title || "Untitled position"}
                                    </Link>
                                ) : job.title || "Untitled position"}
                            </h2>
                            <p className="mt-1 truncate text-[11px] text-white/50 sm:text-xs">
                                {job.company || "Company"}
                                {job.location ? ` • ${job.location}` : ""}
                                {isRemote(job) ? " (Remote)" : ""}
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={saved ? `Remove ${job.title || "job"} from saved jobs` : `Save ${job.title || "job"}`}
                            aria-pressed={saved}
                            onClick={() => setSaved((current) => !current)}
                            className={`size-8 shrink-0 text-white/50 hover:bg-white/[0.06] hover:text-white ${saved ? "text-indigo-300" : ""}`}
                        >
                            <Bookmark aria-hidden="true" className={`size-4 ${saved ? "fill-current" : ""}`} />
                        </Button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        {job.salaryMin || job.salaryMax ? (
                            <Badge variant="outline" className="gap-1 rounded-md border-white/[0.08] bg-white/[0.035] px-2 py-1 text-[9px] font-normal text-white/75">
                                <CircleDollarSign aria-hidden="true" className="size-3" />{salaryLabel(job)}
                            </Badge>
                        ) : null}
                        <Badge variant="outline" className="gap-1 rounded-md border-white/[0.08] bg-white/[0.035] px-2 py-1 text-[9px] font-normal text-white/75">
                            {isRemote(job) ? <MapPin aria-hidden="true" className="size-3" /> : <BriefcaseBusiness aria-hidden="true" className="size-3" />}
                            {isRemote(job) && !job.location ? "Remote" : jobType}
                        </Badge>
                        {job.category && (
                            <Badge variant="outline" className="rounded-md border-white/[0.08] bg-white/[0.035] px-2 py-1 text-[9px] font-normal text-white/65">
                                {job.category}
                            </Badge>
                        )}
                        {job.status?.toLowerCase() === "featured" && (
                            <Badge className="gap-1 rounded-md border border-amber-400/20 bg-amber-500/10 px-2 py-1 text-[9px] font-medium text-amber-300">
                                <Flame aria-hidden="true" className="size-3" />Featured
                            </Badge>
                        )}
                        {jobType.toLowerCase().includes("easy apply") && (
                            <Badge className="gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[9px] font-medium text-emerald-300">
                                <Zap aria-hidden="true" className="size-3" />Easy Apply
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
