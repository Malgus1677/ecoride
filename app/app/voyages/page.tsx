import React, { useState } from "react";

const CreateTrip: React.FC = () => {
  const [lieuDepart, setLieuDepart] = useState("");
  const [lieuArrivee, setLieuArrivee] = useState("");
  const [prix, setPrix] = useState(0);
  const [vehicule, setVehicule] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Calculer le prix après retrait des crédits (exemple)
    const prixFinal = prix - 2; // Exemple de la plateforme qui prend 2 crédits

    const response = await fetch('/api/create-trip.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lieuDepart,
        lieuArrivee,
        prix: prixFinal,
        vehicule,
      }),
    });

    const data = await response.json();
    if (data.message) {
      setMessage(data.message);
    } else if (data.error) {
      setMessage(data.error);
    }
  };

  return (
    <div className="container">
      <h1>Saisir un Voyage</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="lieuDepart">Lieu de départ :</label>
          <input
            type="text"
            id="lieuDepart"
            value={lieuDepart}
            onChange={(e) => setLieuDepart(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lieuArrivee">Lieu d'arrivée :</label>
          <input
            type="text"
            id="lieuArrivee"
            value={lieuArrivee}
            onChange={(e) => setLieuArrivee(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="prix">Prix :</label>
          <input
            type="number"
            id="prix"
            value={prix}
            onChange={(e) => setPrix(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="vehicule">Véhicule :</label>
          <input
            type="text"
            id="vehicule"
            value={vehicule}
            onChange={(e) => setVehicule(e.target.value)}
          />
        </div>
        <button type="submit">Créer le Voyage</button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
};

export default CreateTrip;
