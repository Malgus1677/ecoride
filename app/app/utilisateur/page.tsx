'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaCar, FaPlus, FaCheckCircle, FaCogs, FaSmoking, FaSmokingBan, FaPaw, FaGrinBeam, FaDog, FaVolumeUp, FaSnowflake, FaMusic, FaBed, FaUserSecret, FaPhoneAlt, FaVolumeDown } from 'react-icons/fa';
import { useAuth } from '../context/authContext';
import { useCovoiturageContext } from '../context/convoiturageContext';
import Image from 'next/image';
import AddressAutocomplete from '../components/autoComplete';
import { AvisPopover } from "../components/reviewPopover";
import AvisCard from '../components/avisCard';
import HistoriqueCard from '../components/HistoriqueCard';

type AddressSuggestion = {
  label: string;
  address: string;
  city: string;
  postalCode: string;
};


interface Voiture {
  modele: string;
  couleur: string;
  immatriculation: string;
  energie: string;
  date_premiere_immatriculation: string;
  marque: string;
  images?: string[];
}

interface CovoiturageForm {
  date_depart: string;
  heure_depart: string;
  lieu_depart: string;
  date_arrivee: string;
  heure_arrivee: string;
  lieu_arrivee: string;
  statut: string;
  preferences: string[];
  prix_personne: number;
  nb_place: number;
  nb_bagage: number;
  voitureId: number | null;
  userId: number | null;
}

interface Avis {
  id: number;
  [key: string]: any; // for other properties
}
export default function UserProfile() {
  const { user, setUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [depart, setDepart] = useState(''); // État pour le champ de départ
  const [arrivee, setArrivee] = useState(''); // État pour le champ d'arrivée
  const [isFormOpen, setIsFormOpen] = useState(false); // Gérer l'ouverture/fermeture du formulaire
  const [isCovoiturageFormOpen, setIsCovoiturageFormOpen] = useState(false)
  const { voiture, setVoiture, addVehicle, updateProfileImage, updateVehicleImages } = useAuth()
  const { covoiturages, addCovoiturage, getCovoitByUserId, updateCovoiturage, deleteCovoiturage, lanceCovoit, closeCovoit, endCovoit } = useCovoiturageContext()
  const [photoProfil, setPhotoProfil] = useState<File[]>([]);
  const [photoVoiture, setPhotoVoiture] = useState<File[]>([]);
  const [newPreference, setNewPreference] = useState<string>('');
  const [avis, setAvis] = useState<Avis[]>([])
  const [editModeCovoit, setEditModeCovoit] = useState(false); // État pour gérer le mode d'édition du covoiturage
  const [covoitId, setCovoitId] = useState<number | null>(null); // ID du covoiturage à éditer
  const [currentField, setCurrentField] = useState<'lieu_depart' | 'lieu_arrivee' | null>(null);
  const [historiques, setHistoriques] = useState([])

  const [newVoiture, setNewVoiture] = useState<Voiture>({
    modele: '',
    couleur: '',
    immatriculation: '',
    energie: '',
    date_premiere_immatriculation: '',
    marque: '',
  });
  const [newCovoiturage, setNewCovoiturage] = useState<CovoiturageForm>({
    date_depart: '',
    heure_depart: '',
    lieu_depart: '',
    date_arrivee: '',
    heure_arrivee: '',
    lieu_arrivee: '',
    statut: '',
    preferences: [],
    prix_personne: 0,
    nb_place: 0,
    nb_bagage: 0,
    voitureId: null,
    userId: null
  })

  const getAvisbyUser = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/avis/user/${id}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du covoiturage');
      }
      const data = await response.json();
      setAvis(data)
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du covoiturage', error);
      return undefined;
    }
  }

  const getHistoriqueByUser = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/covoit/historique/${id}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du covoiturage');
      }
      const data = await response.json();
      setHistoriques(data)
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du covoiturage', error);
      return undefined;
    }
  }


  useEffect(() => {
    if (user) {
      getAvisbyUser(user.id)
      getHistoriqueByUser(user.id)
    }
  }, [user])
  console.log('historiques', historiques)

  useEffect(() => {
    if (user) {
      getCovoitByUserId(user.id)
    }
  }, [user])

  if (!user) {
    return (
      <section className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Chargement des informations...</p>
      </section>
    );
  }

  const handleChangeRole = () => {
    setUser((prev: any) => ({
      ...prev,
      role: prev.role === 4 ? 3 : 4,
    }));
  };

  const commonPreferences = [
    { label: 'Fumeur', icon: <FaSmoking className="mr-2" /> },
    { label: 'Animaux acceptés', icon: <FaDog className="mr-2" /> },
    { label: 'Silence pendant le trajet', icon: <FaVolumeUp className="mr-2" /> },
    { label: 'Climatisation', icon: <FaSnowflake className="mr-2" /> },
    { label: 'Musique', icon: <FaMusic className="mr-2" /> },
    { label: 'Bagages autorisés', icon: <FaBed className="mr-2" /> },
    { label: 'Chauffeur discret', icon: <FaUserSecret className="mr-2" /> },
    { label: 'Pas de téléphone', icon: <FaPhoneAlt className="mr-2" /> },
    { label: 'Confort', icon: <FaCogs className="mr-2" /> },
    { label: 'Non-fumeur', icon: <FaSmokingBan className="mr-2" /> },
    { label: 'Pas d\'animaux', icon: <FaPaw className="mr-2" /> },
    { label: 'Conduite calme', icon: <FaCar className="mr-2" /> },
    { label: 'Musique calme', icon: <FaMusic className="mr-2" /> },
    { label: 'Chauffeur avec bonne humeur', icon: <FaGrinBeam className="mr-2" /> },
    { label: 'Confort optimal', icon: <FaCogs className="mr-2" /> },
    { label: 'Pas de climatisation', icon: <FaSnowflake className="mr-2 text-blue-500" /> },
    { label: 'Pas de musique', icon: <FaMusic className="mr-2 text-red-500" /> },
  ];

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPreference(e.target.value);
  };

  const handleAddPreference = () => {
    if (newPreference.trim() !== '') {
      setNewCovoiturage((prev) => ({
        ...prev,
        preference: [...prev.preferences, newPreference],
      }));
      setNewPreference(''); // Clear the input after adding
    }
  };

  const terminerCovoit = (id: any) => {
    endCovoit(id, user.id)
  }

  const handleRemovePreference = (index: number) => {
    setNewCovoiturage((prev) => ({
      ...prev,
      preference: prev.preferences.filter((_, i) => i !== index),
    }));
  };

  const handleChangeImProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log(files)
    if (files) {
      setPhotoProfil((prev: any) => [...prev, ...Array.from(files)]);
      updateProfileImage(files[0]); // Appelle la fonction du contexte pour mettre à jour l'image de profil

    }
  };

  const launchCovoiturage = (id: any) => {
    lanceCovoit(id, user.id); // Appelle la fonction du contexte pour lancer le covoiturage
  }

  const closeCovoiturage = (id: any) => {
    console.log(id, user.id)
    closeCovoit(id, user.id)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewVoiture((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAdresseCovoiturageChange = (selected: AddressSuggestion, type: 'depart' | 'arrivee') => {
    setNewCovoiturage((prevState) => ({
      ...prevState,
      [type === 'depart' ? 'lieu_depart' : 'lieu_arrivee']: selected.label,  // Met à jour le champ approprié
    }));
    console.log(newCovoiturage)
  };

  // Fonction de gestion des changements
  const handleCovoiturageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | AddressSuggestion
  ) => {
    const userid = user.id;

    // Si c'est un champ standard (input ou select)
    if ('target' in e) {
      const { name, value } = e.target;
      console.log('name', name);
      console.log('value', value);

      // Gérer les conversions pour les champs numériques
      const isNumericField = ['prix_personne'].includes(name);  // Liste des champs numériques
      const parsedValue = value === '' ? null : isNumericField ? Number(value) : value;

      setNewCovoiturage((prev: any) => ({
        ...prev,
        [name]: parsedValue,  // Met à jour le champ correspondant
        userId: userid,  // Ajoute l'ID utilisateur
      }));
    } else {
      console.log('e', e);
      console.log(e.label)
      // Si c'est une adresse sélectionnée dans AddressAutocomplete
      setNewCovoiturage((prev: any) => ({
        ...prev,
        userId: userid,  // Ajoute l'ID utilisateur
      }));
    }
    console.log('newCovoiturage', newCovoiturage);
  };

  const clearCovoiturageForm = () => {
    setNewCovoiturage({
      date_depart: '',
      heure_depart: '',
      lieu_depart: '',
      date_arrivee: '',
      heure_arrivee: '',
      lieu_arrivee: '',
      statut: '',
      preferences: [],
      prix_personne: 0,
      nb_place: 0,
      nb_bagage: 0,
      voitureId: null,
      userId: null
    });
  }


  const handleAddCovoiturage = () => {
    addCovoiturage(newCovoiturage, user.id); // Appelle la fonction du contexte pour ajouter le covoiturage
    setIsCovoiturageFormOpen(false); // Ferme le formulaire après l'ajout
  }
  const handleAddCar = () => {
    addVehicle(newVoiture, photoVoiture); // Appelle la fonction du contexte
    setIsFormOpen(false); // Ferme le formulaire après l'ajout
  };

  const handleImageChangeVoiture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setPhotoVoiture((prev: any) => [...prev, ...Array.from(files)]);
    }
  };


  const handleMajImVoiture = (e: React.ChangeEvent<HTMLInputElement>, voitureId: number) => {
    const files = e.target.files;
    if (files) {
      updateVehicleImages(voitureId, Array.from(files)); // Appelle la fonction du contexte pour mettre à jour les images de la voiture
    }
  }

  const Edittrajet = (id: number, covoit: CovoiturageForm) => {
    clearCovoiturageForm(); // Réinitialise le formulaire avant de le remplir avec les données du covoiturage
    setCovoitId(id); // Met à jour l'ID du covoiturage à éditer
    setEditModeCovoit(true); // Met à jour l'état pour activer le mode d'édition
    const parsedPreferences = typeof covoit.preferences === 'string'
      ? JSON.parse(covoit.preferences)
      : covoit.preferences;
    console.log('parsedPreferences', parsedPreferences)
    setNewCovoiturage({
      ...covoit,
      preferences: parsedPreferences
    }); // Met à jour l'état avec le covoiturage sélectionné
    setIsCovoiturageFormOpen(true); // Ouvre le formulaire d'édition
  }

  const handleEditCovoiturage = () => {
    if (covoitId) {
      updateCovoiturage(covoitId, newCovoiturage); // Appelle la fonction du contexte pour mettre à jour le covoiturage
      getCovoitByUserId(user.id); // Récupère les covoiturages après la mise à jour
    }
    setEditModeCovoit(false); // Désactive le mode d'édition
    setIsCovoiturageFormOpen(false); // Ferme le formulaire d'édition
    setCovoitId(null); // Réinitialise l'ID du covoiturage
  }

  const handleDeleteCovoiturage = (covoitId: number) => {
    deleteCovoiturage(covoitId, user.id); // Appelle la fonction du contexte pour supprimer le covoiturage
    setCovoitId(null); // Réinitialise l'ID du covoiturage
  }


  const profileImageUrl = `http://localhost:5000${user?.photo?.replace(/\\/g, "/")}` || '/default-avatar.png';
  return (
    <section className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 min-h-screen w-full px-6 py-10 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Informations personnelles */}
        <div className="bg-white shadow-lg p-6 rounded-xl flex flex-col gap-6 mb-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-green-600 pb-4">Informations personnelles</h2>
          <div className="flex justify-between items-center">
            <p className="text-xl font-medium text-green-600">
              Rôle : <span className="capitalize">{user.role === 3 ? 'Passager' : 'Conducteur'}</span>
            </p>
            <button onClick={handleChangeRole} className="text-green-600 hover:underline">
              Passer {user.role === 4 ? "passager" : "conducteur"}
            </button>
          </div>
          <div className='flex flex-col'>
            <div className="space-y-3 flex mt-2">
              <label
                className={`text-lg font-bold px-2 py-1 rounded-xl ${user?.credits && user.credits > 10
                  ? 'bg-green-100 text-green-800'
                  : user?.credits && user.credits > 0
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                  }`}
              >
                crédits : {user?.credits ?? 0}
              </label>
            </div>
            <p className="text-center text-lg flex mt-4">
              🚀 Besoin de crédits supplémentaires ?{' '}
              <a href="/achatCredits" className="font-bold text-yellow-500 hover:underline ml-2">
                Fais le plein dès maintenant !
              </a>
            </p>
          </div>
          <div className="border-b-2 border-gray-300 my-4" />

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-lg">
              <img
                src={profileImageUrl}
                alt="Photo de profil"
                className="w-44 h-44 rounded-full object-cover mb-5 shadow-lg transition-transform duration-300 hover:scale-105"
              />

              <input
                id="file-upload"
                type="file"
                className="mb-3"
                onChange={handleChangeImProfile}
                accept="image/*"
              />

              <label htmlFor="file-upload" className="text-green-600 hover:underline cursor-pointer">
                Changer la photo
              </label>
            </div>


            <div className="flex  gap-6">
              <div>
                <div className="space-y-3">
                  <label className="text-lg font-medium">Nom:</label>
                  <input disabled={!editMode} value={user.nom} type="text" className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="space-y-3 flex-col flex mt-2">
                  <label className="text-lg font-medium">Prénom:</label>
                  <input disabled={!editMode} value={user.prenom} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="space-y-3 flex-col flex mt-2">
                  <label className="text-lg font-medium">Email:</label>
                  <input disabled={!editMode} value={user.email} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="space-y-3 flex-col flex mt-2">
                  <label className="text-lg font-medium">Téléphone:</label>
                  <input disabled={!editMode} value={user.telephone} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div>

                <div className="space-y-3">
                  <label className="text-lg font-medium">Adresse:</label>
                  <input disabled={!editMode} value={user.adresse} className="w-full px-4 mt-2 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="space-y-3 flex-col flex mt-2">
                  <label className="text-lg font-medium">date de naissance:</label>
                  <input disabled={!editMode} value={user.date_naissance} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4">
            <button onClick={() => setEditMode(!editMode)} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200">
              {editMode ? "Valider" : "Modifier"}
            </button>
            <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200">Supprimer le compte</button>
          </div>
        </div>

        {/* Voitures */}
        <div className="bg-white shadow-lg p-6 rounded-xl flex flex-col gap-6 mb-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-green-600 pb-4 border-b-2 border-gray-300">Voitures</h2>

          {user?.role === 4 && voiture && voiture.length > 0 && (
            <>
              {voiture.map((v, index) => (
                <div
                  key={index}
                  className="bg-green-50 p-5 rounded-xl shadow hover:bg-green-100 transition-all duration-200 flex justify-between items-center mb-4"
                >
                  {v && v.images && v.images.length > 0 && (
                    <div>
                      {v.images.map((image, index) => (
                        <Image
                          key={index}
                          src={`http://localhost:5000${image.replace(/\\/g, "/")}`}
                          alt={`Image de la voiture ${v.modele}`}
                          width={100}
                          height={100}
                          className="w-24 h-24 rounded-lg object-cover mb-2"
                        />
                      ))}
                      <input
                        id={`file-upload-${v.id}`}
                        type="file"
                        multiple
                        className="mb-3"
                        onChange={(e) => handleMajImVoiture(e, v.id)}
                        accept="image/*"
                      />
                      <label htmlFor={`file-upload-${v.id}`} className="text-green-600 hover:underline cursor-pointer">
                        Changer les images
                      </label>
                    </div>
                  )}
                  {/* Ajout des images  */}
                  {v && v.images && v.images.length === 0 && (
                    <div>
                      <input
                        id={`file-upload-${v.id}`}
                        type="file"
                        multiple
                        className="mb-3"
                        onChange={(e) => handleMajImVoiture(e, v.id)}
                        accept="image/*"
                      />
                      <label htmlFor={`file-upload-${v.id}`} className="text-green-600 hover:underline cursor-pointer">
                        Changer les images
                      </label>
                    </div>
                  )}


                  <div>
                    <p><strong>Modèle :</strong> {v.modele}</p>
                    <p><strong>Marque :</strong> {v.marque}</p>
                    <p><strong>Immatriculation :</strong> {v.immatriculation}</p>
                    <p><strong>Couleur :</strong> {v.couleur}</p>
                    <p><strong>Energie :</strong> {v.energie}</p>
                    <p><strong>Date Première immatriculation :</strong> {v.date_premiere_immatriculation}</p>
                  </div>
                  <FaCar className="text-4xl text-green-600" />
                </div>
              ))}
            </>
          )}

          {user.role === 4 && (
            <div className="mt-5 bg-green-100 p-5 rounded-xl shadow flex justify-between items-start">
              {/* Section pour le bouton d'ajout de voiture */}
              <div className="w-1/2 px-6 py-4 justify-center">
                <div className="">
                  <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200"
                  >
                    <FaPlus className="mr-2" /> Ajouter une voiture
                  </button>
                </div>
                {/* Formulaire d'ajout de voiture */}
                {isFormOpen && (
                  <div className='mt-4 space-y-5'>
                    {/* Champ Marque */}
                    <div className="relative">
                      <label htmlFor="marque" className="block font-medium mb-1">Marque</label>
                      <motion.input
                        type="text"
                        name="marque"
                        min={3}
                        max={20}
                        pattern="[a-zA-Z0-9_]{3,}"
                        value={newVoiture.marque}
                        placeholder="ex: BMW"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      />
                      {newVoiture.marque.length > 3 && newVoiture.marque.length < 20 && (
                        <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                      )}
                    </div>

                    {/* Champ Modèle */}
                    <div className="relative">
                      <label htmlFor="modele" className="block font-medium mb-1">Modèle</label>
                      <motion.input
                        type="text"
                        name="modele"
                        min={3}
                        max={20}
                        pattern="[a-zA-Z0-9_]{3,}"
                        value={newVoiture.modele}
                        placeholder="ex: Ford"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      />
                      {newVoiture.modele.length > 3 && newVoiture.modele.length < 20 && (
                        <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                      )}
                    </div>

                    {/* Champ Energie */}
                    <div className="relative">
                      <label htmlFor="energie" className="block font-medium mb-1">Energie</label>
                      <motion.input
                        type="text"
                        name="energie"
                        min={3}
                        max={20}
                        pattern="[a-zA-Z0-9_]{3,}"
                        value={newVoiture.energie}
                        placeholder="ex: Electrique"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      />
                      {newVoiture.energie.length > 3 && newVoiture.energie.length < 20 && (
                        <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                      )}
                    </div>

                    {/* Champ Couleur */}
                    <div className="relative">
                      <label htmlFor="couleur" className="block font-medium mb-1">Couleur</label>
                      <motion.input
                        type="text"
                        name="couleur"
                        min={3}
                        max={20}
                        pattern="[a-zA-Z0-9_]{3,}"
                        value={newVoiture.couleur}
                        placeholder="ex: Rouge"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      />
                      {newVoiture.couleur.length > 3 && newVoiture.couleur.length < 20 && (
                        <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                      )}
                    </div>

                    {/* Champ Immatriculation */}
                    <div>
                      <label htmlFor="immatriculation" className="block font-medium mb-1">Plaque Immatriculation</label>
                      <motion.input
                        type="text"
                        name="immatriculation"
                        min={3}
                        max={20}
                        value={newVoiture.immatriculation}
                        placeholder="ex: AA-229-AA"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      />
                      {newVoiture.immatriculation.length > 3 && newVoiture.immatriculation.length < 20 && (
                        <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                      )}
                    </div>

                    {/* Champ Date de Première Immatriculation */}
                    <div>
                      <label htmlFor="date_premiere_immatriculation" className="block font-medium mb-1">Date de la première Immatriculation</label>
                      <motion.input
                        type="date"
                        name="date_premiere_immatriculation"
                        value={newVoiture.date_premiere_immatriculation}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      />
                      {newVoiture.date_premiere_immatriculation.length > 3 && newVoiture.date_premiere_immatriculation.length < 20 && (
                        <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                      )}
                    </div>

                    {/* Champ pour la photo de la voiture */}
                    <div className="mb-4">
                      <h3 className="block font-medium mb-1">Photo de la voiture:</h3>
                      <p>2 images maximum</p>
                      <input
                        type="file"
                        multiple
                        onChange={handleImageChangeVoiture}
                        className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                      <div>
                        <h3>Images sélectionnées:</h3>
                        {photoVoiture.length > 0 && (
                          <ul>
                            {photoVoiture.map((image, index) => (
                              <Image
                                key={index}
                                src={URL.createObjectURL(image)}
                                alt="Image de voiture"
                                width={100}
                                height={100}
                                className="w-20 h-20 rounded-full object-cover"
                              />
                            ))}
                          </ul>
                        )}

                      </div>
                    </div>

                    {/* Bouton pour valider l'ajout de voiture */}
                    <button className='flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-full' onClick={handleAddCar}>
                      Valider le véhicule
                    </button>
                  </div>
                )}
              </div>

              {/* Section "Créer un covoiturage" */}
              <div className="w-1/2 px-6 py-4 ">
                {voiture && voiture.length > 0 && (
                  <div className="text-right mb-4 ">
                    <button
                      onClick={() => [setIsCovoiturageFormOpen(!isCovoiturageFormOpen), clearCovoiturageForm()]}
                      className="flex items-center  px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200"
                    >
                      <FaPlus className="mr-2" /> Créer un covoiturage
                    </button>
                  </div>
                )}

                {/* Formulaire "Créer un covoiturage" */}
                {isCovoiturageFormOpen && (
                  <div className="mt-4 space-y-5">
                    <div className="grid gap-4">
                      {/* Lieu de départ */}
                      <div className="relative">
                        <label htmlFor="lieu_depart" className="block font-medium mb-1">Lieu de départ</label>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 }}
                        >
                          <AddressAutocomplete
                            placeholder="Adresse de Départ"
                            onSelect={(value) => handleAdresseCovoiturageChange(value, 'depart')}
                          />
                        </motion.div>
                        {newCovoiturage.lieu_depart.length >= 2 && (
                          <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                        )}
                      </div>

                      {/* Date de départ */}
                      <div className="relative">
                        <label htmlFor="date_depart" className="block font-medium mb-1">Date de départ</label>
                        <motion.input
                          type="date"
                          name="date_depart"
                          value={newCovoiturage.date_depart}
                          onChange={handleCovoiturageChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.15 }}
                        />
                        {newCovoiturage.date_depart && (
                          <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                        )}
                      </div>

                      {/* Heure de départ */}
                      <div className="relative">
                        <label htmlFor="heure_depart" className="block font-medium mb-1">Heure de départ</label>
                        <motion.input
                          type="time"
                          name="heure_depart"
                          value={newCovoiturage.heure_depart}
                          onChange={handleCovoiturageChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        />
                        {newCovoiturage.heure_depart && (
                          <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                        )}
                      </div>

                      {/* lieu d'arrivée' */}
                      <div className="relative">
                        <label htmlFor="lieu_arrivee" className="block font-medium mb-1">Lieu d'arrivée</label>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 }}
                        >
                          <AddressAutocomplete
                            placeholder="Adresse d'arrivée"
                            onSelect={(value) => handleAdresseCovoiturageChange(value, 'arrivee')}
                          />
                        </motion.div>
                        {newCovoiturage.lieu_arrivee.length >= 2 && (
                          <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                        )}
                      </div>

                      {/* Date d'arrivée' */}
                      <div className="relative">
                        <label htmlFor="date_arrivee" className="block font-medium mb-1">Date d'arrivée</label>
                        <motion.input
                          type="date"
                          name="date_arrivee"
                          value={newCovoiturage.date_arrivee}
                          onChange={handleCovoiturageChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.15 }}
                        />
                        {newCovoiturage.date_arrivee && (
                          <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                        )}
                      </div>

                      {/* Heure d'arrivée */}
                      <div className="relative">
                        <label htmlFor="heure_arrivee" className="block font-medium mb-1">Heure d'arrivée</label>
                        <motion.input
                          type="time"
                          name="heure_arrivee"
                          value={newCovoiturage.heure_arrivee}
                          onChange={handleCovoiturageChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        />
                        {newCovoiturage.heure_arrivee && (
                          <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                        )}
                      </div>

                      {/* Prix par personne */}
                      <div className="relative">
                        <label htmlFor="prix_personne" className="block font-medium mb-1">Prix / personne (crédits)</label>
                        <motion.input
                          type="number"
                          name="prix_personne"
                          value={newCovoiturage.prix_personne}
                          onChange={handleCovoiturageChange}
                          min={1}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.25 }}
                        />
                        {newCovoiturage.prix_personne > 0 && (
                          <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                        )}
                      </div>
                      <div className="relative">
                        <label htmlFor="nb_place" className="block font-medium mb-1">Nombres de Places</label>
                        <p>Attention a ne pas vous oubliez ! 😏 </p>
                        <motion.input
                          type="number"
                          name="nb_place"
                          value={newCovoiturage.nb_place}
                          onChange={handleCovoiturageChange}
                          min={1}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.25 }}
                        />
                        {newCovoiturage.nb_place > 0 && (
                          <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                        )}
                      </div>
                      <div className="relative">
                        <label htmlFor="nb_bagage" className="block font-medium mb-1">Nombres de Bagages</label>
                        <motion.input
                          type="number"
                          name="nb_bagage"
                          value={newCovoiturage.nb_bagage}
                          onChange={handleCovoiturageChange}
                          min={1}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.25 }}
                        />
                        {newCovoiturage.nb_bagage > 0 && (
                          <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                        )}
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-medium">Préférences communes</h3>
                        {commonPreferences.map(({ label, icon }) => (
                          <div key={label} className="flex items-center">
                            <input
                              type="checkbox"
                              id={label}
                              checked={newCovoiturage.preferences.includes(label)}
                              onChange={() => {
                                const updatedPreferences = newCovoiturage.preferences.includes(label)
                                  ? newCovoiturage.preferences.filter((pref) => pref !== label)
                                  : [...newCovoiturage.preferences, label];
                                setNewCovoiturage({ ...newCovoiturage, preferences: updatedPreferences });
                              }}
                              className="mr-2"
                            />
                            <label htmlFor={label} className="flex items-center cursor-pointer">
                              {icon}
                              {label}
                            </label>
                          </div>
                        ))}
                      </div>

                      {/* Affichage de l'input pour ajouter une préférence personnalisée */}
                      <div className="flex items-center mt-4">
                        <input
                          type="text"
                          value={newPreference}
                          onChange={handlePreferenceChange}
                          placeholder="Ajouter une préférence personnalisée"
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                          onClick={handleAddPreference}
                          className="ml-2 px-4 py-2 bg-green-500 text-white rounded-xl focus:outline-none"
                        >
                          Ajouter
                        </button>
                      </div>

                      {/* Affichage des préférences sélectionnées */}
                      <div className="mt-4">
                        <h3 className="font-medium">Préférences sélectionnées :</h3>
                        <ul className="list-disc pl-5">
                          {newCovoiturage.preferences.map((pref, index) => (
                            <li key={index} className="flex justify-between items-center">
                              <span>{pref}</span>
                              <button
                                onClick={() => handleRemovePreference(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Supprimer
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Sélection voiture */}
                      <div className="relative">
                        <label htmlFor="voitureId" className="block font-medium mb-1">Voiture</label>
                        <motion.select
                          name="voitureId"
                          value={newCovoiturage.voitureId?.toString() || ''}
                          onChange={handleCovoiturageChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                        >
                          <option value="">-- Choisir une voiture --</option>
                          {voiture.map((v, index) => (
                            <option
                              key={index}
                              value={v.id}
                              className="p-2 text-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                              {v.marque} - {v.modele} - {v.immatriculation} - {v.energie}
                            </option>
                          ))}

                        </motion.select>
                        {newCovoiturage.voitureId && (
                          <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                        )}
                      </div>
                      {editModeCovoit ? (
                        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200" onClick={handleEditCovoiturage}>
                          Modifier le covoiturage
                        </button>
                      ) : (
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200" onClick={handleAddCovoiturage}>
                          Créer le covoiturage
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

          )}
        </div>

        {/* Trajets */}
        {user && covoiturages && covoiturages.length > 0 && (
          <div className="bg-white shadow-lg p-6 rounded-xl flex flex-col gap-6 mb-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-green-600 pb-4 border-b-2 border-gray-300">
              Mes trajets actuels
            </h2>

            {covoiturages.map((trajet, index) => {
              console.log(trajet)
              const dateDepart = new Date(trajet.date_depart).toLocaleDateString('fr-FR', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
              });
              const dateArrivee = new Date(trajet.date_arrivee).toLocaleDateString('fr-FR', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
              });

              const formatHeure = (heureStr: string): string => {
                if (!heureStr) return 'Heure invalide';
                const dateTimeStr = `1970-01-01T${heureStr}:00`;
                const date = new Date(dateTimeStr);
                return isNaN(date.getTime())
                  ? 'Heure invalide'
                  : date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false });
              };

              const preferences = typeof trajet.preferences === 'string'
                ? JSON.parse(trajet.preferences)
                : trajet.preferences;

              return (
                <div
                  key={index}
                  className="bg-green-50 p-6 rounded-2xl shadow-md hover:shadow-xl hover:bg-green-100 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
                >
                  {/* Partie gauche */}
                  <div className="space-y-2 text-gray-800 w-full md:w-auto">
                    <p><strong>Départ :</strong> {trajet.lieu_depart}</p>
                    <p><strong>Arrivée :</strong> {trajet.lieu_arrivee}</p>
                    <p className="text-sm text-gray-600">
                      <strong>Date de départ :</strong> {dateDepart} à {formatHeure(trajet.heure_depart)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Date d’arrivée :</strong> {dateArrivee} à {formatHeure(trajet.heure_arrivee)}
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
                          Statut : {trajet.statut}
                        </p>

                        {/* Voiture associée */}
                        {voiture?.map((v, i) =>
                          v.id === trajet.voitureId ? (
                            <div key={i} className="mt-2">
                              <p className="font-semibold text-green-700">Voiture :</p>
                              <p>{v.marque} - {v.modele} - {v.immatriculation}</p>
                            </div>
                          ) : null
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

                  {/* Partie droite (actions réservées au conducteur) */}
                  {user.role === 4 && (
                    <div className="flex flex-col gap-4 mt-4">
                      {trajet.statut === 'disponible' && (
                        <div className='flex flex-col gap-4 mt-4'>
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
                      {trajet.statut === 'en_route' && (
                        <button
                          onClick={() => terminerCovoit(trajet.covoiturage_id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                          Terminer le trajet !
                        </button>
                      )}
                    </div>
                  )}
                  {user.role === 3 && trajet.statut === 'disponible' && (
                    <div className="flex flex-col gap-4 mt-4">
                      <button
                        onClick={() => closeCovoiturage(trajet.covoiturage_id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                      >
                        Annulation
                      </button>
                    </div>
                  )}
                  {user.role === 3 && trajet.statut === "terminer" && (
                    <div className="flex flex-col gap-4 mt-4">
                      <AvisPopover trajet={trajet.covoiturage_id} user={user.id} />
                    </div>
                  )}

                  {/* Icône */}
                  <FaCar className="text-5xl text-green-600 shrink-0" />
                </div>
              );
            })}
          </div>
        )}
        {historiques && historiques.length > 0}{
          <div className="bg-white shadow-lg p-6 rounded-xl flex flex-col gap-6 mb-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-green-600 pb-4 border-b-2 border-gray-300">
              Historiques des trajets
            </h2>

            {historiques.map((historique, index) => (
              <HistoriqueCard
                key={index}
                historique={historique}
                userId={user.id} // ou userId selon ta variable
              />
            ))}

          </div>
        }
        {user && avis && avis.length > 0 && (
          <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-emerald-700 mb-4">🧾 Avis reçus</h1>
            <div className="grid gap-6">
              {avis.length === 0 ? (
                <p className="text-emerald-600">Aucun avis disponible pour cet utilisateur.</p>
              ) : (
                avis.map((a) => <AvisCard key={a.id} avis={a} />)
              )}
            </div>
          </div>
        )
        }

      </motion.div>
    </section>
  );


}
