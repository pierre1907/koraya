import Link from "next/link";
import { ReactNode } from "react";

interface AuthLayoutProps {
  /** Libelle du bouton en haut a droite (ex: "S'inscrire" ou "Connexion") */
  navLabel: string;
  navHref: string;
  children: ReactNode;
}

export default function AuthLayout({ navLabel, navHref, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white md:flex-row">
      <aside className="relative flex min-h-[280px] flex-col justify-between bg-koraya-navy px-8 py-8 md:min-h-screen md:w-1/2 md:px-16 md:py-12">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-koraya-gold text-koraya-navy">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M2 1.5 13 8l-11 6.5v-13Z" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-wide text-white">KORAYA</span>
        </div>

        <div>
          <h1 className="text-5xl font-extrabold leading-none tracking-tight text-white sm:text-6xl">
            KORAYA
          </h1>
          <p className="mt-4 max-w-sm text-sm text-slate-300">
            Simplifiez la gestion de vos operations internes : parc materiel,
            dotations, collaborateurs, depuis une seule interface.
          </p>
        </div>
      </aside>

      <main className="relative flex flex-1 flex-col justify-center px-6 py-10 sm:px-12 md:px-16">
        <Link
          href={navHref}
          className="absolute right-6 top-6 rounded-full bg-koraya-navy px-5 py-2 text-sm font-medium text-white transition hover:opacity-90 sm:right-12 sm:top-8"
        >
          {navLabel}
        </Link>

        <div className="mx-auto w-full max-w-sm">{children}</div>

        <p className="mt-16 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} KORAYA. Tous droits reserves.
        </p>
      </main>
    </div>
  );
}
