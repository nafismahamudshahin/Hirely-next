// Save as app/loading.tsx: shown while any page under app/ is loading.
export default function Loading() {
    return (
        <div
            role="status"
            aria-live="polite"
            className="relative isolate flex min-h-[calc(100svh-5rem)] w-full flex-col items-center justify-center gap-6 overflow-hidden bg-[#050507] px-4 text-white"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(91,75,255,0.22)_0%,rgba(5,5,7,0)_65%)]"
            />

            <div aria-hidden="true" className="relative size-16">
                <span className="absolute inset-0 rounded-full border-2 border-white/10" />
                <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#5b4bff] border-r-[#5b4bff]/40 motion-reduce:animate-none" />
                <span className="absolute inset-3 animate-pulse rounded-full bg-[#5b4bff]/30 blur-md motion-reduce:animate-none" />
                <span className="absolute inset-[26px] rounded-full bg-[#7a73ff]" />
            </div>

            <p className="flex items-baseline text-sm text-white/60">
                Loading
                <span aria-hidden="true" className="ml-0.5 inline-flex w-5">
                    <span className="animate-bounce [animation-delay:0ms] motion-reduce:animate-none">.</span>
                    <span className="animate-bounce [animation-delay:150ms] motion-reduce:animate-none">.</span>
                    <span className="animate-bounce [animation-delay:300ms] motion-reduce:animate-none">.</span>
                </span>
            </p>
        </div>
    );
}