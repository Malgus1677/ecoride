"use client";

import { useEffect, useState } from "react";
import AvisCard from "../components/avisCard";

const PageValidationAvis = () => {
  const [avisNonValides, setAvisNonValides] = useState<any[]>([]);

  const fetchAvis = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/avis/validation");
      const data = await response.json();
      setAvisNonValides(data);
    } catch (error) {
      console.error("Erreur de chargement des avis", error);
    }
  };

  useEffect(() => {
    fetchAvis();
  }, []);

  const handleValidation = async (avisId: number, valide: boolean) => {
    try {
      await fetch("http://localhost:5000/api/avis/valider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avis_id: avisId, validé: valide }),
      });
      fetchAvis();
    } catch (error) {
      console.error("Erreur lors de la validation de l'avis", error);
    }
  };

  // Séparation des avis
  const avisInsatisfaisants = avisNonValides.filter((avis) => avis.note <= 2);
  const avisNormaux = avisNonValides.filter((avis) => avis.note > 2);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-800 mb-6">🌿 Validation des Avis</h1>

      {/* --- AVIS INSATISFAISANTS --- */}
      {avisInsatisfaisants.length > 0 && (

        <section className="mb-10">
          <h2 className="text-2xl text-red-700 font-semibold mb-4">⚠️ Avis insatisfaisants </h2>
          <p className="text-red-600 mb-4">
            Merci de contacter le conducteur pour comprendre ce qu’il s’est passé avant de valider l’avis.
          </p>
          <div className="grid gap-6">
            {avisInsatisfaisants.map((avis) => (
              console.log(avis),
              <AvisCard
                key={avis.id}
                avis={avis}
                actions={
                  <div className="flex flex-wrap gap-4">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition"
                      onClick={() => handleValidation(avis.id, true)}
                    >
                      ✅ Valider
                    </button>
                    <button
                      className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-full transition"
                      onClick={() => handleValidation(avis.id, false)}
                    >
                      ❌ Rejeter
                    </button>
                    <a
                      href={`mailto:${avis.conducteur_info?.email}?subject=${encodeURIComponent("Avis insatisfaisant covoiturage")}&body=${encodeURIComponent("Bonjour, pouvez-vous nous expliquer ce qu'il s'est passé pendant le trajet ?")}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition"
                    >
                      ✉️ Contacter le conducteur
                    </a>

                  </div>
                }
              />
            ))}

          </div>
        </section>
      )}

      {/* --- AUTRES AVIS À VALIDER --- */}
      <section>
        <h2 className="text-2xl text-green-700 font-semibold mb-4">📝 Avis à valider</h2>
        {avisNormaux.length === 0 ? (
          <p className="text-green-600">Aucun autre avis en attente 🌼</p>
        ) : (
          <div className="grid gap-6">
            {avisNormaux.map((avis) => (
              <AvisCard
                key={avis.id}
                avis={avis}
                actions={
                  <div className="flex gap-4">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition"
                      onClick={() => handleValidation(avis.id, true)}
                    >
                      ✅ Valider
                    </button>
                    <button
                      className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-full transition"
                      onClick={() => handleValidation(avis.id, false)}
                    >
                      ❌ Rejeter
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PageValidationAvis;
