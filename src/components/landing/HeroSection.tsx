"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShootingStars } from "@/components/ui/shooting-stars";

export default function HeroSection() {
    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24">
            {/* Radial spotlight */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[600px] w-[900px] rounded-full bg-white/[0.03] blur-[120px]" />
            </div>
            <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2">
                <div className="h-[300px] w-[800px] bg-gradient-to-b from-white/[0.07] to-transparent blur-[80px]" />
            </div>

            {/* Dark container with shooting stars */}
            <div className="pointer-events-none absolute inset-0 rounded-none bg-zinc-950/60">
                <ShootingStars
                    starColor="#ffffff"
                    trailColor="#888888"
                    minSpeed={8}
                    maxSpeed={20}
                    minDelay={1500}
                    maxDelay={4000}
                    starWidth={12}
                    starHeight={1}
                />
                <ShootingStars
                    starColor="#cccccc"
                    trailColor="#555555"
                    minSpeed={6}
                    maxSpeed={15}
                    minDelay={2500}
                    maxDelay={5000}
                    starWidth={8}
                    starHeight={1}
                />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Main Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-4xl text-5xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-6xl md:text-7xl lg:text-8xl"
                >
                    <span
                        style={{
                            background: "linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        Review code
                    </span>
                    <br />
                    <span
                        style={{
                            background: "linear-gradient(135deg, #ffffff 30%, #606060 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        with clarity.
                    </span>
                </motion.h1>

                {/* Sub-headline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className="mt-6 max-w-xl text-base leading-relaxed text-white/50 sm:text-lg"
                >
                    Qivo integrates seamlessly with GitHub to deliver instant AI powered code reviews. Catching bugs, security vulnerabilities, and performance issues before they ship.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
                >
                    <Link
                        href="/sign-up"
                        className="group relative overflow-hidden rounded-xl bg-white px-7 py-3 text-sm font-medium text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                    >
                        Start for free
                        <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                    </Link>

                </motion.div>


            </div>

            {/* Bottom fade */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
        </section>
    );
}
