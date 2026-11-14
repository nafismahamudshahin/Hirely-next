import type { JobApplication } from "@/types/application"

export const applyToJob = async (data: JobApplication) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applicants`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  })
  return res
}

export const getMyApplications = async (userId: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ""
  return fetch(
    `${baseUrl.replace(/\/$/, "")}/application/me/${encodeURIComponent(userId)}`
  )
}
