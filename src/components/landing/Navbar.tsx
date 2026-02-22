"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50"
        >
            <div className="mx-auto max-w-7xl px-6 py-4">
                <div className="relative flex items-center justify-between rounded-2xl border border-white/10 bg-black/80 px-6 py-3 backdrop-blur-xl">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold tracking-tight text-white">Qivo</span>
                    </div>

                    {/* Nav Links — absolutely centered */}
                    <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
                        {[
                            { label: "How it works", href: "#how-it-works" },
                            { label: "Features", href: "#features" },
                        ].map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="text-sm text-white/50 transition-colors duration-200 hover:text-white"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* CTAs */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/sign-in"
                            className="hidden text-sm text-white/60 transition-colors hover:text-white md:block"
                        >
                            Sign in
                        </Link>
                        <Link
                            href="/sign-up"
                            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-all duration-200 hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            Start for free
                        </Link>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
