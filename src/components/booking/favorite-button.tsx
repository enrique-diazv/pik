"use client";

import { useState } from "react";
import styles from "./booking.module.css";

export function FavoriteButton() {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <button
      type="button"
      className={styles.favoriteButton}
      aria-label={
        isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
      }
      aria-pressed={isFavorite}
      onClick={() => setIsFavorite((current) => !current)}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={isFavorite ? "currentColor" : "none"}
        aria-hidden="true"
      >
        <path
          d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}