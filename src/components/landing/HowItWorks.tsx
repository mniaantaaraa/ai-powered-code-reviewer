"use client";
import { motion } from "framer-motion";
import { GitPullRequest, Cpu, MessageSquare } from "lucide-react";

const steps = [
    {
        number: "01",
        icon: GitPullRequest,
        title: "Connect your repository",
        description:
            "Install the Qivo GitHub App in under 60 seconds. It immediately begins monitoring every pull request across your org with zero config required.",
        visual: (
            <div className="rounded-xl border border-white/[0.07] bg-black/50 p-4 font-mono text-[11px] leading-5">
                <div className="mb-2 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-white/30">github.com / orgs / acme / installations</span>
                </div>
                <div className="space-y-1 text-white/40">
                    <div><span className="text-blue-400">repo</span> acme/backend <span className="text-emerald-400 ml-2">connected</span></div>
                    <div><span className="text-blue-400">repo</span> acme/frontend <span className="text-emerald-400 ml-2">connected</span></div>
                    <div><span className="text-blue-400">repo</span> acme/infra <span className="text-emerald-400 ml-2">connected</span></div>
                </div>
            </div>
        ),
    },
    {
        number: "02",
        icon: Cpu,
        title: "AI scans every PR automatically",
        description:
            "When a pull request opens, Qivo runs a full AI analysis across your diff, checking for bugs, security flaws, performance regressions, and style violations.",
        visual: (
            <div className="rounded-xl border border-white/[0.07] bg-black/50 p-4 font-mono text-[11px] leading-relaxed space-y-1.5">
                <div className="text-white/25">Analyzing PR #312 feat/payments ...</div>
                <div className="text-red-400">  CRITICAL  Line 88: API key hardcoded</div>
                <div className="text-amber-400">  WARN      Line 104: No input validation</div>
                <div className="text-blue-400">  INFO      Line 217: N+1 query pattern</div>
                <div className="mt-2 text-white/25">Risk score computed: <span className="text-red-400 font-semibold">91</span> / 100</div>
            </div>
        ),
    },
    {
        number: "03",
        icon: MessageSquare,
        title: "Review comments appear inline",
        description:
            "Qivo posts precise, line-level comments directly to your GitHub PR. Each comment explains the issue, its severity, and offers an AI-generated fix you can apply with one click.",
        visual: (
            <div className="rounded-xl border border-white/[0.07] bg-black/50 p-4 text-[11px] leading-relaxed">
                <div className="flex items-start gap-2.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[7px] font-bold text-black">Q</div>
                    <div>
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="font-medium text-white/60">qivo-bot</span>
                            <span className="rounded-full bg-blue-500/15 border border-blue-500/20 px-1.5 text-[9px] text-blue-300">bot</span>
                        </div>
                        <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2.5 text-white/50 leading-relaxed">
                            <span className="text-red-400 font-medium">Critical</span> Line 88: API key exposed in source.
                            Move to <code className="bg-white/10 px-1 rounded font-mono">process.env.STRIPE_KEY</code>.{" "}
                            <span className="text-blue-400 cursor-pointer">Apply fix</span>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="relative px-6 py-28">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[500px] w-[600px] rounded-full bg-white/[0.015] blur-[130px]" />
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
                        How it works
                    </div>
                    <h2
                        className="pb-2 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
                        style={{
                            background: "linear-gradient(135deg, #ffffff 0%, #888888 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        Up and running in minutes
                    </h2>
                    <p className="mt-4 mx-auto max-w-lg text-sm text-white/40 sm:text-base">
                        No config files. No YAML. Just connect and Qivo starts reviewing every pull request automatically.
                    </p>
                </motion.div>

                <div className="relative space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.55, delay: i * 0.12 }}
                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#080808] p-6 transition-all duration-300 hover:border-white/20"
                            >
                                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.025] to-transparent" />
                                </div>

                                <div className="relative">
                                    {/* Step number + icon */}
                                    <div className="mb-5 flex items-center justify-between">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                                            <Icon className="h-4 w-4 text-white/60" />
                                        </div>
                                        <span className="font-mono text-3xl font-bold text-white/[0.06]">{step.number}</span>
                                    </div>
                                    <div className="mb-2 text-sm font-medium text-white">{step.title}</div>
                                    <p className="mb-5 text-xs leading-relaxed text-white/40">{step.description}</p>
                                    {step.visual}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
