import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <p className={styles.author}>Demo por Enrique Díaz Vera</p>

      <h1>
        Prueba técnica.
        <br />
        <span>Dos vistas en PIK.</span>
      </h1>

      <p className={styles.intro}>
        Demostración de dos vistas: alta de un negocio y agendamiento de
        una cita. Los datos son de prueba.
      </p>

      <nav className={styles.cards} aria-label="Vistas de la prueba">
        <Link href="/business/onboarding" className={styles.card}>
          <span className={styles.number}>01</span>
          <h2>Vista 1. Alta de un negocio</h2>
          <p>
            Registro de información, ubicación, horarios, servicios y staff.
          </p>
          <span className={styles.action}>Abrir vista →</span>
        </Link>

        <Link href="/booking" className={styles.card}>
          <span className={styles.number}>02</span>
          <h2>Vista 2. Agendamiento de una cita</h2>
          <p>
            Selección de servicio, staff, fecha y horario, con confirmación
            de la reserva.
          </p>
          <span className={styles.action}>Abrir vista →</span>
        </Link>
      </nav>
    </main>
  );
}