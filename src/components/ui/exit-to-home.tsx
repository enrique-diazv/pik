import Link from "next/link";
import styles from "./exit-to-home.module.css";

export function ExitToHome() {
  return (
    <Link
      href="/"
      className={styles.link}
      aria-label="Volver al inicio"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="m6 6 12 12M18 6 6 18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </Link>
  );
}