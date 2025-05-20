'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Type pour l'avis
interface Avis { 
  auteur: number; 
  note: number; 
  commentaire: string; 
}

// Interface pour le covoiturage
interface Covoiturage {
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
  voitureId: number | null;
  userId: number | null;
}

// CovoiturageForm omet l'ID
type CovoiturageForm = Omit<Covoiturage, 'covoiturage_id'>;

// Contexte du covoiturage
interface CovoiturageContextType {
  avis: Avis[];
  setAvis: Dispatch<SetStateAction<Avis[]>>;
  covoiturages: Covoiturage[];
  setCovoiturages: Dispatch<SetStateAction<Covoiturage[]>>;
  getCovoiturageById: (id: number) => void // Fonction pour obtenir un covoiturage par ID
  addCovoiturage: (covoiturageData: CovoiturageForm, userId: number) => void;
  getCovoitByUserId: (userId: number) => void; // Fonction pour obtenir les covoiturages par ID utilisateur
  lanceCovoit: (id: number, userId: number) => void; // Fonction pour lancer un covoiturage
  endCovoit: (id: number, userId: number) => void; // Fonction pour lancer un covoiturage
  closeCovoit: (id: number, userId: number) => void; // Fonction pour lancer un covoiturage
  deleteCovoiturage : (id: number, userId: number) => void; // Fonction pour supprimer un covoiturage
  updateCovoiturage: (id: number, updatedCovoiturage: CovoiturageForm) => void; // Fonction pour mettre à jour un covoiturage
  participateCovoit: (id: number, userId: number, prixCo:number, conducteurId: number) => void; // Fonction pour participer à un covoiturage
}

// Valeur initiale du contexte
export const CovoiturageContext = createContext<CovoiturageContextType>({
  avis: [],
  setAvis: () => {},
  covoiturages: [],
  setCovoiturages: () => {},
  getCovoiturageById: () => {},
  addCovoiturage: () => {},
  lanceCovoit: () => {},
  closeCovoit: () => {},
  getCovoitByUserId: () => {},
  deleteCovoiturage: () => {},
  endCovoit() {},
  updateCovoiturage: () => {},
  participateCovoit: () => {},
});

// Typing for children props
type CovoiturageProviderProps = {
  children: ReactNode;
};

export const CovoiturageProvider: React.FC<CovoiturageProviderProps> = ({ children }) => {
  const [avis, setAvis] = useState<Avis[]>([]); // État pour les avis
  const [covoiturages, setCovoiturages] = useState<Covoiturage[]>([]); // État pour les covoiturages

  
  // Fonction pour obtenir un covoiturage par son ID
  const getCovoiturageById = async (id: number) => {
    setCovoiturages([]) // Réinitialise l'état avant de récupérer le covoiturage
    try {
      const response = await fetch(`http://localhost:5000/api/covoit/${id}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du covoiturage');
      }
      const data = await response.json();
      setCovoiturages((prevCovoit) => [...prevCovoit, data]); // Ajout du covoiturage récupéré à l'état
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du covoiturage', error);
      return undefined;
    }
  }

  const getCovoitByUserId = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/covoit/covoit/${userId}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des covoiturages');
      }
      const data = await response.json();
      setCovoiturages(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des covoiturages', error);
    }
  }

  const lanceCovoit = async (id: number , userId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/covoit/dispo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du covoiturage');
      }
      getCovoitByUserId(userId); // Met à jour la liste des covoiturages après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour du covoiturage', error);
    }
  }

  const endCovoit = async (id: number, userId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/covoit/endCovoit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ covoitId: id}),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du covoiturage');
      }
      getCovoitByUserId(userId); // Met à jour la liste des covoiturages après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour du covoiturage', error);
    }
  }

  const closeCovoit = async (id: number, userId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/covoit/annulCovoit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ covoitId: id, userId }),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du covoiturage');
      }
      getCovoitByUserId(userId); // Met à jour la liste des covoiturages après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour du covoiturage', error);
    }
  }

  const participateCovoit = async (id: number, userId: number, prixCo:number, conducteurId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/covoit/participate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ covoitId: id, userId, prixCo, conducteurId }), // Envoie l'ID du covoiturage et de l'utilisateur
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la participation au covoiturage');
      }
      getCovoitByUserId(userId); // Met à jour la liste des covoiturages après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la participation au covoiturage', error);
    }
  }

  const deleteCovoiturage = async (id: number, userId:number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/covoit/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du covoiturage');
      }
      getCovoitByUserId(userId); // Met à jour la liste des covoiturages après la suppression
    }
    catch (error) {
      console.error('Erreur lors de la suppression du covoiturage', error);
    }
  }

  const updateCovoiturage = async (id: number, updatedCovoiturage: CovoiturageForm) => {
    try {
      const response = await fetch(`http://localhost:5000/api/covoit/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCovoiturage),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du covoiturage');
      }
      const data = await response.json();
      setCovoiturages((prevCovoit) => [...prevCovoit, data]); // Met à jour l'état avec le covoiturage modifié
    } catch (error) {
      console.error('Erreur lors de la mise à jour du covoiturage', error);
    }
  }

  // Fonction pour ajouter un covoiturage
  const addCovoiturage = async (covoiturageData: CovoiturageForm, userId: number) => {
    console.log('covoiturage data', covoiturageData);
  
    // Vérification de la présence de userId et voitureId
    if (!covoiturageData.userId) {
      console.error('Utilisateur non connecté');
      return;
    }
  
    if (!covoiturageData.voitureId) {
      console.error('Voiture non sélectionnée');
      return;
    }
  
    try {
      // Effectuer la requête POST pour ajouter le covoiturage
      const response = await fetch('http://localhost:5000/api/covoit/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indique que le corps de la requête est en JSON
        },
        body: JSON.stringify(covoiturageData), // Envoie les données du covoiturage
      });
  
      // Vérifier si la requête a réussi
      if (response.ok) {
        const result = await response.json();
        console.log('Covoiturage ajouté avec succès:', result);
        getCovoitByUserId(userId); // Met à jour la liste des covoiturages après ajout
        // Optionnel : rediriger ou mettre à jour l'UI en fonction du succès
      } else {
        setCovoiturages([])
        console.error('Erreur lors de l\'ajout du covoiturage', response.status);

      }
    } catch (error) {
      console.error('Erreur lors de la requête fetch', error);
    }
  };
  

  return (
    <CovoiturageContext.Provider
      value={{
        avis,
        setAvis,
        lanceCovoit,
        covoiturages,
        endCovoit,
        setCovoiturages,
        getCovoiturageById,
        addCovoiturage,
        getCovoitByUserId, 
        deleteCovoiturage,
        updateCovoiturage,
        participateCovoit,
        closeCovoit
      }}
    >
      {children}
    </CovoiturageContext.Provider>
  );
};

export const useCovoiturageContext = (): CovoiturageContextType => {
  const context = useContext(CovoiturageContext);
  if (!context) {
    throw new Error('useCovoiturageContext must be used within a CovoiturageProvider');
  }
  return context;
};


