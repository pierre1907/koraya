"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getCurrentUser, clearToken, CurrentUser } from "@/lib/auth/token";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setUser(getCurrentUser());
  }, [router]);

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
        <h1 className="text-lg font-semibold text-koraya-navy">Koraya</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user.fullName} <span className="text-gray-400">· {user.role}</span>
          </span>
          <button
            onClick={handleLogout}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <h2 className="mb-2 text-xl font-semibold text-gray-800">
          Tableau de bord
        </h2>
        <p className="text-gray-500">
          Module Gestion du Parc Informatique — à venir.
        </p>
      </section>
    </main>
  );
}
