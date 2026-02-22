"use client";
import { motion } from "framer-motion";
import { Bug, ShieldCheck, Sparkles, MessageSquare } from "lucide-react";

const features = [
    {
        icon: Bug,
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-400",
        title: "Automated Bug Detection",
        description:
            "Identifies logic errors, unsafe patterns, and edge cases before code is merged.",
    },
    {
        icon: ShieldCheck,
        iconBg: "bg-red-500/10",
        iconColor: "text-red-400",
        title: "Security Analysis",
        description:
            "Scans pull requests for vulnerabilities, insecure dependencies, and common attack vectors.",
    },
    {
        icon: Sparkles,
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-400",
        title: "Code Quality Insights",
        description:
            "Evaluates structure, maintainability, and best practices with clear, actionable feedback.",
    },
    {
        icon: MessageSquare,
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-400",
        title: "Inline PR Comments",
        description:
            "Every finding is posted directly to your pull request with line-level context and a suggested fix.",
    },
];

export default function FeaturesSection() {
    return (
        <section id="features" className="relative px-6 py-32">
            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/40">
                        Features
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
                        Everything you need for reliable pull request reviews.
                    </h2>
                </motion.div>

                {/* 4-column icon grid */}
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="flex flex-col gap-4"
                            >
                                {/* Icon */}
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${feature.iconBg}`}
                                >
                                    <Icon className={`h-5 w-5 ${feature.iconColor}`} />
                                </div>

                                {/* Text */}
                                <div className="space-y-2">
                                    <h3 className="text-base font-semibold text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-white/50">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
