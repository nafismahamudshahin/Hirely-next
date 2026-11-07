import { ArrowRight, Building2, CircleDollarSign, MapPin } from "lucide-react";

const jobs = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    title: "Frontend Developer",
    description:
        "Showcase your commitment to diversity and inclusion by highlighting initiatives",
    location: "New York, USA",
    type: "Hybrid",
    salary: "€25–€40/hour",
}));

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-2 font-mono text-[11px] font-normal tracking-[0.12em] text-white/60">
            <span aria-hidden="true" className="size-1.5 bg-[#5b4bff]" />
            {children}
            <span aria-hidden="true" className="size-1.5 bg-[#5b4bff]" />
        </span>
    );
}

function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-white/65">
            {children}
        </span>
    );
}

export default function JobCards() {
    return (
        <section id="jobs" className="bg-black px-5 py-20 text-white sm:px-8 sm:py-24">
            <div className="mx-auto max-w-[1180px]">
                <div className="flex flex-col items-center text-center">
                    <SectionLabel>SMART JOB DISCOVERY</SectionLabel>
                    <h2 className="mt-5 max-w-xl text-balance text-[30px] font-medium leading-[1.12] tracking-tight sm:text-[42px]">
                        The roles you&apos;d never
                        <br />
                        find by searching
                    </h2>
                </div>

                <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                    {jobs.map((job) => (
                        <article
                            key={job.id}
                            className="flex min-h-[200px] flex-col rounded-xl border border-white/[0.07] bg-[#121214] p-5 transition-colors hover:border-white/[0.14] sm:p-6"
                        >
                            <h3 className="text-xl font-medium tracking-tight">{job.title}</h3>
                            <p className="mt-2 max-w-[300px] text-xs leading-5 text-white/45">
                                {job.description}
                            </p>

                            <div className="mt-5 flex flex-wrap gap-2">
                                <Pill>
                                    <MapPin aria-hidden="true" className="h-3 w-3 text-[#a78bfa]" />
                                    {job.location}
                                </Pill>
                                <Pill>
                                    <Building2 aria-hidden="true" className="h-3 w-3 text-[#a78bfa]" />
                                    {job.type}
                                </Pill>
                                <Pill>
                                    <CircleDollarSign aria-hidden="true" className="h-3 w-3 text-[#e879f9]" />
                                    {job.salary}
                                </Pill>
                            </div>

                            <a
                                href="#jobs"
                                className="mt-auto inline-flex items-center gap-2 pt-6 text-xs font-medium text-white/80 transition-colors hover:text-white"
                            >
                                Apply Now
                                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                            </a>
                        </article>
                    ))}
                </div>

                <div className="mt-10 flex justify-center">
                    <a
                        href="#jobs"
                        className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-7 text-sm font-medium text-black transition-colors hover:bg-white/90"
                    >
                        View all job open
                    </a>
                </div>
            </div>
        </section>
    );
}