"use client";
import Image from "next/image";
import Link from "next/link";

const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export default function Navbar() {
    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
            <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo-qivo.png"
                        alt="Qivo"
                        width={80}
                        height={28}
                        className="object-contain"
                        priority
                    />
                </Link>

                {/* Centered links */}
                <div className="hidden md:flex items-center gap-8">
                    <button
                        onClick={() => scrollTo("how-it-works")}
                        className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                        How it works
                    </button>
                    <button
                        onClick={() => scrollTo("features")}
                        className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                        Features
                    </button>
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/sign-in"
                        className="text-sm text-white/50 hover:text-white transition-colors hidden md:block"
                    >
                        Sign in
                    </Link>
                    <Link
                        href="/sign-up"
                        className="text-sm bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-white/90 transition-colors"
                    >
                        Start for free
                    </Link>
                </div>
            </div>
        </nav>
    );
}
