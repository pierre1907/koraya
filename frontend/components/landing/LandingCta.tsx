import Link from "next/link";

export default function LandingCta() {
  return (
    <section className="bg-koraya-navy py-16">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Pret a digitaliser vos operations internes ?
        </h2>
        <p className="mt-3 text-base text-slate-300">
          Rejoignez les organisations qui pilotent deja leur parc materiel et
          leurs dotations avec Koraya.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="w-full rounded-full bg-koraya-gold px-8 py-3 text-sm font-semibold text-koraya-navy transition hover:opacity-90 sm:w-auto"
          >
            Creer un compte gratuit
          </Link>
          <Link
            href="/login"
            className="w-full rounded-full border border-white/30 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </section>
  );
}
