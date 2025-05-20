import { motion } from 'framer-motion';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext'; // Assure-toi que le chemin est correct

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // Récupère l'utilisateur et la fonction de déconnexion

  // Fonction de déconnexion
  const handleLogout = () => {
    logout(); // Appel à la fonction de déconnexion
    window.location.href = '/login'; // Redirection vers la page de connexion après déconnexion
  };
  console.log(user)

  // Formulation de l'URL de la photo de profil
  const profileImageUrl = `http://localhost:5000${user?.photo?.replace(/\\/g, "/")}` || '/default-avatar.png';

  return (
    <motion.nav
      className="bg-green-600 p-4 shadow-lg fixed top-0 left-0 right-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-semibold">
          EcoRide
        </Link>

        <ul className="flex space-x-6">
          {/* Affichage du bouton de connexion ou des informations de l'utilisateur */}
          {user ? (
            <>
              <li className="flex items-center space-x-2">
                {/* Image de profil de l'utilisateur */}
                <img
                  src={profileImageUrl}
                  alt="Photo de profil"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <Link href="/utilisateur" className="text-white font-medium" >{user.nom || user.prenom}</Link>
              </li>
              <li>
                <motion.a
                  onClick={handleLogout}
                  className="text-white hover:text-green-300 cursor-pointer"
                  whileHover={{ scale: 1.1, color: '#4caf50' }}
                  transition={{ duration: 0.2 }}
                >
                  Déconnexion
                </motion.a>
              </li>
            </>
          ) : (
            <>
              <li>
                <motion.a
                  href="/login"
                  className="text-white hover:text-green-300"
                  whileHover={{ scale: 1.1, color: '#4caf50' }}
                  transition={{ duration: 0.2 }}
                >
                  Connexion
                </motion.a>
              </li>
            </>
          )}
          <li>
            <motion.a
              href="/covoiturages"
              className="text-white hover:text-green-300"
              whileHover={{ scale: 1.1, color: '#4caf50' }}
              transition={{ duration: 0.2 }}
            >
              Covoiturages
            </motion.a>
          </li>
          <li>
            <motion.a
              href="/contact"
              className="text-white hover:text-green-300"
              whileHover={{ scale: 1.1, color: '#4caf50' }}
              transition={{ duration: 0.2 }}
            >
              Contact
            </motion.a>
          </li>
        </ul>
      </div>
    </motion.nav>
  );
};

export default Navbar;
