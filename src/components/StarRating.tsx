"use client";

import { useState } from "react";

export function StarRating({
  value,
  onChange,
  color,
}: {
  value: number;
  onChange: (value: number) => void;
  color: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex justify-center gap-2" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (hovered ?? value) >= star;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            className="text-4xl transition-transform hover:scale-110"
            style={{ color: filled ? color : "#d4d4d8" }}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
