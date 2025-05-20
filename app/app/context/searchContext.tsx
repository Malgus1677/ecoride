'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

// Type décrivant la structure des résultats de covoiturage
type CovoitIdType = {
  prochesArrivee: any[];
  prochesDepart: any[];
  exacts: any[];
  villeDepart: string;
  villeArrive: string;
};

interface CovoiturageComplet {
  covoit: {
    covoiturage_id: number; // ID auto-incrémenté
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
  };
  dureeTrajet: String;
  vehicule: {
    id: number;
    modele: string;
    couleur: string;
    immatriculation: string;
    energie: string;
    date_premiere_immatriculation: string;
    marque: string;
    imagePaths: string[]; // Liste des images des voitures
  };
  proprietaireDetails: {
    nom: string;
    prenom: string;
    pseudo: string;
    photo: string;
    utilisateur_id:number;
  };
  participantDetails?: {
    nom: string;
    prenom: string;
    pseudo: string;
    photo: string;
  };
}


// Type du contexte
interface SearchContextType {
  depart: string;
  arrivee: string;
  date: string;
  setDepart: (value: string) => void;
  setArrivee: (value: string) => void;
  setDate: (value: string) => void;
  getInfo: (depart: string, arrivee: string, date: string) => void;
  message: string | null; // État pour les messages d'erreur
  setMessage: (value: string) => void; // Setter pour les messages d'erreur
  covoitId: CovoitIdType | null;
  setCovoitId: (value: CovoitIdType | null) => void;
  covoiturages: CovoiturageComplet[]; // État pour les covoiturages
  setCovoiturages: (value: CovoiturageComplet[]) => void; // Setter pour les covoiturages
  getCovoiturageById: (userId: number) => void; // Fonction pour obtenir les covoiturages par ID utilisateur
}

// Valeur initiale du contexte
export const SearchContext = createContext<SearchContextType>({
  depart: '',
  arrivee: '',
  date: '',
  setDepart: () => { },
  setArrivee: () => { },
  setDate: () => { },
  getInfo: () => { },
  message: null, // État pour les messages d'erreur
  setMessage: () => { }, // Setter pour les messages d'erreur
  covoitId: null,
  setCovoitId: () => { },
  covoiturages: [], // État pour les covoiturages
  setCovoiturages: () => { }, // Setter pour les covoiturages
  getCovoiturageById: () => { },
});


// Provider
export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [depart, setDepart] = useState('');
  const [arrivee, setArrivee] = useState('');
  const [date, setDate] = useState('');
  const [covoitId, setCovoitId] = useState<CovoitIdType | null>(null);
  const [covoiturages, setCovoiturages] = useState<CovoiturageComplet[]>([]); // État pour les covoiturages
  const [message, setMessage] = useState(''); // État pour les messages d'erreur
 

  const getInfo = async (depart: string, arrivee: string, date: string) => {
    // Vérification des valeurs avant d'effectuer la recherche
    if (!depart || !arrivee || !date) {
      setMessage('Veuillez remplir tous les champs de recherche.');
      return;
    }
    // Réinitialiser le message d'erreur
    setMessage('');
    // reinitialiser les champs d'entrée
    
    console.log('Recherche covoiturage :', depart, arrivee, date);
    try {
      setCovoiturages([]); // Réinitialiser les covoiturages avant de lancer la recherche

      const response = await fetch('http://localhost:5000/api/covoit/searchCovoit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ depart, arrivee, date }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Covoiturage trouvé avec succès:', result);
        setCovoitId(result); // Mettre à jour covoitId avec les résultats de la recherche
        setDepart('')
        setArrivee('')
        setDate('')
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Erreur lors de la recherche de covoiturage');
        setCovoitId(null); // Réinitialiser covoitId en cas d'erreur
        setDepart('')
        setArrivee('')
        setDate('')
      }
    } catch (error) {
      console.error('Erreur réseau ou serveur:', error);
      setCovoitId(null); // Réinitialiser en cas d'erreur
    }
  };


  
const getCovoiturageById = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:5000/api/covoit/${id}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du covoiturage');
    }
    const data = await response.json();

    // Vérifier si le covoiturage existe déjà dans l'état avant de l'ajouter
    setCovoiturages((prevCovoit) => {
      // Si le covoiturage n'est pas déjà présent, on l'ajoute
      if (!prevCovoit.some((item) => item.covoit.covoiturage_id === data.covoit.covoiturage_id)) {
        return [...prevCovoit, data]; // Ajouter un nouveau covoiturage
      }
      return prevCovoit; // Sinon, on retourne l'état actuel sans changement
    });

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération du covoiturage', error);
    return undefined;
  }
};


  return (
    <SearchContext.Provider
      value={{
        depart,
        arrivee,
        date,
        setDepart,
        setMessage,
        message, // État pour les messages d'erreur
        setArrivee,
        setDate,
        getInfo,
        covoitId,
        setCovoitId,
        getCovoiturageById,
        covoiturages, // État pour les covoiturages
        setCovoiturages, // Setter pour les covoiturages
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
