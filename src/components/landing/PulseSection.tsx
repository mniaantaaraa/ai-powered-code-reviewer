"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const terminalLines = [
    { delay: 0, prefix: "qivo", color: "text-emerald-400", text: " Scanning PR #247 — feat/auth-refresh-token" },
    { delay: 600, prefix: "$", color: "text-white/40", text: " Analyzing 8 changed files..." },
    { delay: 1400, prefix: "→", color: "text-blue-400", text: " src/auth/tokenService.ts  [3 issues]" },
    { delay: 2000, prefix: "  ✗", color: "text-red-400", text: " Line 42: JWT secret hardcoded in source" },
    { delay: 2500, prefix: "  ✗", color: "text-amber-400", text: " Line 67: Token expiry not validated on refresh" },
    { delay: 3000, prefix: "  ✗", color: "text-amber-400", text: " Line 89: No rate limiting on /auth/refresh endpoint" },
    { delay: 3800, prefix: "→", color: "text-blue-400", text: " src/middleware/cors.ts  [1 issue]" },
    { delay: 4300, prefix: "  ✗", color: "text-red-400", text: " Line 12: Wildcard CORS origin in production config" },
    { delay: 5200, prefix: "qivo", color: "text-emerald-400", text: " Computing Risk Score..." },
    { delay: 6000, prefix: "●", color: "text-red-400", text: " RISK SCORE: 87 / 100  ─── CRITICAL" },
    { delay: 6600, prefix: "→", color: "text-white/60", text: " 2 suggestions auto-applied via AI fix" },
    { delay: 7200, prefix: "✓", color: "text-emerald-400", text: " Detailed review posted to GitHub PR #247" },
];

function TerminalLine({
    line,
    isVisible,
    globalIndex,
}: {
    line: (typeof terminalLines)[0];
    isVisible: boolean;
    globalIndex: number;
}) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!isVisible) return;
        const timer = setTimeout(() => setShow(true), line.delay);
        return () => clearTimeout(timer);
    }, [isVisible, line.delay]);

    if (!show) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="flex gap-2 font-mono text-xs sm:text-sm leading-relaxed"
        >
            <span className={`shrink-0 ${line.color} font-medium`}>{line.prefix}</span>
            <span className="text-white/70">{line.text}</span>
        </motion.div>
    );
}

function BlinkingCursor() {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const interval = setInterval(() => setVisible((v) => !v), 500);
        return () => clearInterval(interval);
    }, []);
    return (
        <span className={`inline-block h-3.5 w-0.5 bg-white/60 ${visible ? "opacity-100" : "opacity-0"}`} />
    );
}

export default function PulseSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [restartKey, setRestartKey] = useState(0);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        if (isInView && !animating) {
            setAnimating(true);
        }
    }, [isInView]);

    useEffect(() => {
        if (!animating) return;
        const lastDelay = terminalLines[terminalLines.length - 1].delay;
        const timer = setTimeout(() => {
            setRestartKey((k) => k + 1);
            setAnimating(false);
            setTimeout(() => setAnimating(true), 400);
        }, lastDelay + 3000);
        return () => clearTimeout(timer);
    }, [animating, restartKey]);

    return (
        <section ref={ref} className="relative py-32 px-6">
            {/* Subtle background glow */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[400px] w-[600px] rounded-full bg-emerald-500/[0.03] blur-[100px]" />
            </div>

            <div className="relative mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/40">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                        Live Activity
                    </div>
                    <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl" style={{
                        background: "linear-gradient(135deg, #ffffff 0%, #888888 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}>
                        Watch Qivo work in real-time
                    </h2>
                    <p className="mt-4 text-white/40 mx-auto max-w-lg text-sm sm:text-base">
                        Every pull request is automatically scanned. Issues surface before your team even glances at the diff.
                    </p>
                </motion.div>

                {/* Terminal window */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]"
                >
                    {/* Terminal chrome */}
                    <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-3.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                        <span className="ml-3 text-xs text-white/25 font-mono">qivo · PR Scanner · watch mode</span>
                    </div>

                    {/* Terminal body */}
                    <div className="min-h-[320px] space-y-2 p-6">
                        {animating &&
                            terminalLines.map((line, i) => (
                                <TerminalLine
                                    key={`${restartKey}-${i}`}
                                    line={line}
                                    isVisible={animating}
                                    globalIndex={i}
                                />
                            ))}
                        <div className="flex gap-2 font-mono text-xs sm:text-sm">
                            <span className="text-white/25">$</span>
                            <BlinkingCursor />
                        </div>
                    </div>

                    {/* Bottom glow accent */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-emerald-500/[0.04] to-transparent" />
                </motion.div>
            </div>
        </section>
    );
}
