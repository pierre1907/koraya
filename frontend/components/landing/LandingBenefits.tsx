const BENEFITS = [
  {
    title: "Tracabilite totale",
    description:
      "Chaque actif, chaque dotation est enregistre et horodate. Retrouvez en un clic qui detient quoi et depuis quand.",
    icon: (
      <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    ),
  },
  {
    title: "Vue multi-sites centralisee",
    description:
      "Suivez toutes les ressources de vos differents sites depuis un seul tableau de bord, en temps reel.",
    icon: (
      <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-3 10.5c4-4.4 7-8.1 7-11.25A7 7 0 0 0 5 9.75C5 12.9 8 16.6 12 21Z" />
    ),
  },
  {
    title: "Un temps precieux gagne",
    description:
      "Automatisez le suivi des dotations et des demandes pour concentrer vos equipes sur l'essentiel.",
    icon: <path d="M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  },
];

export default function LandingBenefits() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Ce que Koraya change pour votre organisation
          </h2>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="rounded-xl bg-white p-6 text-center shadow-sm">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-koraya-navy/10 text-koraya-navy">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {benefit.icon}
                </svg>
              </span>
              <h3 className="mt-4 text-base font-semibold text-gray-900">{benefit.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
