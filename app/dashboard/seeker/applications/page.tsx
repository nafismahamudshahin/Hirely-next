"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Search,
  Video,
  XCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getMyApplications } from "@/lib/api/action/applicants"
import { useSession } from "@/lib/auth-client"
import type { ApplicationStatus, JobApplication } from "@/types/application"

const FILTERS = [
  { label: "All applications", value: "all" },
  { label: "In progress", value: "in-progress" },
  { label: "Interview", value: "interview" },
  { label: "Offers", value: "offer" },
  { label: "Closed", value: "closed" },
] as const

function parseApplications(payload: unknown, userId: string): JobApplication[] {
  const records = Array.isArray(payload)
    ? payload
    : typeof payload === "object" && payload !== null
      ? (() => {
          const response = payload as Record<string, unknown>
          const data = response.applications ?? response.data ?? response.result
          return Array.isArray(data) ? data : []
        })()
      : []

  return records
    .filter(
      (record): record is Record<string, unknown> =>
        typeof record === "object" && record !== null
    )
    .map((record) => {
      const rawStatus = String(record.status ?? "submitted").toLowerCase()
      const status: ApplicationStatus = [
        "submitted",
        "reviewing",
        "interview",
        "offer",
        "rejected",
        "withdrawn",
      ].includes(rawStatus)
        ? (rawStatus as ApplicationStatus)
        : "submitted"

      return {
        ...(record as Partial<JobApplication>),
        _id: String(
          record._id ??
            record.id ??
            `${record.jobId}-${record.appliedAt ?? record.createdAt ?? "application"}`
        ),
        applicantId: String(record.applicantId ?? userId),
        applicantName: String(record.applicantName ?? "Job seeker"),
        applicantEmail: String(record.applicantEmail ?? ""),
        jobId: String(record.jobId ?? ""),
        jobTitle: String(
          record.jobTitle ??
            record.role ??
            record.position ??
            "Job title unavailable"
        ),
        company: String(record.company ?? "Company unavailable"),
        status,
        appliedAt: String(
          record.appliedAt ?? record.createdAt ?? record.dateApplied ?? ""
        ),
      }
    })
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)
}

function salaryRange(application: JobApplication) {
  const currency = application.currency ?? "$"
  const format = (value?: string | number) => {
    if (value === undefined || value === "") return undefined
    const amount = Number(value)
    return Number.isFinite(amount)
      ? `${currency}${amount.toLocaleString()}`
      : undefined
  }
  const min = format(application.salaryMin)
  const max = format(application.salaryMax)
  if (!min && !max) return "Salary not listed"
  return `${min ?? max}${min && max ? ` – ${max}` : ""}${application.frequency ? ` ${application.frequency.replace(/^per\s+/i, "/")}` : ""}`
}

function statusDetails(status: ApplicationStatus) {
  switch (status) {
    case "submitted":
      return {
        label: "Submitted",
        Icon: Clock3,
        className: "border-sky-400/20 bg-sky-400/10 text-sky-300",
      }
    case "reviewing":
      return {
        label: "In review",
        Icon: Clock3,
        className: "border-amber-400/20 bg-amber-400/10 text-amber-300",
      }
    case "interview":
      return {
        label: "Interview",
        Icon: Video,
        className: "border-violet-400/20 bg-violet-400/10 text-violet-300",
      }
    case "offer":
      return {
        label: "Offer received",
        Icon: CheckCircle2,
        className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      }
    case "rejected":
      return {
        label: "Not selected",
        Icon: XCircle,
        className: "border-red-400/20 bg-red-400/10 text-red-300",
      }
    case "withdrawn":
      return {
        label: "Withdrawn",
        Icon: XCircle,
        className: "border-white/10 bg-white/[0.05] text-white/50",
      }
  }
}

function matchesFilter(application: JobApplication, filter: string) {
  if (filter === "all") return true
  if (filter === "in-progress")
    return ["submitted", "reviewing"].includes(application.status)
  if (filter === "closed")
    return ["rejected", "withdrawn"].includes(application.status)
  return application.status === filter
}

export default function SeekerApplicationsPage() {
  const { data: session, isPending } = useSession()
  const userId = session?.user?.id
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [allApplications, setAllApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    async function loadApplications() {
      if (isPending) return
      if (!userId) {
        setAllApplications([])
        setError("Sign in to view your applications.")
        setLoading(false)
        return
      }

      setLoading(true)
      setError("")
      try {
        const response = await getMyApplications(userId)
        if (!response.ok) throw new Error("Unable to load your applications.")
        const payload: unknown = await response.json()
        if (active) setAllApplications(parseApplications(payload, userId))
      } catch (cause) {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Unable to load your applications."
          )
          setAllApplications([])
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadApplications()
    return () => {
      active = false
    }
  }, [isPending, userId])

  const applications = useMemo(() => {
    const query = search.trim().toLowerCase()
    return allApplications
      .filter((application) => matchesFilter(application, activeFilter))
      .filter(
        (application) =>
          !query ||
          `${application.jobTitle} ${application.company} ${application.location ?? ""}`
            .toLowerCase()
            .includes(query)
      )
      .sort(
        (a, b) =>
          new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
      )
  }, [activeFilter, allApplications, search])

  const inProgressCount = allApplications.filter((application) =>
    ["submitted", "reviewing"].includes(application.status)
  ).length
  const interviewCount = allApplications.filter(
    (application) => application.status === "interview"
  ).length
  const offerCount = allApplications.filter(
    (application) => application.status === "offer"
  ).length

  return (
    <main className="-mx-4 -mt-2 min-h-full bg-[#111112] text-white sm:-mx-6 sm:-mt-4 lg:-mx-8">
      <div className="mx-auto max-w-6xl px-4 pt-5 pb-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] text-violet-300 uppercase">
              Your career journey
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              My applications
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/50">
              Keep track of every opportunity and see where you are in the
              hiring process.
            </p>
          </div>
          <Link
            href="/browse-jobs"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-white px-4 text-xs font-semibold text-black transition hover:bg-white/90"
          >
            <BriefcaseBusiness className="size-3.5" /> Find more jobs
          </Link>
        </header>

        <section
          aria-label="Application summary"
          className="mt-6 grid gap-3 sm:grid-cols-3"
        >
          {[
            {
              label: "Total applications",
              value: allApplications.length,
              Icon: FileText,
              tone: "text-violet-300 bg-violet-400/10",
            },
            {
              label: "In progress",
              value: inProgressCount,
              Icon: Clock3,
              tone: "text-amber-300 bg-amber-400/10",
            },
            {
              label: "Interviews & offers",
              value: interviewCount + offerCount,
              Icon: CheckCircle2,
              tone: "text-emerald-300 bg-emerald-400/10",
            },
          ].map(({ label, value, Icon, tone }) => (
            <Card
              key={label}
              className="gap-0 rounded-xl border border-white/[0.07] bg-[#171719] py-0 text-white shadow-none ring-0"
            >
              <CardContent className="flex items-center gap-3 p-4">
                <span
                  className={`flex size-10 items-center justify-center rounded-lg ${tone}`}
                >
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-xs text-white/45">{label}</p>
                  <p className="mt-1 text-xl font-semibold">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-8" aria-labelledby="applications-list-heading">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2
                id="applications-list-heading"
                className="text-base font-semibold"
              >
                Applications
              </h2>
              <p className="mt-1 text-xs text-white/45">
                {applications.length}{" "}
                {applications.length === 1 ? "application" : "applications"}{" "}
                shown
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative min-w-0 sm:w-64">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40"
                />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search jobs or companies"
                  aria-label="Search applications"
                  className="h-9 border-white/10 bg-[#171719] pl-9 text-xs text-white placeholder:text-white/35"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-1 overflow-x-auto border-b border-white/[0.08]">
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={`shrink-0 border-b-2 px-3 py-2.5 text-xs transition ${activeFilter === filter.value ? "border-violet-400 text-white" : "border-transparent text-white/45 hover:text-white/75"}`}
              >
                {filter.label}
                {filter.value === "all" && (
                  <span className="ml-2 text-[10px] text-white/40">
                    {allApplications.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {error ? (
              <div
                role="alert"
                className="rounded-xl border border-red-400/15 bg-red-400/[0.04] px-5 py-10 text-center text-sm text-red-300"
              >
                {error}
              </div>
            ) : loading ? (
              <div className="space-y-3" aria-label="Loading applications">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-32 animate-pulse rounded-xl border border-white/[0.07] bg-[#171719]"
                  />
                ))}
              </div>
            ) : applications.length ? (
              applications.map((application) => {
                const status = statusDetails(application.status)
                const StatusIcon = status.Icon
                return (
                  <Card
                    key={application._id}
                    className="gap-0 rounded-xl border border-white/[0.07] bg-[#171719] py-0 text-white shadow-none ring-0 transition-colors hover:border-white/[0.13]"
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 gap-3">
                          <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/[0.08] bg-[#222225]">
                            {application.companyLogo ? (
                              // Logos are API-provided URLs; a regular image avoids remote-host configuration.
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={application.companyLogo}
                                alt={`${application.company} logo`}
                                className="size-full object-cover"
                              />
                            ) : (
                              <BriefcaseBusiness
                                aria-hidden="true"
                                className="size-5 text-white/45"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold sm:text-base">
                              {application.jobTitle}
                            </h3>
                            <p className="mt-1 truncate text-xs text-white/55">
                              {application.company}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-white/45">
                              {application.location && (
                                <span className="inline-flex items-center gap-1.5">
                                  <MapPin className="size-3" />
                                  {application.location}
                                </span>
                              )}
                              {application.jobType && (
                                <span className="inline-flex items-center gap-1.5">
                                  <BriefcaseBusiness className="size-3" />
                                  {application.jobType}
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarDays className="size-3" />
                                Applied {formatDate(application.appliedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`inline-flex h-7 shrink-0 gap-1.5 self-start rounded-full px-2.5 text-[10px] ${status.className}`}
                        >
                          <StatusIcon className="size-3" />
                          {status.label}
                        </Badge>
                      </div>
                      <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.07] pt-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-white/50">
                          {salaryRange(application)}
                        </p>
                        <Link
                          href={`/browse-jobs/${encodeURIComponent(application.jobId)}`}
                          className="inline-flex items-center gap-1 self-start text-xs font-medium text-white/65 transition hover:text-white sm:self-auto"
                        >
                          View job <ArrowUpRight className="size-3.5" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 bg-[#171719]/60 px-5 py-14 text-center">
                <Search
                  aria-hidden="true"
                  className="mx-auto size-5 text-white/35"
                />
                <p className="mt-3 text-sm font-medium">
                  No applications found
                </p>
                <p className="mt-1 text-xs text-white/45">
                  Try another search or choose a different status filter.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
