"use client";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function AnimatedCounter({ from, to, duration = 2.2, delay = 0.3 }: { from: number; to: number; duration?: number; delay?: number }) {
    const count = useMotionValue(from);
    const rounded = useTransform(count, (v) => Math.round(v));
    const [displayVal, setDisplayVal] = useState(from);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (!isInView) return;
        const timer = setTimeout(() => {
            const controls = animate(count, to, { duration, ease: "easeOut" });
            return controls.stop;
        }, delay * 1000);
        return () => clearTimeout(timer);
    }, [isInView]);

    useEffect(() => {
        const unsub = rounded.on("change", (v) => setDisplayVal(v));
        return unsub;
    }, [rounded]);

    return (
        <span ref={ref} className="tabular-nums">
            {displayVal}
        </span>
    );
}

const riskLevels = [
    { range: "0–30", label: "Low", color: "#22c55e", description: "Safe to merge" },
    { range: "31–60", label: "Medium", color: "#f59e0b", description: "Review suggested" },
    { range: "61–80", label: "High", color: "#f97316", description: "Requires attention" },
    { range: "81–100", label: "Critical", color: "#ef4444", description: "Block & fix" },
];

const stats = [
    { value: 94, suffix: "%", label: "Bug detection rate" },
    { value: 67, suffix: "%", label: "Faster code reviews" },
    { value: 3, suffix: "x", label: "Fewer security incidents" },
];

export default function MetricSection() {
    return (
        <section className="relative px-6 py-28">
            {/* Background radial glow */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div
                    className="h-[500px] w-[500px] rounded-full opacity-40"
                    style={{
                        background: "radial-gradient(circle, rgba(239,68,68,0.08) 0%, rgba(239,68,68,0.02) 50%, transparent 70%)",
                    }}
                />
            </div>

            <div className="relative mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/40">
                        Risk Scoring
                    </div>
                    <h2
                        className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
                        style={{
                            background: "linear-gradient(135deg, #ffffff 0%, #888888 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        Every PR gets a Risk Score
                    </h2>
                    <p className="mt-4 mx-auto max-w-lg text-sm text-white/40 sm:text-base">
                        A single number that tells you exactly how dangerous a pull request is, powered by AI analysis across hundreds of heuristics.
                    </p>
                </motion.div>

                {/* Main metric display */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
                    {/* Score meter */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.7 }}
                        className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 text-center"
                    >
                        {/* Radial background */}
                        <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                                background: "radial-gradient(ellipse at 50% 60%, rgba(239,68,68,0.06) 0%, transparent 65%)",
                            }}
                        />

                        <div className="relative">
                            <div className="mb-2 text-xs font-medium uppercase tracking-widest text-white/25">Risk Score</div>

                            {/* Giant counter */}
                            <div
                                className="text-[120px] font-bold leading-none tracking-tighter sm:text-[140px]"
                                style={{
                                    background: "radial-gradient(ellipse at center, #ef4444 0%, #dc2626 40%, #9f1239 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                    filter: "drop-shadow(0 0 40px rgba(239,68,68,0.3))",
                                }}
                            >
                                <AnimatedCounter from={0} to={87} duration={2.5} delay={0.4} />
                            </div>

                            <div className="mt-1 text-sm font-medium text-red-400 tracking-wide">CRITICAL RISK</div>

                            {/* Progress bar */}
                            <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                                <motion.div
                                    initial={{ width: "0%" }}
                                    whileInView={{ width: "87%" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 2.5, delay: 0.6, ease: "easeOut" }}
                                    className="h-full rounded-full"
                                    style={{
                                        background: "linear-gradient(90deg, #22c55e, #f59e0b 40%, #ef4444 100%)",
                                    }}
                                />
                            </div>
                            <div className="mt-2 flex justify-between text-[10px] text-white/20">
                                <span>0</span>
                                <span>50</span>
                                <span>100</span>
                            </div>

                            <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 text-left text-xs text-white/40 leading-relaxed">
                                PR #247 · feat/auth-refresh-token · 4 critical issues detected · Merge blocked
                            </div>
                        </div>
                    </motion.div>

                    {/* Risk level breakdown */}
                    <div className="flex flex-col gap-4">
                        {riskLevels.map((level, i) => (
                            <motion.div
                                key={level.label}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-[#0a0a0a] px-5 py-4"
                            >
                                <div
                                    className="h-2 w-2 shrink-0 rounded-full"
                                    style={{ backgroundColor: level.color, boxShadow: `0 0 8px ${level.color}50` }}
                                />
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-white/80">{level.label}</div>
                                    <div className="text-xs text-white/35">{level.description}</div>
                                </div>
                                <div className="text-xs font-mono text-white/25">{level.range}</div>
                            </motion.div>
                        ))}

                        {/* Real stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="grid grid-cols-3 gap-3 rounded-xl border border-white/[0.07] bg-[#0a0a0a] p-4"
                        >
                            {stats.map((stat, i) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-2xl font-semibold text-white">
                                        <AnimatedCounter from={0} to={stat.value} duration={1.8} delay={0.8 + i * 0.15} />
                                        <span>{stat.suffix}</span>
                                    </div>
                                    <div className="mt-1 text-[10px] text-white/30 leading-tight">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
