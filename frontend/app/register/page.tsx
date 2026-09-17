"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  register,
  fetchRegistrableSites,
  fetchRegistrableDomains,
  SiteOption,
  DomainOption,
} from "@/lib/auth/authService";
import AuthLayout from "@/components/auth/AuthLayout";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAlias, setEmailAlias] = useState("");
  const [emailDomainId, setEmailDomainId] = useState("");
  const [password, setPassword] = useState("");
  const [siteId, setSiteId] = useState("");
  const [sites, setSites] = useState<SiteOption[]>([]);
  const [domains, setDomains] = useState<DomainOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRegistrableSites()
      .then(setSites)
      .catch(() => setSites([]));
    fetchRegistrableDomains()
      .then(setDomains)
      .catch(() => setDomains([]));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ firstName, lastName, emailAlias, emailDomainId, password, siteId });
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err?.response?.data?.error ?? "Impossible de creer le compte. Verifiez vos informations."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout navLabel="Connexion" navHref="/login">
      <h2 className="text-2xl font-bold text-gray-900">Creer un compte</h2>
      <p className="mt-1 text-sm text-gray-500">
        Vous avez deja un compte ?{" "}
        <Link href="/login" className="font-medium text-koraya-gold hover:underline">
          Se connecter
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Prenom
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
              placeholder="Entrez votre prenom"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
              placeholder="Entrez votre nom"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email professionnel
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={emailAlias}
              onChange={(e) => setEmailAlias(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
              placeholder="prenom.nom"
            />
            <select
              required
              value={emailDomainId}
              onChange={(e) => setEmailDomainId(e.target.value)}
              className="w-48 shrink-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
            >
              <option value="" disabled>
                Domaine
              </option>
              {domains.map((d) => (
                <option key={d.id} value={d.id}>
                  @{d.domain}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
            placeholder="8 caracteres minimum"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Site
          </label>
          <select
            required
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-koraya-navy focus:outline-none"
          >
            <option value="" disabled>
              Selectionnez votre site
            </option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
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
          {loading ? "Creation..." : "Creer mon compte"}
        </button>
      </form>
    </AuthLayout>
  );
}
