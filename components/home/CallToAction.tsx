import Image from "next/image";
import Link from "next/link";

function GridBackground() {
    return (
        <>
            <Image
                src="/images/cta-bg.png"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-[center_35%] opacity-60"
            />
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black to-transparent"
            />
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(73,64,255,0.16),transparent_55%)]"
            />
        </>
    );
}

export default function CallToAction() {
    return (
        <section className="relative isolate overflow-hidden bg-black">
            <div aria-hidden="true" className="absolute inset-0 -z-10 h-full">
                <GridBackground />
            </div>

            <div className="mx-auto flex min-h-[470px] w-full max-w-[900px] flex-col items-center justify-center px-5 py-20 text-center sm:min-h-[540px] sm:max-w-[1050px] sm:px-8 sm:py-24">
                <h2 className="max-w-3xl text-balance text-[36px] font-medium leading-[1.12] tracking-tight text-white sm:max-w-none sm:text-[48px] md:text-[54px]">
                    Your next role is
                    <br />
                    already looking for you
                </h2>

                <p className="mt-5 max-w-md text-sm text-white/50 sm:max-w-none sm:text-base">
                    Build a profile in three minutes. The matches start arriving tomorrow
                    morning.
                </p>

                <div className="mt-8 flex w-full max-w-xs flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
                    <Link
                        href="/signup"
                        className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-6 text-sm font-medium text-black transition-colors hover:bg-white/90 sm:min-w-[190px]"
                    >
                        Create a free account
                    </Link>
                    <Link
                        href="/pricing"
                        className="inline-flex h-11 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] px-6 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/[0.09] sm:min-w-[130px]"
                    >
                        View pricing
                    </Link>
                </div>
            </div>
        </section>
    );
}