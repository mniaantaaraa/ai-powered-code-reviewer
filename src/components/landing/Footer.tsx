"use client";

export default function Footer() {
    return (
        <footer className="border-t border-white/[0.07] py-8 px-6">
            <div className="grid grid-cols-3 items-center text-sm text-white/30 w-full">
                <span className="justify-self-start">© 2026 Qivo. All rights reserved.</span>
                <span className="justify-self-center">Made with ❤️ by Antara Chanda</span>
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="justify-self-end hover:text-white/70 transition-colors"
                >
                    GitHub
                </a>
            </div>
        </footer>
    );
}
