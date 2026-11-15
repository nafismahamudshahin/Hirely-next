"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Globe, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const categories = [
    "Engineering & Tech",
    "Design",
    "Product",
    "Marketing",
    "Sales",
    "Finance",
    "Customer Support",
    "Operations",
    "Other",
];
const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
const frequencies = ["per hour", "per day", "per week", "per month", "per year"];

const inputClass =
    "h-11 border-white/10 bg-white/[0.04] text-white placeholder:text-white/35 focus-visible:border-[#5b4bff] focus-visible:ring-[#5b4bff]/30";
const selectTriggerClass = "h-11 w-full border-white/10 bg-white/[0.04] text-white";
const selectContentClass = "border-white/10 bg-[#0d0d11] text-white";
const textareaClass =
    "min-h-[130px] resize-y border-white/10 bg-white/[0.04] text-white placeholder:text-white/35 focus-visible:border-[#5b4bff] focus-visible:ring-[#5b4bff]/30";

export type JobFormValues = {
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
    responsibilities?: string;
    qualifications?: string;
};

type JobFormProps = {
    mode: "create" | "edit";
    initialValues?: JobFormValues;
    isSubmitting?: boolean;
    onSubmit: (values: JobFormValues) => void | Promise<void>;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-5">
            <h2 className="flex items-center gap-2.5 text-sm font-semibold text-white">
                <span aria-hidden="true" className="size-1.5 rounded-sm bg-[#5b4bff]" />
                {title}
            </h2>
            {children}
        </section>
    );
}

function Field({
    htmlFor,
    label,
    required,
    hint,
    children,
}: {
    htmlFor?: string;
    label: string;
    required?: boolean;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
                <Label htmlFor={htmlFor} className="text-xs font-medium text-white/75">
                    {label}
                    {required && <span className="ml-0.5 text-[#8f88ff]">*</span>}
                </Label>
                {hint && <span className="text-[11px] text-white/35">{hint}</span>}
            </div>
            {children}
        </div>
    );
}

export default function JobForm({ mode, initialValues, isSubmitting = false, onSubmit }: JobFormProps) {
    const [isRemote, setIsRemote] = useState(
        initialValues?.isRemote === true || initialValues?.isRemote === "true",
    );
    const isEdit = mode === "edit";
    const formId = "job-details-form";

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const values = Object.fromEntries(formData.entries()) as JobFormValues;
        await onSubmit({ ...values, isRemote });
    }

    return (
        <div className="mx-auto w-full max-w-4xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        {isEdit ? "Edit Job Post" : "Post a New Job"}
                    </h1>
                    <p className="mt-1.5 max-w-md text-sm text-white/50">
                        {isEdit
                            ? "Update the position details and keep your listing current."
                            : "Fill in the position specifications to attract qualified talent across our network."}
                    </p>
                </div>
                <Button
                    type="submit"
                    form={formId}
                    disabled={isSubmitting}
                    className="h-10 w-full gap-2 rounded-lg bg-[#5b4bff] px-5 text-sm font-semibold text-white shadow-[0_6px_24px_rgba(91,75,255,0.35)] hover:bg-[#6d5eff] sm:w-auto"
                >
                    {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Publish Job"}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Button>
            </div>

            <form id={formId} onSubmit={handleSubmit} className="mt-8 space-y-10">
                <Section title="1. Basic Information">
                    <Field htmlFor="title" label="Job Title" required>
                        <Input id="title" name="title" required defaultValue={initialValues?.title} placeholder="Frontend Developer" className={inputClass} />
                    </Field>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field htmlFor="company" label="Company Name" required>
                            <Input id="company" name="company" required defaultValue={initialValues?.company} placeholder="HirePulse Network" className={inputClass} />
                        </Field>
                        <Field htmlFor="category" label="Job Category" required>
                            <Select name="category" defaultValue={initialValues?.category || categories[0]}>
                                <SelectTrigger id="category" className={selectTriggerClass}><SelectValue /></SelectTrigger>
                                <SelectContent className={selectContentClass}>
                                    {categories.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <fieldset className="space-y-2">
                        <legend className="text-xs font-medium text-white/75">
                            Job Type<span className="ml-0.5 text-[#8f88ff]">*</span>
                        </legend>
                        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                            {jobTypes.map((type, index) => (
                                <label key={type} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="jobType"
                                        value={type}
                                        required={index === 0}
                                        defaultChecked={initialValues?.jobType ? initialValues.jobType === type : index === 0}
                                        className="peer sr-only"
                                    />
                                    <span className="flex h-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-sm text-white/60 transition-colors hover:bg-white/[0.06] peer-checked:border-[#5b4bff] peer-checked:bg-[#5b4bff]/15 peer-checked:font-medium peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#5b4bff]/50">
                                        {type}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </fieldset>
                </Section>

                <Section title="2. Location, Compensation & Timeline">
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#1b1b20] text-[#8f88ff]">
                            <Globe aria-hidden="true" className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <Label htmlFor="isRemote" className="text-sm font-medium text-white">Remote Work Allowed</Label>
                            <p className="mt-0.5 text-xs text-white/45">Enable worldwide or distributed candidate applications</p>
                        </div>
                        <Switch
                            id="isRemote"
                            checked={isRemote}
                            onCheckedChange={setIsRemote}
                            className="data-[state=checked]:bg-[#5b4bff]"
                        />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field htmlFor="location" label="Job Location" required>
                            <div className="relative">
                                <MapPin aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                                <Input id="location" name="location" required defaultValue={initialValues?.location} placeholder="New York, USA" className={`${inputClass} pl-9`} />
                            </div>
                        </Field>
                        <Field htmlFor="deadline" label="Application Deadline">
                            <div className="relative">
                                <CalendarDays aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                                <Input id="deadline" name="deadline" type="date" defaultValue={initialValues?.deadline?.slice(0, 10)} className={`${inputClass} pl-9 [color-scheme:dark]`} />
                            </div>
                        </Field>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-3">
                        <Field htmlFor="salaryMin" label="Min Salary / Rate">
                            <div className="relative">
                                <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/40">€</span>
                                <Input id="salaryMin" name="salaryMin" type="number" min={0} inputMode="decimal" defaultValue={initialValues?.salaryMin} placeholder="25" className={`${inputClass} pl-8`} />
                            </div>
                        </Field>
                        <Field htmlFor="salaryMax" label="Max Salary / Rate">
                            <div className="relative">
                                <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/40">€</span>
                                <Input id="salaryMax" name="salaryMax" type="number" min={0} inputMode="decimal" defaultValue={initialValues?.salaryMax} placeholder="40" className={`${inputClass} pl-8`} />
                            </div>
                        </Field>
                        <Field htmlFor="frequency" label="Frequency">
                            <Select name="frequency" defaultValue={initialValues?.frequency || frequencies[0]}>
                                <SelectTrigger id="frequency" className={selectTriggerClass}><SelectValue /></SelectTrigger>
                                <SelectContent className={selectContentClass}>
                                    {frequencies.map((frequency) => <SelectItem key={frequency} value={frequency}>{frequency}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>
                </Section>

                <Section title="3. Responsibilities & Requirements">
                    <Field htmlFor="responsibilities" label="Key Responsibilities" required>
                        <Textarea id="responsibilities" name="responsibilities" required defaultValue={initialValues?.responsibilities} placeholder="Describe what this person will do day to day..." className={textareaClass} />
                    </Field>
                    <Field htmlFor="qualifications" label="Qualifications & Requirements" required>
                        <Textarea id="qualifications" name="qualifications" required defaultValue={initialValues?.qualifications} placeholder="List the skills, experience and education needed..." className={textareaClass} />
                    </Field>
                </Section>

                <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-end">
                    <Link
                        href="/dashboard/recruiter/jobs/manage-jobs"
                        className="inline-flex h-11 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] px-6 text-sm font-medium text-white transition-colors hover:bg-white/[0.09]"
                    >
                        Cancel
                    </Link>
                    <Button type="submit" disabled={isSubmitting} className="h-11 gap-2 rounded-lg bg-[#5b4bff] px-6 text-sm font-semibold text-white shadow-[0_6px_24px_rgba(91,75,255,0.35)] hover:bg-[#6d5eff]">
                        {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Publish Job"}
                        <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
