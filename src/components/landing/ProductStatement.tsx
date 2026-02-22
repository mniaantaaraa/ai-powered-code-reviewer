"use client";
import { motion } from "framer-motion";

export default function ProductStatement() {
    return (
        <section className="border-t border-white/[0.06] px-6 py-32">
            <div className="mx-auto max-w-3xl text-center">
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 text-xs font-medium uppercase tracking-widest text-white/30"
                >
                    Built for real world code
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 0.1 }}
                    className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl"
                >
                    Serious reviews for serious code.
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-8 text-base leading-relaxed text-white/50 sm:text-lg"
                >
                    Qivo runs on every pull request, analyzing changes instantly and surfacing
                    issues before they reach production.
                </motion.p>
            </div>
        </section>
    );
}
