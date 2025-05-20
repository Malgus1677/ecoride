import { FaCheckCircle, FaCar } from 'react-icons/fa';

type TrajetType = {
  covoiturage_id: number;
  lieu_depart: string;
  lieu_arrivee: string;
  date_depart: string;
  date_arrivee: string;
  heure_depart: string;
  heure_arrivee: string;
  prix_personne: number;
  nb_place?: number;
  nb_bagage?: number;
  statut?: string;
  voitureId?: number;
  preferences: string[] | string;
};

type VoitureType = {
  id: number;
  marque: string;
  modele: string;
  immatriculation: string;
};

type Props = {
  user: { role: number };
  covoiturages: TrajetType[];
  voiture: VoitureType[];
  Edittrajet: (id: number, trajet: TrajetType) => void;
  handleDeleteCovoiturage: (id: number) => void;
  launchCovoiturage: (id: number) => void;
};

const ListeTrajets: React.FC<Props> = ({
  user,
  covoiturages,
  voiture,
  Edittrajet,
  handleDeleteCovoiturage,
  launchCovoiturage,
}) => {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const formatHeure = (heureStr: string): string => {
    if (!heureStr) return 'Heure invalide';
    const dateTimeStr = `1970-01-01T${heureStr}:00`;
    const date = new Date(dateTimeStr);
    return isNaN(date.getTime())
      ? 'Heure invalide'
      : date.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
  };

  const renderTrajet = (trajet: TrajetType, index: number) => {
    const preferences =
      typeof trajet.preferences === 'string'
        ? JSON.parse(trajet.preferences)
        : trajet.preferences;

    return (
      <div
        key={index}
        className="bg-green-50 p-6 rounded-2xl shadow-md hover:shadow-xl hover:bg-green-100 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
      >
        {/* Infos Trajet */}
        <div className="space-y-2 text-gray-800 w-full md:w-auto">
          <p><strong>Départ :</strong> {trajet.lieu_depart}</p>
          <p><strong>Arrivée :</strong> {trajet.lieu_arrivee}</p>

          <p className="text-sm text-gray-600">
            <strong>Date de départ :</strong> {formatDate(trajet.date_depart)} à {formatHeure(trajet.heure_depart)}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Date d’arrivée :</strong> {formatDate(trajet.date_arrivee)} à {formatHeure(trajet.heure_arrivee)}
          </p>

          <p className="mt-2 font-semibold text-green-700">
            Prix par personne : {trajet.prix_personne} crédits
          </p>

          {user.role === 4 && (
            <>
              <p className="mt-2 font-semibold text-green-700">
                Places disponibles : {trajet.nb_place}
              </p>
              <p className="mt-2 font-semibold text-green-700">
                Bagages : {trajet.nb_bagage}
              </p>
              <p className="mt-2 font-semibold text-green-700">
                Statut : {trajet.statut === 'disponible' ? 'Disponible' : 'Indisponible'}
              </p>
              {voiture?.map(
                (v) =>
                  v.id === trajet.voitureId && (
                    <div key={v.id} className="mt-2">
                      <p className="font-semibold text-green-700">Voiture :</p>
                      <p>{v.marque} - {v.modele} - {v.immatriculation}</p>
                    </div>
                  )
              )}
            </>
          )}

          {preferences?.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold text-green-700">Préférences :</p>
              <ul className="mt-1 space-y-1">
                {preferences.map((pref: string, i: number) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <FaCheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    {pref}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Actions Conducteur */}
        {user.role === 4 && (
          <div className="flex flex-col gap-4 mt-4">
            <button
              onClick={() => Edittrajet(trajet.covoiturage_id, trajet)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
            >
              Modifier le trajet
            </button>
            <button
              onClick={() => handleDeleteCovoiturage(trajet.covoiturage_id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            >
              Supprimer le trajet
            </button>
            <button
              onClick={() => launchCovoiturage(trajet.covoiturage_id)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Lancer le trajet !
            </button>
          </div>
        )}

        {/* Icône */}
        <FaCar className="text-5xl text-green-600 shrink-0" />
      </div>
    );
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-xl flex flex-col gap-6 mb-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-green-600 pb-4 border-b-2 border-gray-300">
        Mes trajets
      </h2>
      {covoiturages && covoiturages.length > 0 ? (
        covoiturages.map(renderTrajet)
      ) : (
        <p className="text-gray-500">Aucun trajet trouvé.</p>
      )}
    </div>
  );
};

export default ListeTrajets;
