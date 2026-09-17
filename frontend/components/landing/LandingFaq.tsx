"use client";

import { useState } from "react";

const FAQS = [
  {
    question: "Koraya convient-il a une organisation multi-sites ?",
    answer:
      "Oui, Koraya a ete concu specifiquement pour les organisations qui gerent plusieurs sites. Chaque site dispose de sa propre structure tout en restant visible depuis un tableau de bord central.",
  },
  {
    question: "Comment les collaborateurs accedent-ils a la plateforme ?",
    answer:
      "Les collaborateurs se connectent avec leur email professionnel. L'acces peut etre restreint a des domaines de messagerie autorises par votre organisation.",
  },
  {
    question: "Puis-je suivre les dotations remises a chaque collaborateur ?",
    answer:
      "Oui. Chaque attribution de materiel est enregistree et horodatee, ce qui vous permet de retrouver a tout moment qui detient quel equipement.",
  },
  {
    question: "Faut-il une carte bancaire pour essayer Koraya ?",
    answer:
      "Non. Vous pouvez creer un compte et decouvrir la plateforme gratuitement, sans engagement.",
  },
  {
    question: "Mes donnees sont-elles isolees des autres organisations ?",
    answer:
      "Oui, Koraya fonctionne en architecture mono-tenant : les donnees de votre organisation restent completement isolees.",
  },
];

export default function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Questions frequentes
        </h2>

        <div className="mt-10 divide-y divide-gray-100 rounded-xl border border-gray-100">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="px-6">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-semibold text-gray-900"
                  aria-expanded={isOpen}
                >
                  {faq.question}
                  <span
                    className={`shrink-0 text-koraya-navy transition-transform ${isOpen ? "rotate-45" : ""}`}
                    aria-hidden="true"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M9 3v12M3 9h12" />
                    </svg>
                  </span>
                </button>
                {isOpen && <p className="pb-5 text-sm text-gray-500">{faq.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
