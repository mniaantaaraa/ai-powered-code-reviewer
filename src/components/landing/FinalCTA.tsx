"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function FinalCTA() {
    return (
        <section className="px-6 py-6 pb-64">
            <div className="rounded-2xl bg-zinc-900 px-8 py-20 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                    className="text-3xl font-semibold text-white sm:text-4xl"
                >
                    Catch issues before they reach production.
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.12 }}
                    className="mt-4 text-sm text-white/40"
                >
                    Qivo connects to your repository and starts reviewing pull requests instantly.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.24 }}
                    className="mt-8"
                >
                    <Link
                        href="/sign-up"
                        className="group inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-medium text-black transition-all duration-200 hover:bg-white/90"
                    >
                        Get started
                        <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
