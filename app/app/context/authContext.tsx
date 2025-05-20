'use client';

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
} from 'react';

// Type pour l'utilisateur
interface User {
  id: number;
  telephone: number;
  email: string;
  role: number;
  date_naissance: string;
  credits : number
  nom?: string;
  prenom?: string;
  pseudo?: string;
  adresse?: string;
  photo?: string; // Image de profil
}

// Type pour la voiture
interface Voiture {
  id: number;
  modele: string;
  couleur: string;
  immatriculation: string;
  energie: string;
  date_premiere_immatriculation: string;
  marque: string;
  images?: string[]; // Liste des images des voitures
}
type VoitureForm = Omit<Voiture, 'id'>;


// Type pour le contexte
interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  voiture: Voiture[];
  setVoiture: Dispatch<SetStateAction<Voiture[]>>;
  isLoading: boolean;
  error: string | null;
  voitureError: string | null;
  isAddingVehicle: boolean;
  logout: () => void;
  addVehicle: (vehicleData: VoitureForm, images: File[]) => void;
  updateProfileImage: (imageFile: File) => void; // Fonction pour modifier l'image de profil
  updateVehicleImages: (vehicleId: number, imageFiles: File[]) => void; // Fonction pour modifier les images de voiture
}

// Valeur initiale du contexte
export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => { },
  voiture: [],
  setVoiture: () => [],
  isLoading: true,
  error: null,
  voitureError: null,
  isAddingVehicle: false,
  logout: () => { },
  addVehicle: () => { },
  updateProfileImage: () => { },
  updateVehicleImages: () => { },
 
});

// Props pour le Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [voiture, setVoiture] = useState<Voiture[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [voitureError, setVoitureError] = useState<string | null>(null);
  

  // Fonction pour déconnecter l'utilisateur
  const logout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la déconnexion', err);
      setError('Erreur lors de la déconnexion');
    }
  };

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setError(null);
      } else {
        setUser(null);
        setError('Utilisateur non authentifié');
      }
    } catch (err) {
      console.error("Erreur d'authentification :", err);
      setUser(null);
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };
  // Fonction pour récupérer les informations utilisateur
  useEffect(() => {
    fetchUser();
  }, []); // Pas de dépendance -> exécute une seule fois
  

  // Fonction pour récupérer les véhicules de l'utilisateur
  const fetchVehicles = async () => {
    if (!user) return;

    try {
      console.log(user.id)
      const response = await fetch(`http://localhost:5000/api/voiture/userby/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const vehicles = await response.json();
        console.log(vehicles)
        setVoiture(vehicles)
        setError(null)
      } else {
        setVoiture([])
        setError("Erreur récupération des véhicules")
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des véhicules', err);
      setVoitureError('Erreur de connexion au serveur');
    }
  };

  useEffect(() => {
    if (user && user.role === 4
    ) {
      fetchVehicles()
    }
  }, [user])

  // Fonction pour ajouter un véhicule
  const addVehicle = async (vehicleData: VoitureForm, images: File[]) => {
    if (!user) {
      setVoitureError('Utilisateur non authentifié');
      return;
    }

    setIsAddingVehicle(true);
    setVoitureError(null);

    try {
      console.log(vehicleData)
      console.log(images)
      const formData = new FormData();
      formData.append('marque', vehicleData.marque);
      formData.append('modele', vehicleData.modele);
      formData.append('couleur', vehicleData.couleur);
      formData.append('energie', vehicleData.energie);
      formData.append('immatriculation', vehicleData.immatriculation);
      formData.append('datePremiereImmatriculation', vehicleData.date_premiere_immatriculation);
      formData.append('utilisateur_id', user.id.toString());
  
      images.forEach((image, index) => {
        formData.append('imagesVoiture', image); // nom du champ côté backend
      });
  
      const response = await fetch(`http://localhost:5000/api/voiture/user/${user.id}`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setVoiture((prevVoitures) => [...prevVoitures, data]);
        setError(null); // Enlever l'erreur s'il n'y en a pas
      } else {
        setVoiture([])
        setError("Erreur récupération des véhicules")
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout du véhicule', err);
      setVoitureError('Erreur de connexion au serveur');
    } finally {
      setIsAddingVehicle(false);
    }
  };

  // Fonction pour modifier l'image de profil
  const updateProfileImage = async (imageFile: File) => {
    if (!user) {
      setError('Utilisateur non authentifié');
      return;
    }
    console.log(imageFile)

    const formData = new FormData();
    formData.append('imageProfil', imageFile);

    try {
      const response = await fetch(`http://localhost:5000/api/auth/updateImage/${user.id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser((prevUser) => {
          if (prevUser) {
            return {
              ...prevUser,
              photo: data.photo, // Met à jour l'image de profil
            };
          }
          return prevUser;
        });
        fetchUser(); // Recharger les données utilisateur
        
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de la mise à jour de l\'image de profil');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'image de profil', err);
      setError('Erreur de connexion au serveur');
    }
  };

  // Fonction pour modifier les images des véhicules
  const updateVehicleImages = async (vehicleId: number, imageFiles: File[]) => {
    const formData = new FormData();
    imageFiles.forEach((file) => formData.append('imagesVoiture', file));

    try {
      const response = await fetch(`http://localhost:5000/api/auth/updateImVoiture/${vehicleId}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setVoiture((prev) =>
          prev.map((v) =>
            v.id === vehicleId
              ? { ...v, images: data.images } // ou data.images selon la réponse
              : v
          )
        );
        fetchVehicles(); // Recharger les véhicules
      } else {
        const errorData = await response.json();
        setVoitureError(errorData.message || 'Erreur lors de la mise à jour des images du véhicule');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour des images du véhicule', err);
      setVoitureError('Erreur de connexion au serveur');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user, setUser, voiture, setVoiture, isLoading, error, voitureError, isAddingVehicle,
        logout, addVehicle, updateProfileImage, updateVehicleImages,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)