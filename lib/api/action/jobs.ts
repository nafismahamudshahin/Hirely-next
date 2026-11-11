const BASE_URL = process.env.BASE_URL;

export const postAJob = async (job: object) => {
    const res = await fetch(`${BASE_URL}/jobs`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(job)
    })
}