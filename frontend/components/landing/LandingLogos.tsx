const ORGANIZATIONS = ["Aurea Group", "Sahel Logistics", "Bureau Nova", "Diambars Corp", "Teranga Facilities"];

export default function LandingLogos() {
  return (
    <section className="border-y border-gray-100 bg-white py-10">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
          Ils digitalisent deja leurs operations avec Koraya
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {ORGANIZATIONS.map((name) => (
            <span key={name} className="text-lg font-semibold text-gray-300">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
