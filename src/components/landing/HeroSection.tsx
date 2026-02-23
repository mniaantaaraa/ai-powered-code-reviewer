"use client";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
            {/* Soft radial spotlight */}
            <div className="radial-glow absolute inset-0" />

            {/* Top gradient wash */}
            <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2">
                <div className="h-[320px] w-[900px] bg-gradient-to-b from-white/[0.06] to-transparent blur-[90px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.08]">
                    <span className="text-white">Review code</span>
                    <br />
                    <span className="gradient-text-bright">with clarity.</span>
                </h1>

                <p className="mt-6 text-base sm:text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
                    Qivo integrates seamlessly with GitHub to deliver instant AI&#8209;powered
                    code reviews. Catching bugs, security vulnerabilities, and performance
                    issues before they ship.
                </p>

                <div className="mt-10">
                    <Link
                        href="/sign-up"
                        className="inline-flex items-center bg-white text-black px-7 py-3 rounded-full font-medium text-sm hover:bg-white/90 transition-colors"
                    >
                        Start for free
                        <span className="ml-2">→</span>
                    </Link>
                </div>
            </div>

            {/* Bottom fade */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
        </section>
    );
}
