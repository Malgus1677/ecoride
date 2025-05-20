'use client';

import { useState, useEffect } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import Link from 'next/link';
import Image from 'next/image';

interface Avis {
    id: number;
    commentaire: string;
    note: number;
    valide: boolean;
    date: string;
    conducteur_info: any; // remplace "any" par le bon type si tu veux typer les objets
    covoit_info: any;
    utilisateur_info: any;
}

interface AvisResponse {
    moyenne_note: number;
    avis: Avis[];
}


interface CovoiturageComplet {
    covoit: {
        covoiturage_id: number;
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
        energie: string;
    };
    proprietaireDetails: {
        pseudo: string;
        photo: string;
        utilisateur_id: number;
    };
}

const CovoiturageCard = ({ covoiturage }: { covoiturage: CovoiturageComplet }) => {
    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const [avisData, setAvisData] = useState<AvisResponse | null>(null);
    const profileImageUrl = `http://localhost:5000${covoiturage.proprietaireDetails?.photo?.replace(/\\/g, "/")}` || '/default-avatar.png';
    console.log(covoiturage)

    useEffect(() => {
        if (covoiturage && covoiturage.proprietaireDetails) {
            const condId = covoiturage.proprietaireDetails.utilisateur_id
            fetch(`http://localhost:5000/api/avis/user/${condId}`)
                .then(res => res.json())
                .then(data => setAvisData(data))
                .catch(err => console.error("Erreur lors de la récupération des avis", err));
        }
    }, [covoiturage]);
    console.log(avisData)


    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatHeure = (heureStr: string): string => {
        if (!heureStr) return 'Heure invalide';
        const dateTimeStr = `1970-01-01T${heureStr}:00`; // Ajout des secondes
        const date = new Date(dateTimeStr);
        return isNaN(date.getTime())
            ? 'Heure invalide'
            : date.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false, // format 24h
            });
    };


    const isEcologique = covoiturage.vehicule.energie.toLowerCase() === 'électrique' || covoiturage.vehicule.energie.toLowerCase() === 'hybride' || covoiturage.vehicule.energie.toLowerCase() === 'ethanol'

    return (
        <div className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-xl overflow-hidden shadow-xl bg-gradient-to-r from-green-100 to-blue-200 text-black transition-transform transform hover:scale-105 mx-auto">
            <div className="p-4 sm:p-6">

                {/* Image du conducteur et infos */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
                    <div className="flex justify-center sm:justify-start mb-4 sm:mb-0">
                        <Image
                            src={profileImageUrl}
                            alt={`${covoiturage.proprietaireDetails.pseudo}`}
                            width={60}
                            height={60}
                            className={`rounded-full border-2 ${isEcologique ? 'border-green-500' : 'border-red-500'}`}
                        />
                    </div>
                    <div className="flex-1 space-y-1 text-center sm:text-left">
                        <h3 className="text-xl font-semibold text-gray-800">{covoiturage.proprietaireDetails.pseudo}</h3>
                        <p className="text-sm text-gray-600">{avisData?.moyenne_note}/5</p>
                    </div>
                    <div className="text-center sm:text-right mt-2 sm:mt-0">
                        {covoiturage.covoit.statut === 'disponible' ? (
                            <span className="text-green-500 font-semibold text-sm">Conducteur disponible</span>
                        ) : (
                            <span className="text-red-500 font-semibold text-sm">Conducteur indisponible</span>
                        )}
                    </div>
                </div>

                {/* Indicateur écologique */}
                <div className="flex items-center space-x-2 mb-4 justify-center sm:justify-start">
                    {isEcologique ? (
                        <>
                            <span className="text-green-500 text-xl">🌿</span>
                            <span className="text-green-600 font-semibold">Écologique</span>
                            <p className='text-green-600 font-semibold'> {covoiturage.vehicule.energie}</p>
                        </>
                    ) : (
                        <>
                            <span className="text-red-500 text-xl">❌</span>
                            <span className="text-red-600 font-semibold">Non écologique</span>
                            <p className='text-red-600 font-semibold'> {covoiturage.vehicule.energie}</p>
                        </>
                    )}
                </div>

                {/* Informations */}
                <div className="space-y-1 text-sm text-gray-700">
                    <p><strong>Durée du trajet : </strong> {covoiturage.dureeTrajet}</p>
                    <p><strong>Lieu départ :</strong> {covoiturage.covoit.lieu_depart} à {formatHeure(covoiturage.covoit.heure_depart)} le {formatDate(covoiturage.covoit.date_depart)}</p>
                    <p><strong>Lieu arrivée :</strong> {covoiturage.covoit.lieu_arrivee} à {formatHeure(covoiturage.covoit.heure_arrivee)}  le {formatDate(covoiturage.covoit.date_arrivee)}</p>
                </div>

                <p className="mt-3 text-lg text-gray-800 font-semibold text-center sm:text-left">Prix : {covoiturage.covoit.prix_personne} crédits</p>

                {/* Détails avec popover */}
                <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Link
                            href={`/covoiturages/${covoiturage.covoit.covoiturage_id}`}
                            className="text-blue-500 hover:underline mt-4 block text-center"
                            onMouseEnter={() => setPopoverOpen(true)}
                            onMouseLeave={() => setPopoverOpen(false)}
                        >
                            Voir les détails
                        </Link>
                    </PopoverTrigger>
                    <PopoverContent className="w-full max-w-sm rounded-xl shadow-xl bg-gradient-to-r from-green-100 to-blue-200 text-black p-6">
                        <div className="flex flex-col space-y-4 text-sm font-medium text-gray-700">
                            <p><strong>Date de départ :</strong> {formatDate(covoiturage.covoit.date_depart)} à {formatHeure(covoiturage.covoit.heure_depart)}</p>
                            <p><strong>Date d'arrivée :</strong> {formatDate(covoiturage.covoit.date_arrivee)} à {formatHeure(covoiturage.covoit.heure_arrivee)}</p>
                            <p><strong>Nombre de places :</strong> {covoiturage.covoit.nb_place}</p>
                            <p><strong>Bagages :</strong> {covoiturage.covoit.nb_bagage}</p>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );

};

export default CovoiturageCard;
