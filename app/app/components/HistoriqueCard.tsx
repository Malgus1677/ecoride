interface Historique {
    conducteurId: string;
    passagerNom: string;
    passagerPrenom: string;
    passagerEmail: string;
    conducteurNom: string;
    conducteurPrenom: string;
    conducteurEmail: string;
    lieuDepart: string;
    lieuArrivee: string;
    dateDepart: string;
    dateArrivee: string;
    heureDepart: string;
    heureArrivee: string;
}

const HistoriqueCard = ({ historique, userId }: { historique: Historique; userId: any }) => {
    const isConducteur = historique.conducteurId === userId;
    const autre = isConducteur
        ? { nom: historique.passagerNom, prenom: historique.passagerPrenom, email: historique.passagerEmail }
        : { nom: historique.conducteurNom, prenom: historique.conducteurPrenom, email: historique.conducteurEmail };

    return (
        <div
            className="bg-green-50 p-6 rounded-2xl shadow-md hover:shadow-xl hover:bg-green-100 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
        >
            {/* Infos trajet */}
            <div className="space-y-2 text-gray-800 w-full md:w-auto">
                <p><strong>Départ :</strong> {historique.lieuDepart}</p>
                <p><strong>Arrivée :</strong> {historique.lieuArrivee}</p>
                <p className="text-sm text-gray-600">
                    <strong>Date de départ :</strong> {historique.dateDepart} à {(historique.heureDepart)}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Date d’arrivée :</strong> {historique.dateArrivee} à {(historique.heureArrivee)}
                </p>
            </div>

            {/* Infos autre participant */}
            <div className="text-gray-700 text-sm md:text-right">
                <p>
                    <strong>{isConducteur ? 'Passager' : 'Conducteur'} :</strong> {autre.prenom} {autre.nom}
                </p>
                <p className="text-xs text-gray-500">{autre.email}</p>
            </div>
        </div>
    );
};
export default HistoriqueCard;

