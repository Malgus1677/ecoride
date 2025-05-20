"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";

const AvisCard = ({ avis, actions }: { avis: any; actions?: React.ReactNode }) => {
  const { utilisateur_info, covoit_info } = avis;
  const profileImageUtilisateurUrl =
    `http://localhost:5000${utilisateur_info?.photo?.replace(/\\/g, "/")}` || "/default-avatar.png";

  return (
    <Card className="w-full rounded-2xl shadow-md border-l-4 border-emerald-400">
      <CardContent className="p-4 space-y-4">
        {/* Titre + note */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={profileImageUtilisateurUrl}
              alt="Passager"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <span className="font-medium text-gray-800">
              {utilisateur_info?.prenom} {utilisateur_info?.nom}
            </span>
          </div>
          <div className="flex items-center gap-1 text-yellow-500 font-bold">
            <Star className="w-4 h-4 fill-yellow-400" />
            <span>{avis.note}/5</span>
          </div>
        </div>

        {/* Commentaire */}
        <p className="text-gray-600 italic text-lg">"{avis.commentaire}"</p>

        {/* Trajet */}
        <div className="text-gray-700">
          🚗 {covoit_info?.lieuDepart} → {covoit_info?.lieuArrivee}
        </div>

        {avis.note <= 2 && avis.conducteur_info && (
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm text-red-700 font-semibold mb-2">🚨 Covoiturage problématique</h4>
            <p className="text-sm text-gray-700 mb-1">
              <strong>Conducteur :</strong> {avis.conducteur_info.prenom} {avis.conducteur_info.nom}
            </p>
            <p className="text-sm text-gray-700 mb-3">
              <strong>Email :</strong> {avis.conducteur_info.email}
            </p>
           
          </div>
        )}

        {/* Boutons optionnels */}
        {actions && <div className="pt-2">{actions}</div>}
      </CardContent>
    </Card>
  );
};

export default AvisCard;
