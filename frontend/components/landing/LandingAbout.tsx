export default function LandingAbout() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 sm:grid-cols-2 sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">A propos de Koraya</h2>
          <p className="mt-4 text-base text-gray-500">
            Koraya est une plateforme SaaS mono-tenant pensee pour les
            organisations qui gerent plusieurs sites et souhaitent
            digitaliser le suivi de leurs operations internes : parc
            materiel, dotations et collaborateurs.
          </p>
          <p className="mt-4 text-base text-gray-500">
            Notre objectif : remplacer les fichiers partages et les process
            manuels par une interface simple, fiable et securisee, adaptee a
            la realite du terrain.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-8">
          <dl className="grid grid-cols-2 gap-6 text-center">
            <div>
              <dt className="text-3xl font-extrabold text-koraya-navy">1</dt>
              <dd className="mt-1 text-xs text-gray-500">Interface pour toute l&apos;organisation</dd>
            </div>
            <div>
              <dt className="text-3xl font-extrabold text-koraya-navy">100%</dt>
              <dd className="mt-1 text-xs text-gray-500">Tracabilite des dotations</dd>
            </div>
            <div>
              <dt className="text-3xl font-extrabold text-koraya-navy">Multi</dt>
              <dd className="mt-1 text-xs text-gray-500">Sites geres depuis un seul espace</dd>
            </div>
            <div>
              <dt className="text-3xl font-extrabold text-koraya-navy">Zero</dt>
              <dd className="mt-1 text-xs text-gray-500">Fichier Excel a jongler</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
