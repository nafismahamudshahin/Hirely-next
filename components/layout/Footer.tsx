import Image from "next/image";
import Link from "next/link";
import hirelyLogo from "@/public/images/hirelylogo2.png";

const columns = [
    {
        title: "Product",
        links: ["Job discovery", "Worker AI", "Companies", "Salary data"],
    },
    {
        title: "Navigations",
        links: ["Help center", "Career library", "Contact"],
    },
    {
        title: "Resources",
        links: ["Brand Guideline", "Newsroom"],
    },
];


const socials = [
    {
        label: "Facebook",
        href: "#",
        path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    },
    {
        label: "Discord",
        href: "#",
        path: "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z",
    },
    {
        label: "LinkedIn",
        href: "#",
        path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    },
];

export default function Footer() {
    return (
        <footer className="border-t border-white/[0.06] bg-black px-5 pb-8 pt-14 text-white sm:px-8 sm:pt-16">
            <div className="mx-auto max-w-[1180px]">
                <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] md:gap-x-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" aria-label="Hirely home" className="inline-flex items-center">
                            <Image src={hirelyLogo} alt="Hirely logo" className="h-5 w-auto sm:h-6" />
                        </Link>
                        <p className="mt-4 max-w-[260px] text-xs leading-5 text-white/40">
                            The AI-native career platform. Built for people who take their work
                            seriously.
                        </p>
                    </div>

                    {/* Link columns */}
                    {columns.map((col) => (
                        <nav key={col.title} aria-label={col.title}>
                            <h4 className="text-xs font-medium text-[#5b4bff]">{col.title}</h4>
                            <ul className="mt-4 space-y-3 sm:mt-5">
                                {col.links.map((l) => (
                                    <li key={l}>
                                        <Link
                                            href="#"
                                            className="text-xs text-white/40 transition-colors hover:text-white/80"
                                        >
                                            {l}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="mt-12 flex flex-col gap-5 border-t border-white/[0.06] pt-6 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
                    <ul className="flex items-center gap-2">
                        {socials.map(({ label, href, path }) => (
                            <li key={label}>
                                <a
                                    href={href}
                                    aria-label={label}
                                    className="inline-flex size-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
                                >
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="h-4 w-4"
                                    >
                                        <path d={path} />
                                    </svg>
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-col gap-2 text-[11px] text-white/35 sm:flex-row sm:items-center sm:gap-6">
                        <span>© 2026 Hirely. All rights reserved.</span>
                        <span className="flex items-center gap-2 text-white/50">
                            <Link href="#" className="transition-colors hover:text-white">
                                Terms &amp; Policy
                            </Link>
                            <span aria-hidden="true">·</span>
                            <Link href="#" className="transition-colors hover:text-white">
                                Privacy Guideline
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}