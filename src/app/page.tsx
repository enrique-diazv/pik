import { Brand } from "@/components/ui/brand";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Brand />
        <span className={styles.tagline}>Belleza y bienestar</span>
      </header>
      <main className={styles.main}>
        <p className={styles.eyebrow}>Un momento para ti</p>
        <h1>Tu bienestar.<br /><span>Tu momento.</span></h1>
        <p className={styles.intro}>
          Salones, barberías, spas y estudios de uñas. Todo para encontrar ese
          espacio que te hace sentir bien.
        </p>
        <div className={styles.cards}>
          <article className={styles.card}>
            <span className={styles.number}>01</span>
            <h2>Tu próxima cita</h2>
            <p>Elige tu servicio, quién te atiende y el horario que va contigo.</p>
          </article>
          <article className={styles.card}>
            <span className={styles.number}>02</span>
            <h2>Tu negocio en PIK</h2>
            <p>Un espacio para tus servicios, tu equipo y tus próximos clientes.</p>
          </article>
        </div>
      </main>
      <footer className={styles.footer}>Más tiempo para sentirte bien.</footer>
    </div>
  );
}
