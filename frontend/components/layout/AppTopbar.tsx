"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CurrentUser } from "@/lib/auth/token";
import { logout } from "@/lib/auth/authService";

interface AppTopbarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  user: CurrentUser | null;
}

function initials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function AppTopbar({ collapsed, onToggleCollapsed, user }: AppTopbarProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onToggleCollapsed}
        aria-label={collapsed ? "Deplier le menu" : "Reduire le menu"}
        className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-koraya-navy"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M9 4v16" />
          <path d="M15 9l-3 3 3 3" />
        </svg>
      </button>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-koraya-navy"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 8a6 6 0 1 1 12 0c0 3.6 1 5.4 1.6 6.2a1 1 0 0 1-.8 1.8H5.2a1 1 0 0 1-.8-1.8C5 13.4 6 11.6 6 8Z" />
            <path d="M9.5 19a2.5 2.5 0 0 0 5 0" />
          </svg>
        </button>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-gray-100"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-koraya-navy text-xs font-semibold text-white">
              {user ? initials(user.fullName) : "?"}
            </span>
            {user && (
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-medium leading-tight text-gray-900">{user.fullName}</span>
                <span className="block text-xs leading-tight text-gray-400">{user.role}</span>
              </span>
            )}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden text-gray-400 sm:block" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-gray-100 bg-white py-1 shadow-lg">
              {user && (
                <div className="border-b border-gray-100 px-4 py-2 sm:hidden">
                  <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                  <p className="text-xs text-gray-400">{user.role}</p>
                </div>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
                Se deconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
