import { StarRating } from "./staring"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export const AvisPopover = ({ trajet, user }: { trajet: any; user: any }) => {
  const [commentaire, setCommentaire] = useState("")
  const [note, setNote] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification que la note est bien définie et est un entier valide
    if (note < 1 || note > 5) {
        alert("La note doit être un entier entre 1 et 5.");
        return;
    }

    try {
        // Envoi des données à l'API pour sauvegarder l'avis dans la base de données
        const response = await fetch('http://localhost:5000/api/avis/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                note,               
                commentaire,        
                utilisateur_id: user,  
                covoiturage_id: trajet, 
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Avis soumis avec succès !");
            // Réinitialiser le formulaire après envoi réussi
            setNote(0);
            setCommentaire("");
        } else {
            alert(`Erreur : ${data.message}`);
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'avis:", error);
        alert("Une erreur est survenue lors de l'envoi de l'avis.");
    }
};


  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Laisser un avis</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-6 rounded-xl shadow-lg">
        <h2 className="font-semibold text-lg mb-3">Votre avis</h2>
        <StarRating note={note} setNote={setNote} />
        <Textarea
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          placeholder="Écris ton avis ici..."
          className="h-40 my-4 resize-none"
        />
        <Button onClick={handleSubmit} className="w-full">
          Envoyer
        </Button>
      </PopoverContent>
    </Popover>
  )
}
