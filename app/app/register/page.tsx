'use client'

import React, { useEffect, useState, ChangeEvent } from "react";
import sweetalert from "sweetalert2";
import { motion } from "framer-motion";
import Image from "next/image";
import AddressAutocomplete from "../components/autoComplete";
import { FaCheckCircle } from 'react-icons/fa';

interface Role {
  id: string;
  libelle: string;
}

interface UserInfo {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone: string;
  pseudo: string;
  date_naissance: string;
}


const Register: React.FC = () => {
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [photoProfil, setPhotoProfil] = useState<File[]>([]);
  const [photoVoiture, setPhotoVoiture] = useState<File[]>([]);
  const [adresse, setAdresse] = useState<string>('');
  const [modele, setModele] = useState<string>('');
  const [immatriculation, setImmatriculation] = useState<string>('');
  const [energie, setEenergie] = useState<string>('');
  const [couleur, setCouleur] = useState<string>('');
  const [datePremiereImmatriculation, setDatePremiereImmatriculation] = useState<string>('');
  const [marque, setMarque] = useState<string>('');
  const [strength, setStrength] = useState(0)
  const [strengthComfirm, setStrengthComfirm] = useState(0)
  const [message, setMessage] = useState<string>('');
  const [checked, setChecked] = useState<boolean>(false);
  const [isEmailTaken, setIsEmailTaken] = useState(false);
  const [isPseudoTaken, setIsPseudoTaken] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    pseudo: '',
    date_naissance: ''
  });

  useEffect(() => {
    const checkEmail = async () => {
      if (!userInfo.email) return;
      try {
        const res = await fetch(`http://localhost:5000/api/auth/checkmail?email=${userInfo.email}`);
        if (!res.ok) {
          throw new Error('Erreur lors de la vérification de l\'email');
        }
        const data = await res.json();
        setIsEmailTaken(data.exists);
      } catch (err) {
        console.error(err);
      }
    };
    checkEmail();
  }, [userInfo.email]);

  // useEffect pour vérifier le pseudo
  useEffect(() => {
    const checkPseudo = async () => {
      if (!userInfo.pseudo) return;
      try {
        const res = await fetch(`http://localhost:5000/api/auth/checkpseudo?pseudo=${userInfo.pseudo}`);
        if (!res.ok) {
          throw new Error('Erreur lors de la vérification du pseudo');
        }
        const data = await res.json();
        setIsPseudoTaken(data.exists);
      } catch (err) {
        console.error(err);
      }
    };
    checkPseudo();
  }, [userInfo.pseudo]);

  useEffect(() => {
    fetch('http://localhost:5000/api/roles')
      .then((response) => response.json())
      .then((data: Role[]) => {
        setRoles(data);
      })
      .catch((error) => {
        console.error('Error fetching roles:', error);
      });
  }, []);


  const calculateStrength = (password: any) => {
    let strengthScore = 0;

    if (password.length >= 8) strengthScore += 25;
    if (/[A-Z]/.test(password)) strengthScore += 25;
    if (/[a-z]/.test(password)) strengthScore += 25;
    if (/[0-9]/.test(password)) strengthScore += 15;
    if (/[^A-Za-z0-9]/.test(password)) strengthScore += 10;

    return strengthScore;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'password') {
      setStrength(calculateStrength(value)); // ← utiliser la nouvelle valeur ici
    }
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
      setStrengthComfirm(calculateStrength(value));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setPhotoProfil((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleImageChangeVoiture = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setPhotoVoiture((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Nettoyage de base des inputs (anti-espace, trim, etc.)
    const pseudo = userInfo.pseudo.trim();
    const email = userInfo.email.trim();
    const password = userInfo.password.trim();

    // Regex robustes
    const pseudoRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    // Vérifications
    if (!pseudoRegex.test(pseudo)) {
      return setMessage("Le pseudo doit comporter entre 3 et 20 caractères, lettres, chiffres, _ ou -.");
    }
    if (!emailRegex.test(email)) {
      return setMessage("Adresse email invalide.");
    }
    if (!passwordRegex.test(password)) {
      return setMessage("Mot de passe trop faible. Minimum 10 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.");
    }
    if (password !== confirmPassword) {
      return setMessage("Les mots de passe ne correspondent pas.");
    }

    if (!checked) {
      return setMessage("Veuillez accepter les conditions d'utilisation.");
    }



    // Vérification des champs critiques
    if (!adresse || !pseudo || !email || !userInfo || !selectedRole) {
      return setMessage("Tous les champs obligatoires doivent être remplis.");
    }

    if (selectedRole === "4") {
      if (!marque || !modele || !energie || !immatriculation || !datePremiereImmatriculation || !couleur) {
        return setMessage("Tous les champs obligatoires doivent être remplis.");
      }
    }
    // Vérification fichiers (optionnelle)
    if (photoProfil.length > 1) {
      return setMessage("Vous pouvez envoyer jusqu'à 1 images maximum.");
    }
    if (photoVoiture.length > 3 || photoVoiture.length < 1 && selectedRole === "4") {
      return setMessage("Vous pouvez envoyer jusqu'à 3 images maximum ou 1 minimum.");
    }
    console.log(photoProfil, photoVoiture)

    const formData = new FormData();

    formData.append('userInfo', JSON.stringify(userInfo));
    formData.append('adresse', adresse);
    formData.append('modele', modele);
    formData.append('couleur', couleur);
    formData.append('immatriculation', immatriculation);
    formData.append('energie', energie);
    formData.append('datePremiereImmatriculation', datePremiereImmatriculation);
    formData.append('marque', marque);
    formData.append('selectedRole', selectedRole);

    photoProfil.forEach((image: File) => {
      formData.append('imageProfil', image); // 👈 ce nom doit correspondre à .array('images') côté backend
    });

    photoVoiture.forEach((image: File) => {
      formData.append('imagesVoiture', image); // 👈 ce nom doit correspondre à .array('images') côté backend
    });

    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      body: formData, // 👈 pas de JSON ici !
    });
    
    const data = await response.json();

    if (data.message) {
      setMessage(data.message);
      window.location.href ='/login'
    } else if (data.error) {
      setMessage(data.error);
    }
  };

  return (
    <section className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 min-h-screen flex items-center justify-center px-4 ">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 text-center"
      >
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-gray-800 mt-20">
          <h1 className="text-3xl font-bold mb-6 text-center text-green-700">Créer un Compte</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <label htmlFor="nom" className="block font-medium mb-1">Nom</label>
              <motion.input
                type="text"
                name="nom"
                value={userInfo.nom}
                min={3}
                max={20}
                pattern="[a-zA-Z0-9_]{3,}"
                placeholder="ex: Doe"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              />
              {userInfo.nom.length > 3 && userInfo.nom.length < 20 && (
                <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
              )}
            </div>
            <div className="relative">
              <label htmlFor="prenom" className="block font-medium mb-1">Prénom</label>
              <motion.input
                type="text"
                name="prenom"
                min={3}
                max={20}
                pattern="[a-zA-Z0-9_]{3,}"
                value={userInfo.prenom}
                placeholder="ex: John"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              />
              {userInfo.prenom.length > 3 && userInfo.prenom.length < 20 && (
                <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
              )}
            </div>
            <div className="relative">
              <label htmlFor="pseudo" className="block font-medium mb-1">Pseudo</label>
              <motion.input
                type="text"
                name="pseudo"
                min={3}
                max={20}
                pattern="[a-zA-Z0-9_]{3,}"
                value={userInfo.pseudo}
                placeholder="ex: utilisateur123"
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-xl ${isPseudoTaken ? 'border-red-500' : 'border-gray-300'
                  }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
              {isPseudoTaken && (
                <p className="text-red-500 text-sm absolute mt-1">Pseudo déjà utilisé</p>
              )}
              {userInfo.pseudo.length > 3 && userInfo.pseudo.length < 20 && (
                <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
              )}
            </div>

            <div>
              <label htmlFor="email" className="block font-medium mb-1">Email</label>
              <motion.input
                type="email"
                name="email"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}"
                placeholder="exemple@exemple.com"
                value={userInfo.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-xl ${isEmailTaken ? 'border-red-500' : 'border-gray-300'
                  }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              />
              {isEmailTaken && (
                <p className="text-red-500 text-sm absolute mt-1">Email déjà utilisé</p>
              )}

            </div>

            <div className="relative">
              <label htmlFor="password" className="block font-medium mb-1">Mot de passe</label>
              <motion.input
                type="password"
                name="password"
                value={userInfo.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              />
              {strength === 100 && (
                <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
              )}
            </div>
            {/* Barre de progression */}
            <div className="mt-2">
              <div className="text-xs text-gray-600 mb-1 flex justify-between items-center w-1/2">
                <span>Force du mot de passe</span>
                <span className="text-xs font-semibold text-gray-700">
                  {strength === 100
                    ? "Très fort"
                    : strength >= 75
                      ? "Fort"
                      : strength >= 50
                        ? "Moyen"
                        : strength > 0
                          ? "Faible"
                          : ""}
                </span>
              </div>

              <div className="flex w-1/2 space-x-1">
                {[0, 1, 2, 3].map((i) => {
                  let color = "bg-gray-300";

                  if (strength >= (i + 1) * 25) {
                    if (strength === 100) color = "bg-green-500";
                    else if (strength >= 75) color = "bg-blue-500";
                    else if (strength >= 50) color = "bg-yellow-500";
                    else color = "bg-red-500";
                  }

                  return (
                    <motion.div
                      key={i}
                      className={`flex-1 h-2 rounded ${color}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                    />
                  );
                })}
              </div>
            </div>
            <div className="relative">
              <label htmlFor="confirmPassword" className="block font-medium mb-1">Confirmer le mot de passe</label>
              <motion.input
                type="password"
                name="confirmPassword"
                required
                value={confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              />
              {strength === 100 && userInfo.password === confirmPassword && (
                <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
              )}
            </div>
            {/* Barre de progression */}
            <div className="mt-2">
              <div className="text-xs text-gray-600 mb-1 flex justify-between items-center w-1/2">
                <span>Force du mot de passe</span>
                <span className="text-xs font-semibold text-gray-700">
                  {strengthComfirm === 100
                    ? "Très fort"
                    : strengthComfirm >= 75
                      ? "Fort"
                      : strengthComfirm >= 50
                        ? "Moyen"
                        : strengthComfirm > 0
                          ? "Faible"
                          : ""}
                </span>
              </div>

              <div className="flex w-1/2 space-x-1">
                {[0, 1, 2, 3].map((i) => {
                  let color = "bg-gray-300";

                  if (strengthComfirm >= (i + 1) * 25) {
                    if (strengthComfirm === 100) color = "bg-green-500";
                    else if (strengthComfirm >= 75) color = "bg-blue-500";
                    else if (strengthComfirm >= 50) color = "bg-yellow-500";
                    else color = "bg-red-500";
                  }

                  return (
                    <motion.div
                      key={i}
                      className={`flex-1 h-2 rounded ${color}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <label htmlFor="telephone" className="block font-medium mb-1">Téléphone</label>
              <motion.input
                type="number"
                name="telephone"
                value={userInfo.telephone}
                onChange={handleChange}
                pattern="\d{10}" // Expression régulière pour valider 10 chiffres
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              />
              {userInfo.telephone.length === 10 && (
                <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
              )}
            </div>
            <div className="relative">
              <label htmlFor="date_naissance" className="block font-medium mb-1">Date de naissance</label>
              <motion.input
                type="date"
                name="date_naissance"
                value={userInfo.date_naissance}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              />
              {userInfo.date_naissance && (
                <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
              )}
            </div>
            <div className="relative">
              <label htmlFor="adresse" className="block font-medium mb-1">Adresse</label>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <AddressAutocomplete
                  placeholder="Votre adresse"
                  onSelect={(value) => setAdresse(value.label)}
                />
              </motion.div>
              {adresse && (
                <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
              )}
            </div>
            <div className="mb-4 relative">
              <h3 className="block font-medium mb-1 ">Photo de Profil:</h3>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              {photoProfil.length > 0 && (
                <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
              )}
              <div>
                <h3>Images sélectionnées:</h3>
                {photoProfil.length > 0 && (
                  <ul>
                    {photoProfil.map((image, index) => (
                      <Image
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt="Image de Profil"
                        width={100}
                        height={100}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="mb-4 relative">
              <label htmlFor="role" className="block font-medium mb-1">Sélectionner un rôle</label>
              <motion.select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <option value="" disabled>Sélectionner un rôle</option>
                {roles
                  .filter((roles: any) => roles.libelle !== "admin" && roles.libelle !== 'employe')
                  .map((role: any, index: number) => (
                    <option key={role.role_id || index} value={role.role_id}>
                      {role.libelle}
                    </option>
                  ))}
              </motion.select>
              {selectedRole && (
                <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
              )}
            </div>

            <div>
              <h1 className="mb-10">Si vous vous incrivez en tant que conducteur, renseignez votre véhicule ! Ainsi que votre photo de porfil !</h1>
              {selectedRole && selectedRole === "4" && (
                <div>
                  <div className="relative">
                    <label htmlFor="marque" className="block font-medium mb-1">Marque</label>
                    <motion.input
                      type="text"
                      name="marque"
                      min={3}
                      max={20}
                      pattern="[a-zA-Z0-9_]{3,}"
                      value={marque}
                      placeholder="ex: John"
                      onChange={(e) => setMarque(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    />
                    {marque.length > 3 && marque.length < 20 && (
                      <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                    )}
                  </div>
                  <div className="relative">
                    <label htmlFor="modele" className="block font-medium mb-1">Modèle</label>
                    <motion.input
                      type="text"
                      name="modele"
                      min={3}
                      max={20}
                      pattern="[a-zA-Z0-9_]{3,}"
                      value={modele}
                      placeholder="ex: Ford"
                      onChange={(e) => setModele(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    />
                    {modele.length > 3 && modele.length < 20 && (
                      <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                    )}
                  </div>
                  <div className="relative">
                    <label htmlFor="energie" className="block font-medium mb-1">Energie</label>
                    <motion.input
                      type="text"
                      name="energie"
                      min={3}
                      max={20}
                      pattern="[a-zA-Z0-9_]{3,}"
                      value={energie}
                      placeholder="ex: Electrique"
                      onChange={(e) => setEenergie(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    />
                    {energie.length > 3 && energie.length < 20 && (
                      <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                    )}
                  </div>
                  <div className="relative">
                    <label htmlFor="couleur" className="block font-medium mb-1">Couleur</label>
                    <motion.input
                      type="text"
                      name="couleur"
                      min={3}
                      max={20}
                      pattern="[a-zA-Z0-9_]{3,}"
                      value={couleur}
                      placeholder="ex: Rouge"
                      onChange={(e) => setCouleur(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    />
                    {couleur.length > 3 && couleur.length < 20 && (
                      <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                    )}
                  </div>
                  <div>
                    <label htmlFor="plaque" className="block font-medium mb-1">PLaque Immatriculation</label>
                    <motion.input
                      type="text"
                      name="plaque"
                      min={3}
                      max={20}
                      value={immatriculation}
                      placeholder="ex: AA-229-AA"
                      onChange={(e) => setImmatriculation(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    />
                    {immatriculation.length > 3 && immatriculation.length < 20 && (
                      <FaCheckCircle className="text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                    )}
                  </div>
                  <div>
                    <label htmlFor="dateImmatriculation" className="block font-medium mb-1">Date de la première Immatriculation</label>
                    <motion.input
                      type="date"
                      name="dateImm"
                      min={3}
                      max={20}
                      pattern="[a-zA-Z0-9_]{3,}"
                      value={datePremiereImmatriculation}
                      placeholder="ex: John"
                      onChange={(e) => setDatePremiereImmatriculation(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    />
                  </div>
                  <div className="mb-4">
                    <h3 className="block font-medium mb-1 ">Photo de la voiture:</h3>
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
                              alt="Image de voitures"
                              width={100}
                              height={100}
                              className="w-20 h-20 rounded-full object-cover"
                            />
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  className="mr-2"
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                />
                <label htmlFor="terms" className="text-sm">J'accepte les <a href="#" className="text-green-600 underline">conditions d'utilisation</a></label>
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition duration-200 font-semibold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1 }}
            >
              S'inscrire
            </motion.button>

            <div className="mt-6 text-center">
              <p className="text-sm">Déjà un compte? <a href="/login" className="text-green-500 underline">Se connecter</a></p>
            </div>
          </form>

          {message && (
            <div className="mt-4 p-3 rounded-xl bg-green-100 text-green-800 text-sm text-center border border-green-300">
              {message}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default Register;
