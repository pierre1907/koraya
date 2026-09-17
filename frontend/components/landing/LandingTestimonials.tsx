const TESTIMONIALS = [
  {
    quote:
      "Nous avons enfin une vision claire du materiel present sur chacun de nos sites. Le suivi des dotations qui prenait des heures se fait desormais en quelques minutes.",
    name: "Aissatou Diop",
    role: "Responsable administrative, Sahel Logistics",
  },
  {
    quote:
      "La mise en place a ete rapide et l'equipe a tout de suite adopte l'outil. On ne reviendrait plus en arriere aux fichiers Excel partages.",
    name: "Moussa Fall",
    role: "DSI, Aurea Group",
  },
  {
    quote:
      "Koraya nous a permis de reduire les pertes de materiel de facon significative grace a la tracabilite des dotations.",
    name: "Fatou Ndiaye",
    role: "Office Manager, Bureau Nova",
  },
];

export default function LandingTestimonials() {
  return (
    <section id="avis" className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Ce que nos utilisateurs en disent
          </h2>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <figure key={testimonial.name} className="flex flex-col rounded-xl border border-gray-100 bg-gray-50 p-6">
              <blockquote className="flex-1 text-sm text-gray-600">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-koraya-gold/20 text-sm font-semibold text-koraya-gold">
                  {testimonial.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
