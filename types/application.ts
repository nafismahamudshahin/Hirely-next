export type ApplicationStatus =
  "submitted" | "reviewing" | "interview" | "offer" | "rejected" | "withdrawn"

/** Application document stored in the applicants collection. */
export type JobApplication = {
  _id?: string
  applicantId: string
  applicantName: string
  applicantEmail: string
  jobId: string
  jobTitle: string
  company: string
  companyLogo?: string
  location?: string
  jobType?: string
  isRemote?: boolean
  salaryMin?: string | number
  salaryMax?: string | number
  frequency?: string
  currency?: string
  status: ApplicationStatus
  appliedAt: string
  updatedAt?: string
  coverLetter?: string
  resumeUrl?: string
}
