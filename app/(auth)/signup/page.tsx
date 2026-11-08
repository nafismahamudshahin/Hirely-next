import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import hirelyLogo from "@/public/images/hirelylogo2.png";
import SignupForm from "@/components/authentications/SignUpForm";


export const metadata: Metadata = {
    title: "Create your account | Hirely",
    description: "Join Hirely as a job seeker, recruiter or admin.",
};

export default function SignupPage() {
    return (
        <main className="relative isolate flex min-h-svh flex-col items-center overflow-hidden bg-[#050507] px-4 py-10 text-white sm:py-14">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(91,75,255,0.18)_0%,rgba(5,5,7,0)_60%)]"
            />

            <Link href="/" aria-label="Hirely home" className="mb-8 inline-flex">
                <Image src={hirelyLogo} alt="Hirely logo" priority className="h-8 w-auto" />
            </Link>

            <div className="w-full max-w-[560px] rounded-2xl border border-white/10 bg-[#0d0d11]/90 p-5 shadow-[0_16px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        Create your account
                    </h1>
                    <p className="mt-2 text-sm text-white/50">
                        Choose how you&apos;ll use Hirely and get started in minutes.
                    </p>
                </div>

                <SignupForm />
            </div>
        </main>
    );
}