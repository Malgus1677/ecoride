// StarRating.tsx
import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  note: number
  setNote: (note: number) => void
}

export const StarRating = ({ note, setNote }: StarRatingProps) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={`w-6 h-6 cursor-pointer transition-colors ${
            value <= note ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => setNote(value)}
        />
      ))}
    </div>
  )
}
