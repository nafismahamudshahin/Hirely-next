"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Bookmark,
  BriefcaseBusiness,
  Check,
  CircleDollarSign,
  Clock3,
  ExternalLink,
  MapPin,
  UsersRound,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { BrowseJob } from "@/components/browse-jobs/BrowseJobsCard"
import { getJob } from "@/lib/api/action/jobs"
import { toast } from "sonner"
import { useSession } from "@/lib/auth-client"
import { applyToJob } from "@/lib/api/action/applicants"
import type { JobApplication } from "@/types/application"

type JobDetailsRecord = BrowseJob & {
  description?: string
  responsibilities?: string | string[]
  qualifications?: string | string[]
  benefits?: string | string[]
  experience?: string | number
  experienceLevel?: string
  companySize?: string
  industry?: string
  website?: string
  companyWebsite?: string
  companyDescription?: string
  companyImage?: string
  companyCoverImage?: string
  verifiedEmployer?: boolean
  skills?: string[]
  applicationUrl?: string
  applyUrl?: string
  currency?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function parseJob(payload: unknown): JobDetailsRecord | null {
  if (!isRecord(payload)) return null
  const candidate = payload.job ?? payload.data ?? payload
  return isRecord(candidate) ? (candidate as JobDetailsRecord) : null
}

function asLines(value?: string | string[]) {
  if (Array.isArray(value))
    return value.map((line) => line.trim()).filter(Boolean)
  return (
    value
      ?.split(/\r?\n/)
      .map((line) => line.replace(/^\s*(?:[-*•]+|\d+[.)])\s*/, "").trim())
      .filter(Boolean) ?? []
  )
}

function salaryRange(job: JobDetailsRecord) {
  const currency = job.currency || "€"
  const format = (value?: string | number) => {
    if (value === undefined || value === "") return undefined
    const amount = Number(value)
    return Number.isNaN(amount)
      ? undefined
      : `${currency}${amount.toLocaleString()}`
  }
  const min = format(job.salaryMin)
  const max = format(job.salaryMax)
  if (!min && !max) return "Not specified"
  return `${min ?? max}${min && max ? ` – ${max}` : ""}${job.frequency ? ` ${job.frequency.replace(/^per\s+/i, "/")}` : ""}`
}

function getWebsite(job: JobDetailsRecord) {
  const raw = job.website ?? job.companyWebsite
  if (!raw) return undefined
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="py-4 first:pt-0 last:pb-0">
      <h2 className="text-sm font-semibold tracking-tight text-white">
        {title}
      </h2>
      <div className="mt-3 text-[11px] leading-[1.75] text-white/55 sm:text-xs">
        {children}
      </div>
    </section>
  )
}

function TextList({ values }: { values: string[] }) {
  if (!values.length)
    return (
      <p className="text-white/40">Details will be added by the employer.</p>
    )
  return (
    <ul className="space-y-2">
      {values.map((value, index) => (
        <li key={`${value}-${index}`} className="flex gap-2.5">
          <span
            aria-hidden="true"
            className="mt-[7px] size-1 shrink-0 rounded-full bg-white/50"
          />
          <span>{value}</span>
        </li>
      ))}
    </ul>
  )
}

function DetailStat({
  Icon,
  label,
  value,
}: {
  Icon: typeof BriefcaseBusiness
  label: string
  value: string
}) {
  return (
    <Card className="min-w-0 rounded-lg border border-white/[0.07] bg-[#141416] py-0 text-white shadow-none ring-0">
      <CardContent className="min-h-[66px] p-2.5 sm:min-h-[72px] sm:p-3">
        <div className="flex items-center gap-1.5 text-white/50">
          <Icon aria-hidden="true" className="size-3" />
          <span className="text-[8px] font-medium tracking-wide uppercase">
            {label}
          </span>
        </div>
        <p
          className="mt-1.5 truncate text-[10px] font-medium text-white/90 sm:text-[11px]"
          title={value}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  )
}

export default function JobDetails() {
  const router = useRouter()
  const { data: session } = useSession()
  const params = useParams<{ jobId: string }>()
  const jobId = params.jobId
  const [job, setJob] = useState<JobDetailsRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    let active = true
    async function loadJob() {
      try {
        if (!process.env.NEXT_PUBLIC_API_URL)
          throw new Error("The jobs API is not configured.")
        const response = await getJob(jobId)
        if (!response.ok)
          throw new Error(
            response.status === 404
              ? "This job could not be found."
              : "Unable to load this job."
          )
        const result = parseJob(await response.json())
        if (!result) throw new Error("The job response was empty or invalid.")
        if (active) setJob(result)
      } catch (cause) {
        if (active)
          setError(
            cause instanceof Error ? cause.message : "Unable to load this job."
          )
      } finally {
        if (active) setLoading(false)
      }
    }
    void loadJob()
    return () => {
      active = false
    }
  }, [jobId])

  if (loading) {
    return (
      <main className="min-h-full bg-black text-white">
        <div className="mx-auto max-w-[1080px] animate-pulse space-y-3">
          <div className="h-16 rounded-xl bg-[#141416]" />
          <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(250px,1fr)]">
            <div className="h-[460px] rounded-xl bg-[#141416]" />
            <div className="h-56 rounded-xl bg-[#141416]" />
          </div>
        </div>
      </main>
    )
  }

  if (error || !job) {
    return (
      <main className="min-h-full bg-black text-white">
        <div className="mx-auto max-w-[1080px] rounded-xl border border-white/[0.07] bg-[#141416] px-5 py-12 text-center">
          <p role="alert" className="text-sm text-white/70">
            {error || "This job could not be found."}
          </p>
          <Button
            render={<Link href="/browse-jobs" />}
            variant="outline"
            className="mt-5 border-white/10 bg-white/[0.04] text-white hover:bg-white/10"
          >
            <ArrowLeft aria-hidden="true" />
            Back to jobs
          </Button>
        </div>
      </main>
    )
  }

  const skills = job.skills ?? []
  const benefits = asLines(job.benefits)
  const website = getWebsite(job)
  const companyImage =
    job.companyCoverImage ??
    job.companyImage ??
    job.companyLogo ??
    job.logo ??
    job.image
  const experience =
    job.experienceLevel ??
    (job.experience
      ? `${job.experience}${typeof job.experience === "number" ? " Years" : ""}`
      : "Not specified")

  const user = session?.user
  const handleSubmitApplication = async () => {
    if (!user) {
      toast.warning("You need to login for application.")
      router.push(`/login?redirectTo=/browse-jobs/${job._id}`)
      return
    }
    if (applying) return

    const application: JobApplication = {
      applicantId: user.id,
      applicantName: user.name ?? "",
      applicantEmail: user.email ?? "",
      jobId: String(job._id ?? job.id ?? jobId),
      jobTitle: job.title ?? "Untitled position",
      company: job.company ?? "Company",
      companyLogo:
        job.companyCoverImage ??
        job.companyImage ??
        job.companyLogo ??
        job.logo ??
        job.image,
      location: job.location,
      jobType: job.jobType,
      isRemote: job.isRemote === true || job.isRemote === "true",
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      frequency: job.frequency,
      currency: job.currency,
      status: "submitted",
      appliedAt: new Date().toISOString(),
    }

    setApplying(true)
    try {
      const response = await applyToJob(application)
      const result: unknown = await response.json().catch(() => null)
      const message =
        typeof result === "object" &&
        result !== null &&
        "message" in result &&
        typeof result.message === "string"
          ? result.message
          : undefined

      if (response.status === 409) {
        toast.warning(message ?? "You have already applied for this job.")
        return
      }
      if (!response.ok)
        throw new Error("Unable to submit your application. Please try again.")
      toast.success(message ?? "Application submitted successfully.")
    } catch (cause) {
      toast.error(
        cause instanceof Error
          ? cause.message
          : "Unable to submit your application."
      )
    } finally {
      setApplying(false)
    }
  }
  return (
    <main className="min-h-full bg-black py-10 text-white">
      <div className="mx-auto w-full max-w-[1080px]">
        <Card className="rounded-xl border border-white/[0.07] bg-[#141416] py-0 text-white shadow-none ring-0">
          <CardContent className="flex flex-col gap-4 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/[0.07] bg-[#202024] sm:size-11">
                {companyImage ? (
                  // Company images come from API URLs; avoid requiring remote image host configuration.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={companyImage}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <BriefcaseBusiness
                    aria-hidden="true"
                    className="size-5 text-white/50"
                  />
                )}
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
                  {job.title || "Job details"}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-white/50 sm:text-[11px]">
                  <span className="truncate">{job.company || "Company"}</span>
                  <span aria-hidden="true">•</span>
                  {job.verifiedEmployer && (
                    <Badge className="gap-1 border-0 bg-emerald-500/10 px-1.5 py-0 text-[9px] text-emerald-400">
                      <Check aria-hidden="true" className="size-2.5" />
                      Verified Employer
                    </Badge>
                  )}
                  {!job.verifiedEmployer && (
                    <span>
                      {job.location ||
                        (job.isRemote ? "Remote" : "Location not specified")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:pl-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={saved ? "Remove job from saved jobs" : "Save job"}
                aria-pressed={saved}
                onClick={() => setSaved((value) => !value)}
                className={`size-8 border border-white/[0.06] bg-white/[0.03] text-white/65 hover:bg-white/[0.08] hover:text-white ${saved ? "text-indigo-300" : ""}`}
              >
                <Bookmark
                  aria-hidden="true"
                  className={`size-3.5 ${saved ? "fill-current" : ""}`}
                />
              </Button>
              <Button
                disabled={applying}
                onClick={handleSubmitApplication}
                className="h-8 rounded-md bg-white px-3 text-[10px] font-medium text-[#111] hover:bg-white/90"
              >
                {applying ? "Submitting…" : "Apply Now"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-3 grid items-start gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(250px,0.95fr)] lg:gap-4">
          <div className="min-w-0">
            <section
              aria-label="Job highlights"
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              <DetailStat
                Icon={CircleDollarSign}
                label="Salary range"
                value={salaryRange(job)}
              />
              <DetailStat
                Icon={MapPin}
                label="Location"
                value={
                  job.location
                    ? `${job.location}${job.isRemote ? " (Remote)" : ""}`
                    : job.isRemote
                      ? "Remote"
                      : "Not specified"
                }
              />
              <DetailStat
                Icon={BriefcaseBusiness}
                label="Job type"
                value={job.jobType || "Not specified"}
              />
              <DetailStat Icon={Clock3} label="Experience" value={experience} />
            </section>

            <Card className="mt-3 rounded-xl border border-white/[0.07] bg-[#141416] py-0 text-white shadow-none ring-0">
              <CardContent className="divide-y divide-white/[0.06] p-4 sm:p-5">
                <Section title="Job Description">
                  {job.description ? (
                    <div className="space-y-2">
                      {asLines(job.description).map((paragraph, index) => (
                        <p key={`${index}-${paragraph}`}>{paragraph}</p>
                      ))}
                    </div>
                  ) : (
                    <p>No job description provided.</p>
                  )}
                </Section>
                <Section title="Responsibilities">
                  <TextList values={asLines(job.responsibilities)} />
                </Section>
                <Section title="Requirements">
                  {skills.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="rounded-md border-white/[0.09] bg-white/[0.035] px-2 py-1 text-[9px] font-normal text-white/75"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <TextList values={asLines(job.qualifications)} />
                </Section>
                {benefits.length > 0 && (
                  <Section title="Benefits">
                    <ul className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
                      {benefits.map((benefit, index) => (
                        <li
                          key={`${benefit}-${index}`}
                          className="flex items-center gap-2 text-white/75"
                        >
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-white/60">
                            <Check aria-hidden="true" className="size-3" />
                          </span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}
              </CardContent>
            </Card>
          </div>

          <aside aria-label="Company overview">
            <Card className="rounded-xl border border-white/[0.07] bg-[#141416] py-0 text-white shadow-none ring-0">
              <CardContent className="p-4">
                <h2 className="text-sm font-semibold">Company Overview</h2>
                {companyImage ? (
                  <div className="mt-3 h-28 overflow-hidden rounded-lg border border-white/[0.06] bg-[#202024] sm:h-32">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={companyImage}
                      alt={`${job.company || "Company"}`}
                      className="size-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mt-3 flex h-28 items-center justify-center rounded-lg border border-white/[0.06] bg-[#1c1c1f] sm:h-32">
                    <UsersRound
                      aria-hidden="true"
                      className="size-8 text-white/25"
                    />
                  </div>
                )}
                {job.companyDescription && (
                  <p className="mt-3 text-[10px] leading-relaxed text-white/50">
                    {job.companyDescription}
                  </p>
                )}
                <div className="mt-3 space-y-0">
                  <div className="flex items-center justify-between gap-3 py-3 text-[10px]">
                    <span className="text-white/40">Size</span>
                    <span className="text-right text-white/75">
                      {job.companySize || "Not specified"}
                    </span>
                  </div>
                  <Separator className="bg-white/[0.06]" />
                  <div className="flex items-center justify-between gap-3 py-3 text-[10px]">
                    <span className="text-white/40">Industry</span>
                    <span className="text-right text-white/75">
                      {job.industry || job.category || "Not specified"}
                    </span>
                  </div>
                </div>
                {website && (
                  <Button
                    render={
                      <a href={website} target="_blank" rel="noreferrer" />
                    }
                    variant="outline"
                    className="mt-1 h-8 w-full border-white/[0.08] bg-white/[0.035] text-[10px] text-white/75 hover:bg-white/[0.08] hover:text-white"
                  >
                    Visit Website
                    <ExternalLink aria-hidden="true" className="ml-1 size-3" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  )
}
