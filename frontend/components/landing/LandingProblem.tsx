const PAIN_POINTS = [
  {
    title: "Des fichiers Excel eparpilles",
    description:
      "Chaque site, chaque service tient son propre tableau. Personne n'a la meme version, et les erreurs de saisie s'accumulent.",
  },
  {
    title: "Aucune tracabilite du materiel",
    description:
      "Impossible de savoir qui detient quel equipement, depuis quand, ni de retrouver l'historique en cas de perte ou de litige.",
  },
  {
    title: "Des sites qui ne communiquent pas",
    description:
      "La direction n'a aucune vue consolidee sur les ressources reparties entre les differents sites de l'organisation.",
  },
];

export default function LandingProblem() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            La gestion du materiel et des dotations, un casse-tete au quotidien
          </h2>
          <p className="mt-4 text-base text-gray-500">
            Sans outil centralise, le suivi des operations internes devient
            vite une source de perte de temps et de risques pour votre
            organisation.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {PAIN_POINTS.map((point) => (
            <div key={point.title} className="rounded-xl border border-gray-100 bg-gray-50 p-6">
              <h3 className="text-base font-semibold text-gray-900">{point.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
