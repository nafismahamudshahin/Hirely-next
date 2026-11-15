"use client"

import { Suspense, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal } from "lucide-react"
import BrowseJobsCard, {
  type BrowseJob,
} from "@/components/browse-jobs/BrowseJobsCard"
import Footer from "@/components/layout/Footer"
import Navbar from "@/components/layout/Navbar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { countJobs, getJobs } from "@/lib/api/action/jobs"
import { parseJobs } from "@/types/jobs"

const JOB_TYPES = ["Full-time", "Contract", "Freelance"]

async function readJobCount(response: Response) {
  if (!response.ok) throw new Error("Unable to load job count.")
  const result: unknown = await response.json()
  if (typeof result === "number") return result
  if (typeof result === "object" && result !== null) {
    const data = result as Record<string, unknown>
    const nested =
      typeof data.data === "object" && data.data !== null
        ? (data.data as Record<string, unknown>)
        : data
    const count = nested.count ?? nested.total ?? nested.totalCount
    if (typeof count === "number") return count
    if (typeof count === "string" && Number.isFinite(Number(count))) {
      return Number(count)
    }
  }
  return 0
}

function BrowseJobsContent() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const queryString = searchParams.toString()
  const selectedTypes = searchParams.getAll("jobType")
  const remoteOnly = searchParams.get("isRemote") === "true"
  const sort = searchParams.get("sort") ?? "recent"
  const [jobs, setJobs] = useState<BrowseJob[]>([])
  const [jobsCount, setJobsCount] = useState(0)
  const [filterCounts, setFilterCounts] = useState<Record<string, number>>({})
  const [remoteCount, setRemoteCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const controller = new AbortController()

    async function loadJobs() {
      setLoading(true)
      setError("")
      try {
        const typeCountRequests = JOB_TYPES.map(async (type) => {
          const facetQuery = new URLSearchParams(queryString)
          facetQuery.delete("jobType")
          facetQuery.append("jobType", type)
          try {
            return [
              type,
              await readJobCount(await countJobs(facetQuery)),
            ] as const
          } catch {
            return [type, 0] as const
          }
        })
        const remoteFacetQuery = new URLSearchParams()
        if (queryString) {
          new URLSearchParams(queryString).forEach((value, key) => {
            if (key !== "isRemote") remoteFacetQuery.append(key, value)
          })
        }
        remoteFacetQuery.set("isRemote", "true")

        const [jobsResponse, countResponse, typeCounts, remoteJobsCount] =
          await Promise.all([
            getJobs(queryString),
            countJobs(queryString),
            Promise.all(typeCountRequests),
            readJobCount(await countJobs(remoteFacetQuery)).catch(() => 0),
          ])
        if (!jobsResponse.ok) throw new Error("Unable to load jobs.")
        const payload: unknown = await jobsResponse.json()
        const parsed = parseJobs(payload)
        const count = await readJobCount(countResponse)
        if (!controller.signal.aborted) {
          setJobs(parsed.jobs)
          setJobsCount(count)
          setFilterCounts(Object.fromEntries(typeCounts))
          setRemoteCount(remoteJobsCount)
        }
      } catch (cause) {
        if (!controller.signal.aborted) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Something went wrong while loading jobs."
          )
          setJobs([])
          setJobsCount(0)
          setFilterCounts({})
          setRemoteCount(0)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadJobs()
    return () => controller.abort()
  }, [queryString])

  function updateQuery(next: URLSearchParams) {
    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  function submitSearch(value: string) {
    value = value.trim()
    const next = new URLSearchParams(queryString)
    if (value) next.set("search", value)
    else next.delete("search")
    updateQuery(next)
  }

  function toggleType(type: string, checked: boolean) {
    const next = new URLSearchParams(queryString)
    const types = next.getAll("jobType").filter((selected) => selected !== type)
    next.delete("jobType")
    ;[...types, ...(checked ? [type] : [])].forEach((selected) =>
      next.append("jobType", selected)
    )
    updateQuery(next)
  }

  function updateParam(name: string, value: string) {
    const next = new URLSearchParams(queryString)
    if (value) next.set(name, value)
    else next.delete(name)
    updateQuery(next)
  }

  return (
    <main className="min-h-[70vh] bg-black px-4 py-10 text-white sm:px-6">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="mb-8">
          <p className="text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
            Find your next opportunity
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Browse jobs
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Discover roles from companies building what’s next.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            const field = event.currentTarget.elements.namedItem("search")
            submitSearch(field instanceof HTMLInputElement ? field.value : "")
          }}
          className="flex flex-col gap-2 rounded-xl border border-white/[0.08] bg-[#141416] p-3 sm:flex-row"
        >
          <div className="relative min-w-0 flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40"
            />
            <Input
              type="search"
              name="search"
              defaultValue={searchParams.get("search") ?? ""}
              placeholder="Search by job title, company, or keyword"
              aria-label="Search jobs"
              className="h-11 border-white/[0.07] bg-[#1a1a1d] pl-10 text-sm text-white placeholder:text-white/40 focus-visible:border-white/20 focus-visible:ring-white/10"
            />
          </div>
          <button
            type="submit"
            className="h-11 rounded-lg bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Search jobs
          </button>
        </form>

        <div className="mt-6 grid items-start gap-5 md:grid-cols-[230px_minmax(0,1fr)]">
          <aside className="rounded-xl border border-white/[0.08] bg-[#141416] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <SlidersHorizontal className="size-4 text-white/60" />
              Filters
            </div>
            <fieldset className="mt-6">
              <legend className="mb-4 text-xs font-medium text-white/75">
                Job type
              </legend>
              <div className="space-y-4">
                {JOB_TYPES.map((type) => (
                  <label
                    key={type}
                    className="flex cursor-pointer items-center gap-3 text-sm text-white/60"
                  >
                    <Checkbox
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={(checked) =>
                        toggleType(type, checked === true)
                      }
                    />
                    <span className="flex-1">{type}</span>
                    <span className="text-xs text-white/35">
                      {filterCounts[type] ?? 0}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-6 border-t border-white/[0.08] pt-5">
              <legend className="mb-4 text-xs font-medium text-white/75">
                Work location
              </legend>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-white/60">
                <Checkbox
                  checked={remoteOnly}
                  onCheckedChange={(checked) =>
                    updateParam("isRemote", checked === true ? "true" : "")
                  }
                />
                <span className="flex-1">Remote</span>
                <span className="text-xs text-white/35">{remoteCount}</span>
              </label>
            </fieldset>
          </aside>

          <section aria-labelledby="job-results-heading" className="min-w-0">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 id="job-results-heading" className="text-sm font-semibold">
                  {loading
                    ? "Loading jobs…"
                    : `${jobsCount.toLocaleString()} jobs available`}
                </h2>
                <p className="mt-1 text-xs text-white/40">
                  Showing opportunities that match your search.
                </p>
              </div>
              <label className="flex items-center gap-2 text-xs text-white/45">
                Sort by
                <select
                  value={sort}
                  onChange={(event) =>
                    updateParam(
                      "sort",
                      event.target.value === "recent" ? "" : event.target.value
                    )
                  }
                  className="h-9 rounded-lg border border-white/[0.08] bg-[#141416] px-3 text-xs text-white outline-none focus:border-white/20"
                >
                  <option value="recent">Most recent</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </label>
            </div>
            {error ? (
              <div
                role="alert"
                className="rounded-xl border border-red-400/15 bg-red-400/[0.04] px-4 py-10 text-center text-sm text-red-300"
              >
                {error}
              </div>
            ) : loading ? (
              <div className="space-y-3" aria-label="Loading jobs">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-24 animate-pulse rounded-xl border border-white/[0.07] bg-[#141416]"
                  />
                ))}
              </div>
            ) : jobs.length ? (
              <div className="space-y-3">
                {jobs.map((job, index) => (
                  <BrowseJobsCard
                    key={job.id ?? job._id ?? `${job.title}-${index}`}
                    job={job}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-white/[0.08] bg-[#141416] px-4 py-14 text-center">
                <Search
                  aria-hidden="true"
                  className="mx-auto size-5 text-white/35"
                />
                <p className="mt-3 text-sm font-medium">No jobs found</p>
                <p className="mt-1 text-xs text-white/45">
                  Try a different search or update your filters.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default function BrowseJobsPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<main className="min-h-[70vh] bg-black" />}>
        <BrowseJobsContent />
      </Suspense>
      <Footer />
    </>
  )
}
