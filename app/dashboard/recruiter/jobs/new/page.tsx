"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import JobForm, { type JobFormValues } from "@/components/dashboard/JobForm";
import { postAJob } from "@/lib/api/action/jobs";
import { useSession } from "@/lib/auth-client";

export default function NewJobPage() {
    const router = useRouter();
    const { data } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(values: JobFormValues) {
        setIsSubmitting(true);
        try {
            const response = await postAJob({ ...values, recruiterId: data?.user?.id });
            if (!response.ok) throw new Error("Could not publish the job. Please try again.");

            toast.success("Job posted successfully.");
            router.push("/dashboard/recruiter/jobs/manage-jobs");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Could not publish the job.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return <JobForm mode="create" isSubmitting={isSubmitting} onSubmit={handleSubmit} />;
}
