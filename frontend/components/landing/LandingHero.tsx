import Link from "next/link";

export default function LandingHero() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-koraya-navy/5 to-white">
      <div className="mx-auto max-w-4xl px-6 pb-16 pt-16 text-center sm:pb-24 sm:pt-24">
        <span className="inline-block rounded-full bg-koraya-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-koraya-gold">
          La plateforme des operations internes
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
          Digitalisez la gestion de vos operations internes, enfin simplifiee
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
          Koraya centralise votre parc materiel, vos dotations et vos
          collaborateurs dans une seule interface, pour les organisations
          multi-sites qui veulent reprendre le controle de leurs ressources.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="w-full rounded-full bg-koraya-navy px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto"
          >
            Creer un compte gratuit
          </Link>
          <Link
            href="/login"
            className="w-full rounded-full border border-gray-300 px-8 py-3 text-sm font-semibold text-gray-700 transition hover:border-koraya-navy hover:text-koraya-navy sm:w-auto"
          >
            Se connecter
          </Link>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          Sans carte bancaire &middot; Mise en place en quelques minutes
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl shadow-koraya-navy/10">
          <div className="flex items-center gap-1.5 border-b border-gray-100 px-3 pb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3">
            <div className="rounded-lg bg-koraya-navy p-4 sm:col-span-2">
              <div className="h-2.5 w-1/3 rounded bg-white/30" />
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="h-16 rounded bg-white/10" />
                <div className="h-16 rounded bg-white/10" />
                <div className="h-16 rounded bg-white/10" />
              </div>
              <div className="mt-3 h-2 w-2/3 rounded bg-white/20" />
              <div className="mt-2 h-2 w-1/2 rounded bg-white/20" />
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="h-2.5 w-1/2 rounded bg-koraya-gold/40" />
              <div className="mt-4 space-y-2">
                <div className="h-2 rounded bg-gray-200" />
                <div className="h-2 rounded bg-gray-200" />
                <div className="h-2 w-2/3 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
