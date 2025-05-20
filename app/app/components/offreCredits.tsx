'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Offre {
  id: number;
  credits: number;
  prix: number;
  bonus?: string;
}

const offres: Offre[] = [
  { id: 1, credits: 10, prix: 9.99 },
  { id: 2, credits: 25, prix: 22.99, bonus: '+1 crédit offert' },
  { id: 3, credits: 50, prix: 39.99, bonus: '+5 crédits offerts' },
  { id: 4, credits: 100, prix: 69.99, bonus: '+15 crédits offerts' },
];

const OffresCredits = () => {
  const [achatEffectue, setAchatEffectue] = useState<number | null>(null);

  const handleAchat = (offre: Offre) => {
    if (offre.bonus) {
      console.log(`Achat de ${offre.credits + (parseInt(offre.bonus.split(' ')[0]) || 0)} crédits pour ${offre.prix}€`);
    } else {
      console.log(`Achat de ${offre.credits} crédits pour ${offre.prix}€`);
    }
    setAchatEffectue(offre.id);
    window.location.href='/utilisateur'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Choisis ton pack de crédits</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {offres.map((offre) => (
          <motion.div
            key={offre.id}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-100 hover:border-green-400 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">{offre.credits} crédits</h2>
            <p className="text-gray-500 text-sm mb-4">{offre.bonus ?? 'Sans bonus'}</p>
            <p className="text-2xl font-bold text-green-600 mb-6">{offre.prix} €</p>
            <button
              onClick={() => handleAchat(offre)}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-xl hover:bg-green-600 transition-all duration-200"
            >
              Acheter
            </button>
            {achatEffectue === offre.id && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-green-600 font-medium"
              >
                ✅ Achat effectué !
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OffresCredits;
