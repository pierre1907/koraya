import Link from "next/link";

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-koraya-gold text-koraya-navy">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M2 1.5 13 8l-11 6.5v-13Z" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-wide text-koraya-navy">KORAYA</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
          <a href="#services" className="transition hover:text-koraya-navy">
            Fonctionnalites
          </a>
          <a href="#avis" className="transition hover:text-koraya-navy">
            Avis
          </a>
          <a href="#faq" className="transition hover:text-koraya-navy">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-koraya-navy transition hover:bg-gray-100 sm:inline-block"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-koraya-navy px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Essayer gratuitement
          </Link>
        </div>
      </div>
    </header>
  );
}
