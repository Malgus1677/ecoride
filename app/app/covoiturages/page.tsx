// app/covoiturages/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import AddressAutocomplete from '../components/autoComplete';
import { FaFilter, FaTrash, FaCar, FaPlus, FaCheckCircle, FaCogs, FaSmoking, FaSmokingBan, FaPaw, FaGrinBeam, FaDog, FaVolumeUp, FaSnowflake, FaMusic, FaBed, FaUserSecret, FaPhoneAlt, FaVolumeDown } from 'react-icons/fa';
import CovoiturageCard from '../components/covoiturageCard';
import { useSearch } from '../context/searchContext';

const CovoituragesPage = () => {
  const {
    depart,
    setDepart,
    arrivee,
    setArrivee,
    date,
    setDate,
    getInfo,
    message,
    covoitId,
    setCovoitId,
    covoiturages,
    getCovoiturageById,
    setCovoiturages
  } = useSearch();

  const [resetInputs, setResetInputs] = useState(false);
  const [energieFilter, setEnergieFilter] = useState('');
  const [prixMax, setPrixMax] = useState<number | ''>('');
  const [placesMin, setPlacesMin] = useState<number | ''>('');
  const [bagages, setBagages] = useState(false);
  const [preferencesFilter, setPreferencesFilter] = useState<string[]>([]);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [dureeMin, setDureeMin] = useState<number | ''>('');
  const [dureeMax, setDureeMax] = useState<number | ''>('');
  const [prixMin, setPrixMin] = useState<number | ''>('');


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

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  useEffect(() => {
    setDepart('');
    setArrivee('');
    setDate('');

    const depart = localStorage.getItem('depart');
    const arrivee = localStorage.getItem('arrivee');
    const date = localStorage.getItem('date');

    if (depart) setDepart(depart);
    if (arrivee) setArrivee(arrivee);
    if (date) setDate(date);

    if (depart && arrivee && date) {
      setCovoitId(null);
      setCovoiturages([]);
      setCovoitId(null);
      getInfo(depart, arrivee, date);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!covoitId) return;

      const { prochesArrivee, prochesDepart, exacts, villeDepart, villeArrive } = covoitId;

      if (Array.isArray(exacts) && exacts.length > 0) {
        getCovoiturageById(exacts[0]);
      }

      if (exacts.length === 0 && (Array.isArray(prochesArrivee) || Array.isArray(prochesDepart))) {
        const message = 'Aucun covoiturage trouvé avec ces critères. Voici quelques suggestions :';

        let suggestionsMessage = '';
        if (Array.isArray(prochesArrivee) && prochesArrivee.length > 0) {
          suggestionsMessage += `Proches arrivées : ${villeArrive} `;
        }
        if (Array.isArray(prochesDepart) && prochesDepart.length > 0) {
          suggestionsMessage += `Proches départs : ${villeDepart}.`;
        }

        Swal.fire({
          title: 'Aucun covoiturage trouvé',
          text: `${message} ${suggestionsMessage}`,
          icon: 'info',
          confirmButtonText: 'Choisir',
          cancelButtonText: 'Annuler',
          showCancelButton: true,
        }).then(async (result) => {
          if (result.isConfirmed) {
            const inputOptions: { [key: string]: string } = {};

            if (prochesArrivee.length > 0 && villeArrive) {
              inputOptions['Arrivées proches'] = villeArrive;
            }
            if (prochesDepart.length > 0 && villeDepart) {
              inputOptions['Départs proches'] = villeDepart;
            }

            const choix = await Swal.fire({
              title: 'Choisissez un covoiturage proche',
              input: 'select',
              inputOptions: inputOptions,
              inputPlaceholder: 'Choisissez une option',
              showCancelButton: true,
            });

            if (choix.isConfirmed) {
              const selectedOption = choix.value;
              if (selectedOption) {
                if (villeArrive && prochesArrivee && prochesArrivee.length > 0) {
                  prochesArrivee.forEach(id => {
                    getCovoiturageById(id);
                  });
                } else if (villeDepart && prochesDepart && prochesDepart.length > 0) {
                  prochesDepart.forEach(id => {
                    getCovoiturageById(id);
                  });
                }

              }
            }
          }
        });
      }
    };
    fetchData();
  }, [covoitId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCovoiturages([]);
    setCovoitId(null);
    getInfo(depart, arrivee, date);
    setDepart('');
    setArrivee('');
    setDate('');
    setResetInputs(true);
  };


  // En haut de ton composant :
  const formatMinutes = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const availableCovoiturages = covoiturages.filter((covoit) => {
    console.log(covoit)
    const dateDepart = new Date(covoit.covoit.date_depart);
    const isFuture = dateDepart >= new Date();

    const energieOk = energieFilter ? covoit.vehicule.energie === energieFilter : true;

    const prix = covoit.covoit.prix_personne;
    const prixOk =
      (prixMin !== '' ? prix >= prixMin : true) &&
      (prixMax !== '' ? prix <= prixMax : true);

    const placesOk = placesMin !== '' ? covoit.covoit.nb_place >= placesMin : true;
    const bagagesOk = bagages ? covoit.covoit.nb_bagage > 0 : true;

    // Préférences
    let preferencesArray: string[] = [];
    const rawPreferences = covoit.covoit.preferences;

    if (typeof rawPreferences === 'string') {
      try {
        preferencesArray = JSON.parse(rawPreferences);
      } catch (error) {
        console.error('Erreur lors du parsing des préférences:', error);
      }
    } else if (Array.isArray(rawPreferences)) {
      preferencesArray = rawPreferences;
    }

    const prefsOk =
      selectedPrefs.length > 0
        ? selectedPrefs.every((pref) => preferencesArray.includes(pref))
        : true;

    // Durée trajet en minutes
    const duree = covoit.dureeTrajet; // ex: "1h 45m"
    const match = duree?.match(/(?:(\d+)h)?\s*(?:(\d+)m)?/);
    const dureeMinutes = match
      ? (parseInt(match[1] || '0') * 60 + parseInt(match[2] || '0'))
      : 0;

    const dureeOk =
      (dureeMin !== '' ? dureeMinutes >= dureeMin : true) &&
      (dureeMax !== '' ? dureeMinutes <= dureeMax : true);

    return isFuture && energieOk && prixOk && placesOk && bagagesOk && prefsOk && dureeOk;
  });

  console.log("covoit dispo", availableCovoiturages)



  return (
    <section className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white py-16 px-8 min-h-screen">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar des filtres */}
        <aside
          className={`
    fixed top-0 left-0 bottom-0 w-64 min-h-screen 
    bg-gradient-to-r from-green-400 via-green-500 to-green-600 
    text-white z-50 p-4 shadow-lg 
    transform transition-transform duration-300 ease-in-out
    ${filterOpen ? 'translate-x-0' : '-translate-x-full'}

    lg:static lg:translate-x-0 lg:w-1/4 lg:h-screen 
    lg:z-0 lg:shadow-none lg:bg-transparent lg:text-white 
    lg:overflow-y-auto
  `}
        >

          <div className="flex items-center justify-between lg:hidden mb-4">
            <h2 className="text-xl font-semibold">Filtres</h2>
            <button onClick={() => setFilterOpen(false)} className="text-white text-3xl">
              ×
            </button>
          </div>

          {/* Header desktop */}
          <h2 className="hidden lg:block text-2xl font-bold mb-6">Filtres</h2>

          {/* Filtres */}
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="font-medium">Durée du trajet (en minutes)</label>
              <div className="flex items-center space-x-2">
                <span>{formatMinutes(Number(dureeMin))} Min</span>
                <input
                  type="range"
                  min="0"
                  max="2160"
                  step="10"
                  value={Number(dureeMin) || 0}
                  onChange={(e) => setDureeMin(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span>{formatMinutes(Number(dureeMax))} Max</span>
                <input
                  type="range"
                  min="0"
                  max="2160"
                  step="10"
                  value={dureeMax}
                  onChange={(e) => setDureeMax(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Préférences */}
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 accent-green-600"
                checked={showPreferences}
                onChange={() => setShowPreferences(!showPreferences)}
              />
              Préférences
            </label>

            {showPreferences && (
              <div className="flex flex-col space-y-2 max-h-48 overflow-y-auto pr-2">
                {commonPreferences.map((pref) => (
                  <label key={pref.label} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 accent-green-600"
                      checked={selectedPrefs.includes(pref.label)}
                      onChange={() =>
                        setSelectedPrefs((prev) =>
                          prev.includes(pref.label)
                            ? prev.filter((p) => p !== pref.label)
                            : [...prev, pref.label]
                        )
                      }
                    />
                    <span className="flex items-center space-x-1">
                      {pref.icon}
                      <span>{pref.label}</span>
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* Énergie */}
            <div className="flex flex-col space-y-2">
              <label>Énergie</label>
              <select
                className="p-2 border rounded text-black"
                value={energieFilter}
                onChange={(e) => setEnergieFilter(e.target.value)}
              >
                <option value="">Tous</option>
                <option value="essence">Essence</option>
                <option value="diesel">Diesel</option>
                <option value="électrique">Électrique</option>
                <option value="hybride">Hybride</option>
              </select>
            </div>

            {/* Prix max */}
            <div className="flex flex-col space-y-2">
              <label>Prix min</label>
              <input
                type="number"
                className="p-2 border rounded text-black"
                value={prixMin}
                onChange={(e) => setPrixMin(e.target.value ? parseInt(e.target.value) : "")}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label>Prix max</label>
              <input
                type="number"
                className="p-2 border rounded text-black"
                value={prixMax}
                onChange={(e) => setPrixMax(e.target.value ? parseInt(e.target.value) : "")}
              />
            </div>

            {/* Places min */}
            <div className="flex flex-col space-y-2">
              <label>Places min</label>
              <input
                type="number"
                className="p-2 border rounded text-black"
                value={placesMin}
                onChange={(e) => setPlacesMin(e.target.value ? parseInt(e.target.value) : "")}
              />
            </div>
          </div>
        </aside>


        {/* Contenu principal */}
        <div className={`w-full transition-all duration-300 ${filterOpen ? 'lg:ml-1/4 lg:w-3/4' : 'lg:ml-0 lg:w-full'}`}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, rotate: 0.5 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSearch} className="mt-20 flex flex-col md:flex-row justify-center items-center gap-4 max-w-3xl mx-auto">
              <AddressAutocomplete
                placeholder="Adresse de départ"
                onSelect={(value) => setDepart(value.label)}
                resetSignal={resetInputs}
              />
              <AddressAutocomplete
                placeholder="Adresse d'arrivée"
                onSelect={(value) => setArrivee(value.label)}
                resetSignal={resetInputs}
              />
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-4 py-2 rounded-lg w-full md:w-1/4 text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button type="submit" className="bg-white text-green-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition">
                Rechercher
              </button>
            </form>

            <div className="flex justify-center items-center mt-6 lg:hidden">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="bg-white text-green-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
              >
                {filterOpen ? (
                  <>
                    <span>Masquer</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Filtres</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </>
                )}
              </button>
            </div>


            <div>
              <h2 className="text-2xl font-bold text-center mt-10">Covoiturages disponibles</h2>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCovoiturages && availableCovoiturages.length > 0 &&
                  availableCovoiturages.map((covoit, index) => (
                    <motion.div
                      key={covoit.covoit.covoiturage_id || index}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05, rotate: 0.5 }}
                      transition={{ duration: 0.6 }}
                      className="text-black rounded-lg shadow-lg p-6"
                    >
                      <CovoiturageCard
                        covoiturage={{
                          covoit: covoit.covoit,
                          dureeTrajet: covoit.dureeTrajet,
                          vehicule: covoit.vehicule,
                          proprietaireDetails: covoit.proprietaireDetails,
                        }}
                      />
                    </motion.div>
                  ))
                }

                {covoiturages && covoiturages.length > 0 && availableCovoiturages.length === 0 &&
                  covoiturages.map((covoit, index) => (
                    <motion.div
                      key={covoit.covoit.covoiturage_id || index}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05, rotate: 0.5 }}
                      transition={{ duration: 0.6 }}
                      className="text-black rounded-lg shadow-lg p-6"
                    >
                      <CovoiturageCard
                        covoiturage={{
                          covoit: covoit.covoit,
                          dureeTrajet: covoit.dureeTrajet,
                          vehicule: covoit.vehicule,
                          proprietaireDetails: covoit.proprietaireDetails,
                        }}
                      />
                    </motion.div>
                  ))
                }
              </div>
            </div>
            {message && <p className="text-red-700 text-xl text-center mt-4">{message}</p>}
          </motion.div>
        </div>
      </div>
    </section>
  );


};

export default CovoituragesPage;
