"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FolderGit2,
  GitPullRequest,
  LayoutDashboard,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "@/lib/auth-client";

const navItems = [
  {
    href: "/repos",
    label: "Repositories",
    icon: FolderGit2,
  },
  {
    href: "/reviews",
    label: "Pull Requests",
    icon: GitPullRequest,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <aside className="w-64 border-r border-white/8 flex flex-col bg-black">
      <div className="p-6">
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
      </div>

      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1",
                isActive
                  ? "bg-white/5 text-white"
                  : "text-white/65 hover:text-white hover:bg-white/5",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/8">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/65 hover:text-white hover:bg-white/5 transition-colors w-full"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
