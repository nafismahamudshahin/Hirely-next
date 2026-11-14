const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""
function apiFetch(path: string, query?: URLSearchParams | string) {
  const queryString = typeof query === "string" ? query : query?.toString()
  return fetch(
    `${BASE_URL.replace(/\/$/, "")}${path}${queryString ? `?${queryString}` : ""}`
  )
}

export const postAJob = async (job: object) => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(job),
  })
  return res
}

export const getJobs = async (query?: URLSearchParams | string) => {
  const res = await apiFetch("/jobs", query)
  return res
}
export const countJobs = async (query?: URLSearchParams | string) => {
  const res = await apiFetch("/jobs/count", query)
  return res
}
export const getJob = async (id: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${encodeURIComponent(id)}`)
  return res
}

export const updateJob = async (id: string, job: object) => {
  const res = await fetch(`${BASE_URL}/jobs/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  })
  return res
}
