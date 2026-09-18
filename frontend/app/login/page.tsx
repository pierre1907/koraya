"use client";

import { Suspense, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/auth/authService";
import AuthLayout from "@/components/auth/AuthLayout";

function SessionExpiredBanner() {
  const searchParams = useSearchParams();
  if (searchParams.get("reason") !== "session_expired") return null;

  return (
    <p className="mb-4 rounded-md border border-koraya-navy/20 bg-koraya-navy/5 px-3 py-2 text-sm text-koraya-navy">
      Votre session a expire. Merci de vous reconnecter.
    </p>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout navLabel="S'inscrire" navHref="/register">
      <h2 className="text-2xl font-bold text-gray-900">Bienvenue sur KORAYA !</h2>
      <p className="mt-1 text-sm text-gray-500">
        Bon retour ! Veuillez vous connecter a votre compte
      </p>

      <Suspense fallback={null}>
        <div className="mt-4">
          <SessionExpiredBanner />
        </div>
      </Suspense>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email professionnel
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
            placeholder="prenom.nom@domaine.xyz"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-koraya-navy px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Vous n&apos;avez pas de compte ?{" "}
        <Link href="/register" className="font-medium text-koraya-gold hover:underline">
          S&apos;inscrire
        </Link>
      </p>
    </AuthLayout>
  );
}
