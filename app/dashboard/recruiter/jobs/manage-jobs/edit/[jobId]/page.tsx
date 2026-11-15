"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import JobForm, { type JobFormValues } from "@/components/dashboard/JobForm";
import { getJob, updateJob } from "@/lib/api/action/jobs";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function parseJob(payload: unknown): JobFormValues | null {
    if (!isRecord(payload)) return null;
    const record = payload.job ?? payload.data ?? payload;
    return isRecord(record) ? (record as JobFormValues) : null;
}

export default function EditJobPage() {
    const { jobId } = useParams<{ jobId: string }>();
    const router = useRouter();
    const [job, setJob] = useState<JobFormValues | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let isActive = true;

        async function loadJob() {
            try {
                const response = await getJob(jobId);
                if (!response.ok) throw new Error("Could not load this job listing.");
                const record = parseJob(await response.json());
                if (!record) throw new Error("The job listing response was invalid.");
                if (isActive) setJob(record);
            } catch (cause) {
                if (isActive) {
                    setError(cause instanceof Error ? cause.message : "Could not load this job listing.");
                }
            } finally {
                if (isActive) setLoading(false);
            }
        }

        void loadJob();
        return () => {
            isActive = false;
        };
    }, [jobId]);

    async function handleSubmit(values: JobFormValues) {
        setIsSubmitting(true);
        try {
            const response = await updateJob(jobId, values);
            console.log("response: ", response)
            if (!response.ok) {
                throw new Error("Could not save changes. Please try again.");
            }
            toast.success("Job updated successfully.");
            router.push("/dashboard/recruiter/jobs/manage-jobs");
        } catch (cause) {
            toast.error(cause instanceof Error ? cause.message : "Could not save changes.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) {
        return <p className="py-12 text-center text-sm text-white/50">Loading job details…</p>;
    }

    if (error || !job) {
        return (
            <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
                <p role="alert" className="text-sm text-red-300">{error || "Job listing not found."}</p>
                <Link href="/dashboard/recruiter/jobs/manage-jobs" className="mt-4 inline-flex text-sm text-indigo-300 hover:text-white">
                    Back to job listings
                </Link>
            </div>
        );
    }

    return <JobForm mode="edit" initialValues={job} isSubmitting={isSubmitting} onSubmit={handleSubmit} />;
}
