'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '../context/searchContext';
import { useCovoiturageContext } from '../context/convoiturageContext';
import { useAuth } from '../context/authContext';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import AvisCard from "../components/avisCard";

interface Avis {
  id: number;
  commentaire: string;
  note: number;
  valide: boolean;
  date: string;
  conducteur_info: any; // remplace "any" par le bon type si tu veux typer les objets
  covoit_info: any;
  utilisateur_info: any;
}

interface AvisResponse {
  moyenne_note: number;
  avis: Avis[];
}


const CovoiturageDetail = ({ id }: { id: string }) => {
  const { covoiturages, getCovoiturageById } = useSearch();
  const { participateCovoit } = useCovoiturageContext();
  const { user } = useAuth();
  const [avisData, setAvisData] = useState<AvisResponse | null>(null);
  const router = useRouter();


  useEffect(() => {
    if (id) {
      const idNumber = parseInt(id);  // Convertir 'id' de string à number
      if (!isNaN(idNumber)) {
        const existingCovoit = covoiturages.find((covoit) => covoit.covoit.covoiturage_id === idNumber);
        if (!existingCovoit) {
          getCovoiturageById(idNumber);
        }
      }
    }
  }, [id, covoiturages, getCovoiturageById]);

  const covoiturageDetail = covoiturages.find((covoit) => covoit.covoit.covoiturage_id === parseInt(id));
  console.log('Covoiturage Detail:', covoiturageDetail);

  useEffect(() => {
    if (covoiturageDetail && covoiturageDetail.proprietaireDetails) {
      const condId = covoiturageDetail.proprietaireDetails.utilisateur_id
      fetch(`http://localhost:5000/api/avis/user/${condId}`)
        .then(res => res.json())
        .then(data => setAvisData(data))
        .catch(err => console.error("Erreur lors de la récupération des avis", err));
    }
  }, [covoiturageDetail]);
  console.log(avisData)

  if (!covoiturageDetail) {
    return <div>Chargement...</div>;
  }

  const handleParticiper = async (covoitId: number, userId: number, credits: number, prixco: number, conducteurId: number) => {
    console.log(conducteurId)
    console.log('Covoit ID:', covoitId, 'User ID:', userId);
    Swal.fire({
      title: 'Aucun covoiturage trouvé',
      text: `Etes-vous sûr de vouloir dépenser ${prixco} crédits pour ce voyage ? il vous reste actuellement ${credits} credits sur votre compte `,
      icon: 'info',
      confirmButtonText: 'Comfirmer',
      cancelButtonText: 'Annuler',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        participateCovoit(covoitId, userId, prixco, conducteurId)
        window.location.href = '/utilisateur'
      }
    });

  }

  const isEcologique = covoiturageDetail.vehicule.energie.toLowerCase() === 'électrique' ||
    covoiturageDetail.vehicule.energie.toLowerCase() === 'hybride' ||
    covoiturageDetail.vehicule.energie.toLowerCase() === 'ethanol';

  const profileImageUrl = `http://localhost:5000${covoiturageDetail.proprietaireDetails?.photo?.replace(/\\/g, "/")}` || '/default-avatar.png';
  const voitureImageUrl = covoiturageDetail.vehicule.imagePaths[0] ? `http://localhost:5000${covoiturageDetail.vehicule.imagePaths[0].replace(/\\/g, "/")}` : '/default-car.png';
  return (
    <motion.div
      className={`mx-auto p-6 shadow-lg rounded-lg ${isEcologique ? ' bg-gradient-to-r from-green-100  to-green-300' : ' bg-gradient-to-r from-red-100 to-red-300'} transition-transform transform hover:scale-105`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h1 className="text-4xl font-bold mb-6 text-green-700 text-center">Détails du Covoiturage</h1>

      {/* Indicateur écologique */}
      {isEcologique ? (
        <motion.div
          className="flex items-center justify-center space-x-2 mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span className="text-green-500 text-4xl">🌿</span>
          <span className="text-green-700 text-xl font-semibold">Écologique</span>
        </motion.div>
      ) : (
        <motion.div
          className="flex items-center justify-center space-x-2 mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span className="text-red-500 text-4xl">❌</span>
          <span className="text-red-700 text-xl font-semibold">Non écologique</span>
        </motion.div>
      )}

      {/* Conducteur */}
      <motion.div
        className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md mb-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="flex items-center space-x-4">
          <Image
            src={profileImageUrl}
            alt={`${covoiturageDetail.proprietaireDetails.pseudo}`}
            width={60}
            height={60}
            className={`rounded-full border-4 ${isEcologique ? 'border-green-500' : 'border-red-500'}`}
          />
          <div>
            <p className="text-lg font-bold text-green-600">{covoiturageDetail.proprietaireDetails.pseudo}</p>
            <p className="text-lg font-bold text-green-600">{avisData?.moyenne_note} / 5</p>
            <p className="text-sm text-gray-500">{covoiturageDetail.proprietaireDetails.nom} {covoiturageDetail.proprietaireDetails.prenom}</p>
          </div>
        </div>
        <p className="text-md text-gray-700">Énergie du véhicule : {covoiturageDetail.vehicule.energie}</p>

        {/* Statut */}
        <div className="flex justify-between mb-4">
          <span className="text-lg font-bold text-gray-700">Statut:</span>
          <span
            className={`text-xl font-semibold ml-2 ${covoiturageDetail.covoit.statut === 'disponible' ? 'text-green-600' : 'text-red-600'}`}
          >
            {covoiturageDetail.covoit.statut === 'disponible' ? 'Disponible' : 'Indisponible'}
          </span>
        </div>

        {/* Nombre de places disponibles */}
        <div className="flex justify-between mb-4">
          <span className="text-lg font-bold text-gray-700">Places disponibles: </span>
          <motion.span
            className="text-xl font-semibold text-green-600 ml-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {covoiturageDetail.covoit.nb_place}
          </motion.span>
        </div>
      </motion.div>

      {/* Trajet */}
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md mb-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h2 className="text-2xl font-semibold text-green-600 mb-4">Trajet</h2>
        <p className="text-md text-gray-700"><strong>Durée de Trajet</strong> {covoiturageDetail.dureeTrajet} </p>
        <p className="text-md text-gray-700"><strong>Date de départ :</strong> {formatDate(covoiturageDetail.covoit.date_depart)} à {formatHeure(covoiturageDetail.covoit.heure_depart)}</p>
        <p className="text-md text-gray-700"><strong>Date d'arrivée :</strong> {formatDate(covoiturageDetail.covoit.date_arrivee)} à {formatHeure(covoiturageDetail.covoit.heure_arrivee)}</p>
        <p className="text-md text-gray-700"><strong>Lieu départ :</strong> {covoiturageDetail.covoit.lieu_depart}</p>
        <p className="text-md text-gray-700"><strong>Lieu arrivée :</strong> {covoiturageDetail.covoit.lieu_arrivee}</p>
      </motion.div>

      {/* Détails véhicule */}
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md mb-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h2 className="text-2xl font-semibold text-green-600 mb-4">Véhicule</h2>
        <div className="flex items-center space-x-4">
          <Image
            src={voitureImageUrl}
            alt={`${covoiturageDetail.vehicule.modele}`}
            width={200}
            height={200}
            className="rounded-lg shadow-md"
          />
          <div>
            <p className="text-md text-gray-700"><strong>Modèle :</strong> {covoiturageDetail.vehicule.modele}</p>
            <p className="text-md text-gray-700"><strong>Marque :</strong> {covoiturageDetail.vehicule.marque}</p>
            <p className="text-md text-gray-700"><strong>Couleur :</strong> {covoiturageDetail.vehicule.couleur}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-white p-6 rounded-lg shadow-md mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h2 className="text-2xl font-semibold text-green-600 mb-4">Informations supplémentaires</h2>
        {/* Préférences */}
        <div>
          <span className="text-lg font-bold text-gray-700">Préférences</span>
          <ul className="list-disc pl-6 mt-2">
            {(() => {
              let preferencesArray = [];

              // Si c'est une chaîne JSON, la convertir en tableau
              if (typeof covoiturageDetail.covoit.preferences === 'string') {
                try {
                  preferencesArray = JSON.parse(covoiturageDetail.covoit.preferences); // On parse la chaîne JSON
                } catch (error) {
                  console.error('Erreur lors du parsing des préférences:', error);
                }
              } else if (Array.isArray(covoiturageDetail.covoit.preferences)) {
                preferencesArray = covoiturageDetail.covoit.preferences; // Si c'est déjà un tableau, on l'utilise
              }

              // Vérifier si le tableau n'est pas vide et afficher les préférences
              return preferencesArray.length > 0 ? (
                preferencesArray.map((pref: any, index: any) => (
                  <motion.li
                    key={index}
                    className="text-md text-gray-600 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.3 }}
                  >
                    {pref}
                  </motion.li>
                ))
              ) : (
                <motion.li
                  className="text-md text-gray-600 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Aucune préférence définie
                </motion.li>
              );
            })()}
          </ul>
        </div>
        <div className="grid gap-6">
          {covoiturageDetail && avisData && avisData.avis.map((avis, index) => (
            <AvisCard
              key={avis.id}
              avis={avis}
            />
          ))}
        </div>
        <div className="mt-6 p-4 bg-white shadow-md rounded-xl">
          {user && covoiturageDetail.covoit.statut === 'disponible' && user.credits >= covoiturageDetail.covoit.prix_personne ? (
            <button
              className="w-full bg-green-600 text-white text-lg font-semibold py-3 rounded-xl hover:bg-green-700 transition duration-300"
              onClick={() =>
                handleParticiper(
                  covoiturageDetail.covoit.covoiturage_id,
                  user.id,
                  user.credits,
                  covoiturageDetail.covoit.prix_personne,
                  covoiturageDetail.proprietaireDetails.utilisateur_id
                )
              }
            >
              🚗 Participer au covoiturage
            </button>
          ) : (
            <p className="text-gray-700 text-center text-base">
              {user
                ? "Vous n'avez pas assez de crédits pour ce covoiturage."
                : <>Pour participer, vous devez vous{" "}
                  <a
                    href="/login"
                    className="text-green-600 font-medium underline hover:text-green-700"
                  >
                    connecter
                  </a>.</>
              }
            </p>
          )}

        </div>

      </motion.div>
    </motion.div>

  );
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const formatHeure = (heureStr: string): string => {
  if (!heureStr) return 'Heure invalide';
  const dateTimeStr = `1970-01-01T${heureStr}:00`; // Ajout des secondes
  const date = new Date(dateTimeStr);
  return isNaN(date.getTime())
    ? 'Heure invalide'
    : date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // format 24h
    });
};

export default CovoiturageDetail;

