"use client";
import { GitPullRequest, Cpu, MessageSquare } from "lucide-react";

const steps = [
    {
        step: "01",
        icon: GitPullRequest,
        title: "Connect your repository",
        content: (
            <div className="terminal-block mt-4">
                <p className="text-white/30">$ qivo connect</p>
                <p className="mt-2 text-white/70">
                    → Connected{" "}
                    <span className="text-glow-emerald">acme/frontend</span>
                </p>
                <p className="text-white/70">
                    → Connected{" "}
                    <span className="text-glow-emerald">acme/api-server</span>
                </p>
                <p className="text-white/70">
                    → Connected{" "}
                    <span className="text-glow-emerald">acme/auth-service</span>
                </p>
                <p className="mt-2 text-white/30">
                    3 repositories connected to GitHub ✓
                </p>
            </div>
        ),
    },
    {
        step: "02",
        icon: Cpu,
        title: "AI scans every PR automatically",
        content: (
            <div className="terminal-block mt-4 space-y-1.5">
                <p className="text-white/30">Scanning PR #142…</p>
                <p>
                    <span className="text-glow-red font-semibold">CRITICAL</span>{" "}
                    <span className="text-white/60">API key exposed in config</span>
                </p>
                <p>
                    <span className="text-glow-amber font-semibold">WARN</span>{" "}
                    <span className="text-white/60">Unused import on line 23</span>
                </p>
                <p>
                    <span className="text-glow-blue font-semibold">INFO</span>{" "}
                    <span className="text-white/60">Consider memoizing callback</span>
                </p>
                <p className="mt-2 text-white/30">
                    Risk score:{" "}
                    <span className="text-glow-amber font-bold">72/100</span>
                </p>
            </div>
        ),
    },
    {
        step: "03",
        icon: MessageSquare,
        title: "Review comments appear inline",
        content: (
            <div className="terminal-block mt-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-glow-purple flex items-center justify-center text-[10px] font-bold text-white">
                        Q
                    </div>
                    <span className="text-white/70 text-[11px] font-medium">
                        qivo-bot
                    </span>
                    <span className="text-white/30 text-[10px]">just now</span>
                </div>
                <p className="text-glow-red text-[11px] font-semibold">
                    🔴 Critical: API key exposed
                </p>
                <p className="text-white/50 text-[11px] mt-1 leading-relaxed">
                    Secret detected in{" "}
                    <code className="text-white/70">config/env.ts:14</code>. Move
                    to environment variables.
                </p>
                <p className="text-glow-blue text-[11px] mt-2 cursor-pointer hover:underline">
                    Apply fix →
                </p>
            </div>
        ),
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="relative py-32 px-6">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[500px] w-[600px] rounded-full bg-white/[0.015] blur-[130px]" />
            </div>

            <div className="relative mx-auto max-w-5xl">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-16">
                    <span className="pill-badge mb-4">How it works</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2">
                        <span className="gradient-text-bright">Up and running in minutes</span>
                    </h2>
                    <p className="text-white/40 mt-4 max-w-lg text-sm sm:text-base">
                        No config files. No YAML. Just connect and Qivo starts reviewing
                        every pull request automatically.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {steps.map((step) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.step}
                                className="glass-card rounded-2xl p-6 flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                                        <Icon className="h-4 w-4 text-white/60" />
                                    </div>
                                    <span className="font-mono text-3xl font-bold text-white/[0.06]">
                                        {step.step}
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-white">
                                    {step.title}
                                </p>
                                {step.content}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
