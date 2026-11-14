import { BrowseJob } from "@/components/browse-jobs/BrowseJobsCard";


export const JOB_TYPES = ["Full-time", "Contract", "Freelance"] as const;

export type SortOption = "recent" | "oldest";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "recent", label: "Most Recent" },
    { value: "oldest", label: "Oldest First" },
];

export type JobsResponse = {
    jobs: BrowseJob[];
    total?: number;
    jobTypeCounts?: Record<string, number>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

const asNumber = (value: unknown) => (typeof value === "number" ? value : undefined);

function extractJobs(records: unknown): BrowseJob[] {
    if (Array.isArray(records)) return records.filter(isRecord) as BrowseJob[];
    if (isRecord(records) && Array.isArray(records.jobs)) {
        return records.jobs.filter(isRecord) as BrowseJob[];
    }
    return [];
}

/** Accepts the several response shapes the API may return and normalizes them. */
export function parseJobs(payload: unknown): JobsResponse {
    if (Array.isArray(payload)) return { jobs: extractJobs(payload) };
    if (!isRecord(payload)) return { jobs: [] };

    const metadata = isRecord(payload.data) ? payload.data : payload;

    return {
        jobs: extractJobs(payload.jobs ?? payload.data ?? payload.results),
        total: asNumber(metadata.total) ?? asNumber(metadata.totalCount) ?? asNumber(metadata.count),
        jobTypeCounts: isRecord(metadata.jobTypeCounts)
            ? (metadata.jobTypeCounts as Record<string, number>)
            : undefined,
    };
}

export function formatCount(value: number) {
    return new Intl.NumberFormat(undefined, {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
}