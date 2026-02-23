"use client";
import Link from "next/link";

export default function FinalCTA() {
    return (
        <section className="px-6 py-8 pb-48">
            <div className="mx-auto max-w-3xl">
                <div className="glass-card rounded-2xl p-12 sm:p-16 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                        <span className="gradient-text-bright">
                            Catch issues before they
                            <br />
                            reach production.
                        </span>
                    </h2>
                    <p className="text-white/40 mt-4 max-w-md mx-auto text-sm">
                        Qivo connects to your repository and starts reviewing pull
                        requests instantly.
                    </p>
                    <div className="mt-8">
                        <Link
                            href="/sign-up"
                            className="inline-flex items-center bg-white text-black px-7 py-3 rounded-full font-medium text-sm hover:bg-white/90 transition-colors"
                        >
                            Get started
                            <span className="ml-2">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
