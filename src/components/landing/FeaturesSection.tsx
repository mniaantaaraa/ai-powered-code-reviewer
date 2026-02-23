"use client";
import { Bug, Shield, Sparkles, MessageCircle } from "lucide-react";

const features = [
    {
        Icon: Bug,
        title: "Automated Bug Detection",
        description:
            "Identifies logic errors, unsafe patterns, and edge cases before code is merged.",
        color: "text-glow-blue",
        hoverShadow:
            "hover:shadow-[0_0_30px_rgba(96,165,250,0.15)]",
    },
    {
        Icon: Shield,
        title: "Security Analysis",
        description:
            "Scans pull requests for vulnerabilities, insecure dependencies, and common attack vectors.",
        color: "text-glow-red",
        hoverShadow:
            "hover:shadow-[0_0_30px_rgba(248,113,113,0.15)]",
    },
    {
        Icon: Sparkles,
        title: "Code Quality Insights",
        description:
            "Evaluates structure, maintainability, and best practices with clear, actionable feedback.",
        color: "text-glow-purple",
        hoverShadow:
            "hover:shadow-[0_0_30px_rgba(167,139,250,0.15)]",
    },
    {
        Icon: MessageCircle,
        title: "Inline PR Comments",
        description:
            "Every finding is posted directly to your pull request with line-level context and a suggested fix.",
        color: "text-glow-emerald",
        hoverShadow:
            "hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]",
    },
];

export default function FeaturesSection() {
    return (
        <section id="features" className="relative px-6 py-32 pb-64">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-16">
                    <span className="pill-badge mb-4">Features</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2">
                        <span className="gradient-text-bright">
                            Everything you need for reliable{" "}
                            <br className="hidden sm:block" />
                            pull request reviews.
                        </span>
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map(({ Icon, title, description, color, hoverShadow }) => (
                        <div
                            key={title}
                            className={`glass-card rounded-2xl p-6 flex flex-col transition-shadow ${hoverShadow}`}
                        >
                            <Icon className={`w-8 h-8 ${color} mb-4`} />
                            <h3 className="text-white font-semibold mb-2">{title}</h3>
                            <p className="text-white/50 text-sm leading-relaxed">
                                {description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
