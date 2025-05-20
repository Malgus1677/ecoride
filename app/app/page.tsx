'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image'
import AddressAutocomplete from './components/autoComplete';


const Home = () => {
  const [depart, setDepart] = useState('');
  const [arrivee, setArrivee] = useState('');
  const [date, setDate] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('depart', depart);
    localStorage.setItem('arrivee', arrivee);
    localStorage.setItem('date', date);
    router.push('/covoiturages');
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-green-700 text-white py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1 className="text-5xl font-extrabold mb-4">EcoRide</h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            La plateforme de covoiturage pensée pour l’environnement et votre budget.
          </p>
          <p className="text-lg mb-8">
            Rejoignez notre communauté et partagez vos trajets en toute simplicité.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, rotate: 0.5 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row justify-center items-center gap-4 max-w-3xl mx-auto">
          <AddressAutocomplete
              placeholder='Adresse de départ'
              onSelect={(value) => setDepart(value.label)} />

            <AddressAutocomplete
              placeholder="Adresse d\'arrivé"
              onSelect={(value) => setArrivee(value.label)} />
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2 rounded-lg w-full md:w-1/4 text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button type="submit" className="bg-white text-green-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition">
              Rechercher
            </button>
          </form>
        </motion.div>

      </section>

      {/* À propos */}
      <section className="py-16 px-6 bg-gray-100 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, rotate: 0.5 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-green-600 mb-4">À propos d’EcoRide</h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-700">
            EcoRide est une startup française engagée dans la lutte contre le réchauffement climatique en proposant une plateforme de covoiturage 100% orientée déplacements en voiture. L’objectif : rendre la mobilité plus durable, économique et humaine. Rejoignez une communauté qui bouge avec conscience !
          </p>
          <p className="mt-4 text-lg text-gray-700">
            Notre mission est de faciliter le partage de trajets tout en réduisant l'empreinte carbone de chacun. Ensemble, faisons la différence !
          </p>
        </motion.div>
      </section>

      <section className="py-16 px-6 text-center ">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-green-600 mb-4 text-center">
            Notre vision
          </h2>
          <div className="flex justify-evenly mb-6 col-auto">
            <div >
            <Image
              src="https://www.ldb-micaresearch.com/wp-content/uploads/2019/02/Actualit%C3%A9-11.png"
              alt="Image de présentation"
              width={500}
              height={300}
              className="rounded-lg shadow-lg mb-6"
            />
            </div>
            <div className='flex flex-col justify-center'>
            <h3 className="text-2xl font-semibold mb-4">Notre engagement pour un avenir durable</h3>
            <p className="max-w-3xl mx-auto text-lg text-gray-700">
              Chez EcoRide, nous croyons que chaque trajet compte. En partageant vos trajets, vous contribuez à réduire le nombre de voitures sur la route, à diminuer les embouteillages et à améliorer la qualité de l'air. Ensemble, nous pouvons créer un avenir plus vert et plus durable.
            </p>
            <p className=" max-w-3xl mt-4 text-lg text-gray-700">
              Notre plateforme est conçue pour être simple, intuitive et sécurisée. Que vous soyez conducteur ou passager, nous mettons tout en œuvre pour que votre expérience soit agréable et sans tracas.
            </p>
            </div>
          </div>
        </motion.div>

        <h2 className="mt-30 text-3xl font-bold text-green-600 mb-8">Pourquoi choisir EcoRide ?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "🌍 Écologique", desc: "Réduisez votre empreinte carbone en partageant vos trajets.", src: "https://images.unsplash.com/photo-1613858749733-3a3e456e3d9e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
            { title: "💸 Économique", desc: "Faites des économies sur vos déplacements quotidiens.", src: "https://images.unsplash.com/photo-1607863680198-23d4b2565df0?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
            { title: "🤝 Convivial", desc: "Voyagez avec des gens qui partagent vos valeurs.", src:"https://images.unsplash.com/photo-1561065475-b0dc9f889ee7?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGVyc29ubmVzJTIwc291cmlhbnRlcyUyMGVuJTIwdm9pdHVyZXN8ZW58MHx8MHx8fDA%3D" },
            { title: "🛡️ Sécurisé", desc: "La sécurité de nos utilisateurs est notre priorité. Grâce à un système de vérification rigoureux, des profils transparents et des fonctionnalités de messagerie sécurisée, vous voyagez sereinement avec des personnes de confiance.", src:"https://plus.unsplash.com/premium_photo-1700830328177-0019f0adcba5?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FkZW5hcyUyMGVuJTIwZm9uZCUyMG51bWVyaXF1ZXN8ZW58MHx8MHx8fDA%3D" },
            { title: "👥 Communautaire", desc: "Rejoignez une communauté de conducteurs et passagers engagés.", src:"https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29uZHVjdGV1cnxlbnwwfHwwfHx8MA%3D%3D" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.05,
                rotate: 3,
                transition: { duration: 0.3 }
              }}
              transition={{
                delay: idx * 0.3,
                duration: 0.6,
                type: "tween", // Utilisation de tween pour une animation fluide et linéaire
                ease: "easeOut" // Courbe d'accélération/décélération
              }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500">
                <motion.h3
                  className="text-xl font-semibold mb-2"
                  whileHover={{ scale: 1.1, color: "#38a169" }} // Animation sur le titre au survol
                  transition={{ duration: 0.3 }}
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  className="text-gray-700"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {item.desc}
                </motion.p>
                <motion.img
                  src={item.src}
                  alt={item.title}
                  className="mt-4 rounded-lg shadow-lg"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
               
              </div>
            </motion.div>
          ))}
        </div>
      </section>



      <section className="py-16 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-8">Comment ça marche ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "1. Inscription", desc: "Créez un compte et rejoignez notre communauté." },
            { step: "2. Recherche", desc: "Indiquez vos lieux et date pour trouver un trajet." },
            { step: "3. Covoiturage", desc: "Réservez, partagez et partez en toute tranquillité." },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, rotate: 3, transition: { type: "spring", stiffness: 300, damping: 10 } }}
              transition={{ delay: idx * 0.3, duration: 0.6, type: "spring", stiffness: 150 }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-6 rounded-xl shadow-md text-green-700 border border-green-200">
                <h3 className="text-xl font-bold mb-2">{item.step}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      {/* Témoignages */}
      <section className="py-16 px-6 text-center bg-white">
        <h2 className="text-3xl font-bold text-green-600 mb-8">Ils nous font confiance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            `"Grâce à EcoRide, j’ai trouvé un covoiturage pour mes trajets quotidiens. Moins de stress et plus d’économies !" – Sophie`,
            `"Une solution simple et écologique. J’adore l’interface et le service." – Pierre`,
            `"EcoRide m’a permis de faire des rencontres tout en réduisant mon impact environnemental." – Clara`,
          ].map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, rotate: 3, transition: { type: "spring", stiffness: 300, damping: 10 } }}
              transition={{ delay: idx * 0.3, duration: 0.6, type: "spring", stiffness: 150 }}
              viewport={{ once: true }}
            >
              <div key={idx} className="bg-green-100 p-6 rounded-xl italic shadow-md">{msg}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 text-center text-gray-600">
        <p>Contact : <a href="mailto:contact@ecoride.com" className="text-green-600 hover:underline">contact@ecoride.com</a></p>
        <a href="/mentions-legales" className="text-green-600 hover:underline">Mentions légales</a>
      </footer>
    </div>
  );
};

export default Home;
