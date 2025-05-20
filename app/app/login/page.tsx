'use client'

import React, { useEffect, useState, ChangeEvent } from "react";
import sweetalert from "sweetalert2";
import { motion } from "framer-motion";
import Link from "next/link";


interface Role {
  id: string;
  libelle: string;
}

interface UserInfo {
  email: string;
  password: string;
}


const Register: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: '',
    password: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Nettoyage de base des inputs (anti-espace, trim, etc.)
    const email = userInfo.email.trim();
    const password = userInfo.password.trim();

    // Vérifications
    if (!email || !password) {
      return setMessage("Tous les champs obligatoires doivent être remplis.");
    }

    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // 👈 INDISPENSABLE
      },
      credentials:'include',
      body: JSON.stringify({ email: userInfo.email, password: userInfo.password }),
    });

    const data = await response.json();
    console.log(data);

    if (data.message) {
      setMessage(data.message);
    } else if (data.error) {
      setMessage(data.error);
    }

    if (data.user.role) {
      if (data.user.role === 1) {
        window.location.href = '/admin';  // Redirige vers la page utilisateur
      } else if (data.user.role === 2) {
        window.location.href = '/employe';  // Redirige vers la page admin
      } else if (data.user.role === 3) {
        window.location.href = '/utilisateur';  // Redirige vers la page employé
      } else if (data.user.role === 4) {
        window.location.href = '/utilisateur';  // Redirige vers la page employé
      }
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
          <h1 className="text-3xl font-bold mb-6 text-center text-green-700">Connection</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block font-medium mb-1">Email</label>
              <motion.input
                type="email"
                name="email"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                placeholder="exemple@exemple.com"
                value={userInfo.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              />
            </div>

            <div>
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
            </div>
            <motion.button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition duration-200 font-semibold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1 }}
            >
              Se Connecter
            </motion.button>

            <div className="mt-6 text-center">
              <p className="text-sm">Pas de compte ? <a href="/register" className="text-green-500 underline">S'inscrire</a></p>
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
