const SERVICES = [
  {
    title: "Gestion du parc materiel",
    description:
      "Enregistrez, categorisez et suivez l'etat de tous vos equipements, du poste de travail au vehicule de service.",
  },
  {
    title: "Suivi des dotations",
    description:
      "Attribuez du materiel a vos collaborateurs, suivez les remises et les restitutions sans papier ni tableur.",
  },
  {
    title: "Organisation multi-sites",
    description:
      "Structurez votre organisation par site et gardez une vue d'ensemble coherente, ou que vous soyez.",
  },
  {
    title: "Acces securises",
    description:
      "Controlez qui accede a quoi grace a des domaines autorises et des roles adaptes a chaque equipe.",
  },
];

export default function LandingServices() {
  return (
    <section id="services" className="bg-koraya-navy py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">Tout ce dont vous avez besoin</h2>
          <p className="mt-4 text-base text-slate-300">
            Une seule plateforme pour piloter l&apos;ensemble de vos
            operations internes.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <h3 className="text-lg font-semibold text-white">{service.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
