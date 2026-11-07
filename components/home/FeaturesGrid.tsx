import {
    BarChart3,
    Bookmark,
    Building2,
    FileText,
    Hexagon,
    MousePointerClick,
    Search,
    TrendingUp,
} from "lucide-react";

const features = [
    { title: "Smart Search", description: "Find your ideal job with advanced filters.", Icon: Search },
    { title: "Salary Insights", description: "Get real salary data to negotiate confidently.", Icon: BarChart3 },
    { title: "Top Companies", description: "Apply to vetted companies that are hiring.", Icon: Building2 },
    { title: "Saved Jobs", description: "Manage apps & favorites on your dashboard.", Icon: Bookmark },
    { title: "One-Click Apply", description: "Simplify your job applications for an easier process!", Icon: MousePointerClick },
    { title: "Resume Builder", description: "Create professional resumes with modern templates.", Icon: FileText },
    { title: "Skill-Based Matching", description: "Discover jobs that match your skills and experience.", Icon: Hexagon },
    { title: "Career Growth Resources", description: "Boost your career with quick interview tips.", Icon: TrendingUp },
];

export default function FeaturesGrid() {
    return (
        <section id="company" className="bg-[#0c0c0e] px-5 py-20 text-white sm:px-8 sm:py-24">
            <div className="mx-auto max-w-[1180px]">
                <div className="flex flex-col items-center text-center">
                    <span className="inline-flex items-center gap-2 font-mono text-[11px] font-normal tracking-[0.12em] text-white/60">
                        <span aria-hidden="true" className="size-1.5 bg-[#5b4bff]" />
                        FEATURES JOB
                        <span aria-hidden="true" className="size-1.5 bg-[#5b4bff]" />
                    </span>
                    <h2 className="mt-5 max-w-xl text-balance text-[30px] font-medium leading-[1.12] tracking-tight sm:text-[42px]">
                        Everything you need
                        <br />
                        to succeed
                    </h2>
                </div>

                <div className="mt-14 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map(({ title, description, Icon }) => (
                        <article key={title} className="flex items-start gap-4">
                            <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-b from-[#1c1c20] to-[#0f0f12] text-white/85 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                                <Icon aria-hidden="true" className="h-5 w-5" />
                            </span>
                            <div className="pt-0.5">
                                <h3 className="text-sm font-medium text-white">{title}</h3>
                                <p className="mt-1.5 text-xs leading-5 text-white/45">{description}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}