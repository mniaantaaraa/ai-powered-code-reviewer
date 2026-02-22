"use client";

export default function Footer() {
    return (
        <footer className="px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-xs text-white/15">© 2026 Qivo. All rights reserved.</p>
                <p className="text-xs text-white/20">
                    Made with <span className="text-red-400">🩷</span> by Antara Chanda
                </p>
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/30 transition-colors hover:text-white/60"
                >
                    GitHub
                </a>
            </div>
        </footer>
    );
}
