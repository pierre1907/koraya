"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getCurrentUser, CurrentUser } from "@/lib/auth/token";
import AppSidebar from "@/components/layout/AppSidebar";
import AppTopbar from "@/components/layout/AppTopbar";
import { NavRole } from "@/components/layout/navConfig";

const SIDEBAR_COLLAPSED_KEY = "koraya_sidebar_collapsed";

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setUser(getCurrentUser());
    setCheckingSession(false);

    try {
      setCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1");
    } catch {
      // localStorage indisponible : on garde le menu deplie
    }
  }, [router]);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
      } catch {
        // stockage indisponible, rien a persister
      }
      return next;
    });
  }

  if (checkingSession) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar collapsed={collapsed} role={(user?.role as NavRole) ?? null} />
      <div className="flex min-h-screen flex-1 flex-col">
        <AppTopbar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} user={user} />
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
