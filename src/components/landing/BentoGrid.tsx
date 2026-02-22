"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Bug, Lightbulb, Zap, GitPullRequest, Lock } from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
    }),
};

function BentoCard({
    children,
    className = "",
    index = 0,
}: {
    children: React.ReactNode;
    className?: string;
    index?: number;
}) {
    return (
        <motion.div
            custom={index}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ scale: 1.01 }}
            className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#080808] p-6 transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.04)] ${className}`}
        >
            {/* Hover glow */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
            </div>
            {children}
        </motion.div>
    );
}

const codeSnippet = `function validateToken(token: string) {
  // ❌ Issue: No expiry check
  const decoded = jwt.decode(token)
  return decoded.userId

  // ✅ Qivo Fix:
  // const decoded = jwt.verify(token,
  //   process.env.JWT_SECRET!)
}`;

export default function BentoGrid() {
    return (
        <section className="relative px-6 py-24">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[500px] w-[700px] rounded-full bg-white/[0.02] blur-[120px]" />
            </div>

            <div className="relative mx-auto max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-14 text-center"
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/40">
                        Features
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
                        Built for production-grade teams
                    </h2>
                    <p className="mt-4 mx-auto max-w-lg text-sm text-white/40 sm:text-base">
                        Qivo doesn't just flag issues — it understands context, explains its reasoning, and suggests precise fixes.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Large card — Bug Detection */}
                    <BentoCard className="sm:col-span-2 lg:col-span-2" index={0}>
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
                                <Bug className="h-4 w-4 text-red-400" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">Automated Bug Detection</div>
                                <div className="text-xs text-white/35">Catches issues humans miss every time</div>
                            </div>
                        </div>
                        {/* Code snippet */}
                        <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-black/60 p-4">
                            <pre className="font-mono text-[11px] leading-5 text-white/55 sm:text-xs">
                                <code>{codeSnippet}</code>
                            </pre>
                            {/* Gradient fade */}
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {["JWT Vulnerability", "Missing Error Handling", "Type Safety", "Memory Leaks"].map((tag) => (
                                <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] text-white/40">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </BentoCard>

                    {/* Security Guardrails */}
                    <BentoCard index={1}>
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                            <ShieldCheck className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="mb-2 text-sm font-medium text-white">Security Guardrails</div>
                        <p className="text-xs leading-relaxed text-white/40">
                            OWASP Top 10, secrets detection, injection vulnerabilities — all caught before merge.
                        </p>
                        <div className="mt-5 space-y-2">
                            {[
                                { label: "Hardcoded Secrets", status: "blocked", color: "text-red-400" },
                                { label: "SQL Injection Risk", status: "blocked", color: "text-red-400" },
                                { label: "CORS Misconfiguration", status: "flagged", color: "text-amber-400" },
                                { label: "XSS Vector", status: "clean", color: "text-emerald-400" },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.025] px-3 py-2">
                                    <span className="text-[11px] text-white/50">{item.label}</span>
                                    <span className={`text-[10px] font-medium uppercase tracking-wide ${item.color}`}>{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </BentoCard>

                    {/* Detailed Suggestions */}
                    <BentoCard index={2}>
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
                            <Lightbulb className="h-5 w-5 text-amber-400" />
                        </div>
                        <div className="mb-2 text-sm font-medium text-white">Detailed Suggestions</div>
                        <p className="text-xs leading-relaxed text-white/40">
                            Every issue comes with line-level context, explanation, and a one-click AI fix.
                        </p>
                        <div className="mt-5 rounded-xl border border-white/[0.07] bg-black/40 p-3">
                            <div className="flex items-start gap-2">
                                <span className="mt-0.5 text-amber-400">⚠</span>
                                <div>
                                    <div className="text-[11px] font-medium text-white/70">useEffect missing dependency</div>
                                    <div className="mt-1 text-[10px] text-white/35">
                                        Add <code className="rounded bg-white/10 px-1 py-0.5 font-mono">userId</code> to the dependency array to prevent stale closures on re-render.
                                    </div>
                                    <button className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[10px] font-medium text-amber-300 transition hover:bg-amber-500/20">
                                        <Zap className="h-2.5 w-2.5" />
                                        Apply AI Fix
                                    </button>
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* PR Integration */}
                    <BentoCard className="sm:col-span-2" index={3}>
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10">
                            <GitPullRequest className="h-5 w-5 text-purple-400" />
                        </div>
                        <div className="mb-2 text-sm font-medium text-white">Native PR Integration</div>
                        <p className="mb-5 text-xs leading-relaxed text-white/40">
                            Review comments appear directly on GitHub, GitLab, or Bitbucket. Zero workflow changes for your team.
                        </p>
                        {/* PR comment mockup */}
                        <div className="rounded-xl border border-white/[0.07] bg-black/40 p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[8px] font-bold text-black">Q</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-medium text-white/70">qivo-bot</span>
                                        <span className="rounded-full bg-blue-500/15 border border-blue-500/20 px-1.5 py-0.5 text-[9px] text-blue-300">bot</span>
                                    </div>
                                    <div className="mt-1.5 rounded-lg bg-white/[0.03] border border-white/5 p-2.5">
                                        <div className="text-[11px] text-white/60 leading-relaxed">
                                            <span className="text-red-400 font-medium">Critical · Line 42</span> — JWT secret is hardcoded.
                                            Use environment variable <code className="bg-white/10 px-1 rounded font-mono">process.env.JWT_SECRET</code> instead.{" "}
                                            <span className="text-blue-400 cursor-pointer hover:underline">Apply fix →</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Policy enforcement */}
                    <BentoCard index={4}>
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                            <Lock className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="mb-2 text-sm font-medium text-white">Policy Enforcement</div>
                        <p className="text-xs leading-relaxed text-white/40">
                            Set custom rules, block merges above a risk score threshold, and automate compliance checks.
                        </p>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.025] px-3 py-2">
                                <span className="text-[11px] text-white/50">Block on score &gt; 80</span>
                                <div className="relative h-4 w-8 rounded-full bg-emerald-500/30">
                                    <div className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full bg-emerald-400" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.025] px-3 py-2">
                                <span className="text-[11px] text-white/50">Auto-suggest fixes</span>
                                <div className="relative h-4 w-8 rounded-full bg-emerald-500/30">
                                    <div className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full bg-emerald-400" />
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                </div>
            </div>
        </section>
    );
}
