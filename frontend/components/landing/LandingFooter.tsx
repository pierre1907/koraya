import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="border-t border-gray-100 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-koraya-gold text-koraya-navy">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M2 1.5 13 8l-11 6.5v-13Z" />
            </svg>
          </span>
          <span className="text-sm font-bold tracking-wide text-koraya-navy">KORAYA</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-500">
          <Link href="/login" className="hover:text-koraya-navy">
            Se connecter
          </Link>
          <Link href="/register" className="hover:text-koraya-navy">
            S&apos;inscrire
          </Link>
        </div>

        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} KORAYA. Tous droits reserves.
        </p>
      </div>
    </footer>
  );
}
