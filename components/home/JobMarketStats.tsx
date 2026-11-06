import Image from "next/image";
import { Briefcase, Building2, Star, UsersRound } from "lucide-react";

const stats = [
    { value: "50K", label: "Active Jobs", Icon: Briefcase },
    { value: "12K", label: "Companies", Icon: Building2 },
    { value: "2M", label: "Job Seekers", Icon: UsersRound },
    { value: "97%", label: "Satisfaction Rate", Icon: Star },
];

export default function JobMarketStats() {
    return (
        <section className="relative isolate w-full overflow-hidden bg-[#050507] text-white">
            <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6">
                {/* Globe + headline */}
                <div className="relative mt-6 h-[300px] sm:mt-10 sm:h-[400px] lg:mt-12 lg:h-[480px]">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_14%,black_100%)]"
                    >
                        <Image
                            src="/images/globe.png"
                            alt=""
                            fill
                            priority
                            sizes="(max-width: 640px) 100vw, 1180px"
                            className="object-cover object-[center_70%] sm:object-[center_52%]"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050507] via-[#050507]/60 to-transparent" />
                    </div>

                    <p className="absolute inset-x-4 top-[38%] z-[1] mx-auto max-w-md text-center text-xl font-light leading-snug tracking-tight text-white/60 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:top-[40%] sm:text-3xl lg:text-[34px]">
                        Assisting over{" "}
                        <span className="font-medium text-white">15,000 job seekers</span>
                        <br />
                        find their dream positions.
                    </p>
                </div>

                {/* Stats: overlap the globe on larger screens, flow below on mobile */}
                <div className="relative z-10 -mt-8 grid grid-cols-2 gap-2.5 pb-12 sm:-mt-20 sm:grid-cols-4 sm:gap-4 sm:pb-16 lg:-mt-28 lg:gap-5">
                    {stats.map(({ value, label, Icon }) => (
                        <div
                            key={label}
                            className="rounded-xl border border-white/10 bg-gradient-to-b from-[#050506]/95 to-[#18181b]/95 px-4 py-4 text-left shadow-[0_12px_35px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:rounded-2xl sm:px-5 sm:py-5 lg:px-6 lg:py-6"
                        >
                            <Icon
                                aria-hidden="true"
                                className="mb-6 h-4 w-4 text-white/80 sm:mb-8 lg:mb-10"
                            />
                            <p className="text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
                                {value}
                            </p>
                            <p className="mt-1.5 text-[11px] text-white/65 sm:text-xs">{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}